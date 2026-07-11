/**
 * Hand-off between the preloader and the hero intro: the hero holds its
 * entrance until the curtain starts lifting, so first-time visitors actually
 * see it. The preloader opens the gate at exit-start (or immediately when
 * skipped / reduced motion), with a hard timeout so it can never stay shut.
 */
let done = false;
const subs = new Set<() => void>();

export function markPreloaderDone() {
  if (done) return;
  done = true;
  subs.forEach((fn) => fn());
  subs.clear();
}

/** Runs `cb` once the preloader finishes (immediately if it already has). */
export function onPreloaderDone(cb: () => void): () => void {
  if (done) {
    cb();
    return () => {};
  }
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}
