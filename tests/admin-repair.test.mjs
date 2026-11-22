import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { seed } from "../src/lib/content/seed.ts";

// Optional local PostgreSQL test engine, never a production database connection.
const moduleName = process.env.PGLITE_MODULE
  ? pathToFileURL(resolve(process.env.PGLITE_MODULE)).href : "@electric-sql/pglite";
const { PGlite } = await import(moduleName);
const snapshotPath = process.env.CONTENT_TEST_SNAPSHOT ?? ".portfolio-backups/content-before-admin-refresh-2026-11-21.json";
const snapshot = JSON.parse(await readFile(snapshotPath,"utf8"));
const schema = await readFile("supabase/schema.sql","utf8");
const repair = await readFile("supabase/repair-admin-20261122.sql","utf8");
const rollback = await readFile("supabase/rollback-admin-20261122.sql","utf8");
const bootstrap = `create role anon; create role authenticated;
  create schema auth; create table auth.users (id uuid primary key);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
  create schema storage; create table storage.buckets(id text primary key,name text,public boolean);
  create table storage.objects(id uuid default gen_random_uuid(),bucket_id text);`;
const protectedTables = ["messages","auth.users","storage.objects","gallery","testimonials","services","faqs"];
async function capture(db) {
  const result={};
  for(const table of [...Object.keys(snapshot),...protectedTables]) {
    result[table]=(await db.query(`select * from ${table} order by ${table==='sections'?'key':'id'}`)).rows;
    if(table==='stats')result[table].forEach(row=>{row.value=Number(row.value);});
  }
  return result;
}
async function existingDatabase() {
  const db=new PGlite();
  await db.exec(bootstrap);
  await db.exec(schema.replace('value numeric not null','value integer not null'));
  await db.exec('alter table public.projects drop column categories;');
  for(const [table,rows] of Object.entries(snapshot))for(const row of rows){
    const columns=Object.keys(row).filter(key=>key!=='categories').join(',');
    await db.query(`insert into ${table} (${columns}) select ${columns} from jsonb_populate_record(null::${table},$1::jsonb)`,[JSON.stringify(row)]);
  }
  await db.exec(`insert into messages(name,email,message) values ('Keep message','test@example.invalid','Keep this inbox item');
    insert into auth.users values ('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa');
    insert into storage.objects(bucket_id) values ('media');
    insert into projects(slug,title,published) values ('unrelated-draft','Keep draft',false);
    insert into projects(slug,title,published,cover_url,gallery) values ('playarena','Existing private project',false,'/personal-cover.png',array['/personal-gallery.png']);
    insert into stats(label,value,suffix) values ('Software Project Experience',1,'+ Years');
    update site_settings set accent_color = '#123abc';`);
  return db;
}

const db=await existingDatabase();
const before=await capture(db);
await db.exec(repair);
const after=await capture(db);
assert.equal(after.projects.filter(row=>row.published).length,20);
assert.equal(after.stats.length,3);
assert.equal(Number(after.stats.find(row=>row.label==='CGPA').value),3.77);
assert.equal(after.stats.find(row=>row.label==='Projects & Research').suffix,'+');
assert.equal(after.stats.find(row=>row.label==='Experience').suffix,'+ years');
assert.equal(after.stats.find(row=>row.label==='Experience').id,before.stats.find(row=>row.label==='Software Project Experience').id);
assert.equal(after.site_settings[0].site_title,'Ashfaq Riyaldeen');
assert.equal(after.site_settings[0].accent_color,'#123abc');
assert.equal(after.profile[0].avatar_url,seed.profile.avatarUrl);
assert.equal(after.certifications.length,6);
assert.equal(after.skill_categories.length,11);
assert.equal(after.projects.find(row=>row.slug==='playarena').id,before.projects.find(row=>row.slug==='playarena').id);
assert.equal(after.projects.find(row=>row.slug==='playarena').cover_url,'/personal-cover.png');
assert.deepEqual(after.projects.find(row=>row.slug==='playarena').gallery,['/personal-gallery.png']);
assert.equal(after.projects.find(row=>row.slug==='unrelated-draft').published,false);
for(const table of protectedTables)assert.deepEqual(after[table],before[table],table+' preserved');
await db.exec(repair);
assert.deepEqual(await capture(db),after,'rerunning repair is a no-op');

await db.exec('grant usage on schema public,auth to anon,authenticated; grant select,update on public.sections to authenticated; set role anon');
await assert.rejects(db.query('select * from portfolio_maintenance.repairs'),/permission denied/);
await assert.rejects(db.query("select public.save_section_layout('[]'::jsonb)"),/permission denied/);
await db.exec('set role authenticated');
await assert.rejects(db.query('select * from portfolio_maintenance.repairs'),/permission denied/);
await assert.rejects(db.query("select public.save_section_layout('[]'::jsonb)"),/Not signed in/);
await db.query("select set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',false)");
const layout=after.sections.slice().reverse().map((section,index)=>({key:section.key,visible:!section.visible,sortOrder:index+1}));
await db.query('select public.save_section_layout($1::jsonb)',[JSON.stringify(layout)]);
assert.deepEqual((await db.query('select key,visible,sort_order as "sortOrder" from sections order by sort_order')).rows,layout);
await assert.rejects(db.query('select public.save_section_layout($1::jsonb)',[JSON.stringify([layout[0],...layout.slice(0,-1)])]));
assert.deepEqual((await db.query('select key,visible,sort_order as "sortOrder" from sections order by sort_order')).rows,layout);
await db.exec('reset role');
const edited=await capture(db);
await db.exec(repair);
assert.deepEqual(await capture(db),edited,'repair preserves admin edits made after the first application');
await assert.rejects(db.exec(rollback),/changed after the repair/);
await db.exec('rollback');
assert.deepEqual(await capture(db),edited,'rollback refuses to overwrite later edits');
for(const section of after.sections)await db.query('update sections set visible=$1,sort_order=$2 where key=$3',[section.visible,section.sort_order,section.key]);
await db.exec(rollback);
const restored=await capture(db);
restored.projects.forEach(row=>{delete row.categories;});
assert.deepEqual(restored,before,'rollback restores the complete captured content');
await db.exec(rollback);
console.log('Existing database: migration, private backup, preserved drafts/uploads/messages, section saves, repeat-run guard, and exact rollback passed.');
await db.close();

const ambiguous=await existingDatabase();
await ambiguous.exec("insert into skill_categories(name) select name from skill_categories limit 1");
const unchanged=await capture(ambiguous);
await assert.rejects(ambiguous.exec(repair),/More than one existing record matches/);
await ambiguous.exec('rollback');
assert.deepEqual(await capture(ambiguous),unchanged,'mid-repair failure rolls back content and schema changes');
assert.equal((await ambiguous.query("select count(*)::int as n from information_schema.columns where table_name='projects' and column_name='categories'")).rows[0].n,0);
await ambiguous.close();
console.log('Injected conflicting records: complete transaction rollback passed.');

const fresh=new PGlite();
await fresh.exec(bootstrap);
await fresh.exec(schema);
await fresh.exec(repair);
assert.equal((await fresh.query('select count(*)::int as n from projects where published')).rows[0].n,20);
await fresh.close();
console.log('Fresh database: schema plus repair passed. No live writes performed.');
