import { revalidatePath, updateTag } from "next/cache";
import { readContentState } from "@/lib/content";

/** Only call after a successful write, from an authenticated server action. */
export async function publishContent(): Promise<{ warning?: string }> {
  updateTag("portfolio-content");
  revalidatePath("/", "layout");
  const state = await readContentState(true);
  if (state.source === "local") {
    return { warning: "Saved to the database. This preview uses local content, so it will not display database edits." };
  }
  if (state.source === "fallback") {
    return { warning: "Saved to the database. The public site is still using fallback content. Resolve the data connection or pending migration before the edit can appear." };
  }
  return {};
}
