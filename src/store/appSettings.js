import { Store } from "@tauri-apps/plugin-store";

const STORE_FILE = "jdfund-settings.json";
const KEY_SELECT_SHOW = "selectShow";
/** 曾用 localStorage 键，首次启动时迁移一次 */
const LEGACY_STORAGE_KEY = "jdfund-select-show";

let storePromise = null;

function getStore() {
  if (!storePromise) {
    storePromise = Store.load(STORE_FILE);
  }
  return storePromise;
}

/**
 * @returns {Promise<string[] | null>}
 */
export async function loadSelectShow() {
  const store = await getStore();
  const val = await store.get(KEY_SELECT_SHOW);
  if (Array.isArray(val) && val.every((x) => typeof x === "string")) {
    return val;
  }
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
      await store.set(KEY_SELECT_SHOW, parsed);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return parsed;
    }
  } catch (_) {
    /* ignore */
  }
  return null;
}

/**
 * @param {string[]} list
 */
export async function saveSelectShow(list) {
  const store = await getStore();
  await store.set(KEY_SELECT_SHOW, list);
}
