export function copyText(text: string): Promise<void> {
  if ("clipboard" in navigator) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const textArea = document.createElement("textarea");
    textArea.style.position = "fixed";
    textArea.style.left = "-999px";
    textArea.style.top = "-999px";
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      resolve();
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(textArea);
    }
  });
}
