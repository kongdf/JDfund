import { onMounted, onUnmounted } from "vue";
import WebSocket from "@tauri-apps/plugin-websocket";
import { WS_URL, WS_SUBSCRIBE_PAYLOAD, WS_RECONNECT_MS } from "@/config/jdGoldApi";

/**
 * 国际金 XAU WebSocket，失败自动重连。
 * @param {{ xauPrice: string }} state
 */
export function useXauWebSocket(state) {
  let ws = null;
  let removeListener = null;
  let reconnectTimer = null;

  const clearReconnect = () => {
    if (reconnectTimer != null) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  const scheduleReconnect = () => {
    clearReconnect();
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, WS_RECONNECT_MS);
  };

  const connect = async () => {
    try {
      if (ws) {
        try {
          await ws.disconnect();
        } catch {
          /* ignore */
        }
        ws = null;
      }
      if (removeListener) {
        removeListener();
        removeListener = null;
      }
      ws = await WebSocket.connect(WS_URL);
      await ws.send(WS_SUBSCRIBE_PAYLOAD);
      removeListener = ws.addListener((e) => {
        try {
          const data = JSON.parse(e.data);
          const p = data.data?.lastPrice;
          if (p != null && p !== "") state.xauPrice = p;
        } catch {
          /* ignore */
        }
      });
    } catch (e) {
      console.error("WebSocket 连接失败:", e);
      scheduleReconnect();
    }
  };

  onMounted(() => {
    connect();
  });

  onUnmounted(() => {
    clearReconnect();
    if (removeListener) {
      removeListener();
      removeListener = null;
    }
    if (ws) {
      ws.disconnect().catch(() => {});
      ws = null;
    }
  });
}
