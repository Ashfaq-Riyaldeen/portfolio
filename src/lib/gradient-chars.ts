/**
 * `background-clip: text` doesn't paint through SplitText's inline-block
 * wrappers, so gradient characters go invisible. Repaint each split char
 * with the same gradient, sized to the whole gradient span and offset so
 * the sweep still reads as one continuous gradient across the word.
 */
export function paintGradientChars(root: HTMLElement, chars: Element[]) {
  // Splitting can leave an emptied clone of the gradient span behind — the
  // one that owns the text is the one the chars actually live in.
  const gradientRoot = [
    ...root.querySelectorAll<HTMLElement>(".text-gradient"),
  ].find((el) => (el.textContent ?? "").length > 0);
  if (!gradientRoot) return;
  const gradient = getComputedStyle(gradientRoot).backgroundImage;
  const rootBox = gradientRoot.getBoundingClientRect();
  if (gradient === "none" || rootBox.width === 0) return;
  for (const char of chars) {
    if (!gradientRoot.contains(char)) continue;
    const el = char as HTMLElement;
    const box = el.getBoundingClientRect();
    el.style.backgroundImage = gradient;
    el.style.backgroundSize = `${rootBox.width}px 100%`;
    el.style.backgroundPosition = `${rootBox.left - box.left}px 0`;
    el.style.webkitBackgroundClip = "text";
    el.style.backgroundClip = "text";
    el.style.color = "transparent";
  }
}
