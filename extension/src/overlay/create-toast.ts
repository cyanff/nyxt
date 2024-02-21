export function createToast(
  toastHTML: string,
  toastWrapper: HTMLElement
): HTMLElement {
  const closeToast = (e) => {
    toastWrapper.style.opacity = "0";
  };
  toastWrapper.addEventListener("click", closeToast);
  toastWrapper.innerHTML = toastHTML;
  toastWrapper.style.opacity = "100";
  setTimeout(() => {
    toastWrapper.style.opacity = "0";
  }, 5000);
  return toastWrapper;
}
