import { debounce } from "shared/debounce/model/debounce.ts";

const LOCAL_STORAGE_KEY = "editor:text";

export const load = () => {
  try {
    return window.localStorage.getItem(LOCAL_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
};

export const save = debounce((text: string) => {
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, text);
  } catch { /* noop */ }
}, 1000);
