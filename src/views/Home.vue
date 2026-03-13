@ -1,341 +1,5 @@


<template>
  <div class="content" data-tauri-drag-region ref="contentRef">
    <div class="price-item" data-tauri-drag-region v-if="selectShow.includes('XAU')">
      <span class="label" data-tauri-drag-region>X:</span>
      <span class="value" data-tauri-drag-region>
        {{ xauPrice }}
      </span>
    </div>
    <div class="price-item" data-tauri-drag-region v-if="selectShow.includes('MS')">
      <span class="label" data-tauri-drag-region>民:</span>
      <span class="value" data-tauri-drag-region>{{ minshengPrice }}</span>
    </div>
    <div class="price-item" data-tauri-drag-region v-if="selectShow.includes('GH')">
      <span class="label" data-tauri-drag-region>工:</span>
      <span class="value" data-tauri-drag-region>{{ icbcPrice }}</span>
    </div>
    <div class="price-item" data-tauri-drag-region v-if="selectShow.includes('ZS')">
      <span class="label" data-tauri-drag-region>浙:</span>
      <span class="value" data-tauri-drag-region>{{ zheshangPrice }}</span>
    </div>
    <el-button type="primary" v-if="!selectShow.length" @click="handleClick">设置</el-button>
  </div>
</template>
<script setup>
import { reactive, toRefs, onMounted, onUnmounted, ref, nextTick } from "vue";
import { fetch } from "@tauri-apps/plugin-http";
import WebSocket from '@tauri-apps/plugin-websocket';
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
const contentRef = ref(null);



const CONSTANTS = {
  HTTP_FETCH_INTERVAL: 3000, // HTTP 请求间隔 (3秒)
  WS_RECONNECT_INTERVAL: 5 * 60 * 1000, // WebSocket 自动重连间隔 (5分钟)
  WS_URL: "wss://cfws.jdjygold.com/data",
};

// --- 2. 响应式状态 ---
/** @type {PriceState} */
const state = reactive({
  xauPrice: "--",
  minshengPrice: "--",
  icbcPrice: "--",
  zheshangPrice: "--",
  wsStatus: "disconnected",
  selectShow: []
});


// 使用 toRefs 使模板中可以直接使用 state 的属性，且保持响应性
const { xauPrice, minshengPrice, icbcPrice, zheshangPrice, selectShow } = toRefs(state);


// --- 4. HTTP 请求逻辑 ---

/**
 * 获取民生银行黄金价格
 */
const fetchMinshengPrice = async () => {
  try {
    const response = await fetch("https://api.jdjygold.com/gw/generic/hj/h5/m/latestPrice", {
      method: "GET",
      timeout: 30,
    });
    const data = await response.json();
    console.error("获取民生银行:", data);
    state.minshengPrice = data.resultData?.datas?.price || "获取失败";
  } catch (error) {
    console.error("获取民生银行价格失败:", error);
    state.minshengPrice = "获取失败";
  }
};

/**
 * 获取浙商银行黄金价格
 */
const fetchZheshangPrice = async () => {
  try {
    const response = await fetch("https://api.jdjygold.com/gw2/generic/jrm/h5/m/stdLatestPrice?productSku=1961543816", {
      method: "POST",
      data: { reqData: { productSku: "1961543816" } },
      timeout: 30,
    });
    const data = await response.json();
    state.zheshangPrice = data.resultData?.datas?.price || "获取失败";
  } catch (error) {
    console.error("获取浙商银行价格失败:", error);
    state.zheshangPrice = "获取失败";
  }
};

/**
 * 获取工商银行黄金价格
 */
const fetchIcbcPrice = async () => {
  try {
    const response = await fetch("https://api.jdjygold.com/gw2/generic/jrm/h5/m/icbcLatestPrice?productSku=2005453243", {
      method: "POST",
      data: { reqData: { productSku: "2005453243" } },
      timeout: 30,
    });
    const data = await response.json();
    state.icbcPrice = data.resultData?.datas?.price || "获取失败";
  } catch (error) {
    console.error("获取工商银行价格失败:", error);
    state.icbcPrice = "获取失败";
  }
};

/**
 * 并行获取所有 HTTP 价格数据
 */
const fetchAllHttpPrices = async () => {

  // 使用 Promise.all 并行执行，提高效率
  await Promise.all([fetchMinshengPrice(), fetchZheshangPrice(), fetchIcbcPrice()]);
};

// --- 5. WebSocket 逻辑 ---

let ws = null;
let httpIntervalId = null;


/**
 * 初始化或重连 WebSocket 连接
 */
const initWebsocket = async () => {

  ws = await WebSocket.connect(CONSTANTS.WS_URL);
  ws.send(JSON.stringify({ "action": "2", "bizType": "2", "keys": ["WG-XAUUSD"] }))
  ws.addListener((e) => {
    let data = JSON.parse(e.data)
    state.xauPrice = data.data.lastPrice
  });
};

// --- 6. 生命周期管理 ---
const init = async () => {
  const unlisten = await WebviewWindow.getCurrent().listen('changeList', async (event) => {
    console.log(event, contentRef.value.clientHeight);
    setTimeout(async () => {
      await getCurrentWindow().setSize(new LogicalSize(100, contentRef.value.clientHeight));
    }, 10);
    state.selectShow = event.payload.list;
  });

}
init()

const handleClick = async () => {
  const webview = new WebviewWindow('setting', {
    url: '/setting',
    width: 500,
    height: 100,
    title: '设置',
    x: 100,
    y: 100,
  });
}
onMounted(() => {
  // 应用启动时执行一次
  fetchAllHttpPrices();
  // 设置 HTTP 定期轮询
  httpIntervalId = setInterval(fetchAllHttpPrices, CONSTANTS.HTTP_FETCH_INTERVAL);
  // 初始化 WebSocket 连接
  initWebsocket();
});


</script>
<style>
/* 基础与布局 */
* {
  padding: 0;
  margin: 0;
  user-select: none;
  -webkit-user-select: none;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

body {
  background-color: transparent;
  background-color: #f0f2f5;
  /* 允许窗口透明 */
}


/* 内容区域 */
.content {
  padding: 5px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  padding: 3px 0;
  border-bottom: 1px solid #e0e0e0;
}

.price-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 14px;
  color: #666;
}

.value {
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* WebSocket 状态指示器 */
.ws-status-indicator {
  font-size: 12px;
}

.ws-status-indicator[data-status="connected"] {
  color: #2ecc71;
}

.ws-status-indicator[data-status="connecting"] {
  color: #f39c12;
  animation: pulse 1.5s infinite;
}

.ws-status-indicator[data-status="disconnected"] {
  color: #e74c3c;
}

@keyframes pulse {
  0% {
    opacity: 0.4;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.4;
  }
}

/* 亮色/暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .content {
    background-color: #1e1e2f;
    color: #eee;
  }

  .price-item {
    border-bottom-color: #333;
  }

  .label {
    color: #aaa;
  }
}
</style>