import { onMounted, onUnmounted } from "vue";
import { fetch } from "@tauri-apps/plugin-http";
import { BANK_HTTP, HTTP_TIMEOUT_SEC, POLL_INTERVAL_MS, pickListedPrice } from "@/config/jdGoldApi";

const FAIL = "获取失败";

/**
 * 轮询三家银行 HTTP 牌价，写入 state 上对应字段。
 * @param {{ minshengPrice: string, icbcPrice: string, zheshangPrice: string }} state
 * @param {{ intervalMs?: number }} [options]
 */
export function useHttpBankPrices(state, options = {}) {
  const intervalMs = options.intervalMs ?? POLL_INTERVAL_MS;
  let timer = null;

  async function pullMinsheng() {
    const { method, url } = BANK_HTTP.MS;
    const response = await fetch(url, { method, timeout: HTTP_TIMEOUT_SEC });
    const data = await response.json();
    state.minshengPrice = pickListedPrice(data) ?? FAIL;
  }

  async function pullZheshang() {
    const { method, url, body } = BANK_HTTP.ZS;
    const response = await fetch(url, { method, data: body, timeout: HTTP_TIMEOUT_SEC });
    const data = await response.json();
    state.zheshangPrice = pickListedPrice(data) ?? FAIL;
  }

  async function pullIcbc() {
    const { method, url, body } = BANK_HTTP.GH;
    const response = await fetch(url, { method, data: body, timeout: HTTP_TIMEOUT_SEC });
    const data = await response.json();
    state.icbcPrice = pickListedPrice(data) ?? FAIL;
  }

  async function fetchAll() {
    await Promise.all([pullMinsheng(), pullZheshang(), pullIcbc()]);
  }

  onMounted(() => {
    fetchAll().catch((e) => console.error("银行牌价拉取失败:", e));
    timer = setInterval(() => {
      fetchAll().catch((e) => console.error("银行牌价拉取失败:", e));
    }, intervalMs);
  });

  onUnmounted(() => {
    if (timer != null) {
      clearInterval(timer);
      timer = null;
    }
  });

  return { fetchAll };
}
