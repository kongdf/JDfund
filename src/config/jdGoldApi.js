/** 京东积存金相关接口与轮询常量（单一配置源） */

export const HTTP_TIMEOUT_SEC = 30;

export const POLL_INTERVAL_MS = 3000;

export const WS_RECONNECT_MS = 15_000;

export const WS_URL = "wss://cfws.jdjygold.com/data";

/** 订阅国际金 XAU 行情 */
export const WS_SUBSCRIBE_PAYLOAD = JSON.stringify({
  action: "2",
  bizType: "2",
  keys: ["WG-XAUUSD"],
});

/** @param {unknown} data API JSON */
export function pickListedPrice(data) {
  const v = data?.resultData?.datas?.price;
  return v != null && v !== "" ? String(v) : null;
}

export const BANK_HTTP = {
  MS: {
    method: "GET",
    url: "https://api.jdjygold.com/gw/generic/hj/h5/m/latestPrice",
  },
  ZS: {
    method: "POST",
    url: "https://api.jdjygold.com/gw2/generic/jrm/h5/m/stdLatestPrice?productSku=1961543816",
    body: { reqData: { productSku: "1961543816" } },
  },
  GH: {
    method: "POST",
    url: "https://api.jdjygold.com/gw2/generic/jrm/h5/m/icbcLatestPrice?productSku=2005453243",
    body: { reqData: { productSku: "2005453243" } },
  },
};
