<script setup>
import { reactive } from "vue";
import { fetch } from "@tauri-apps/plugin-http";
import WebSocket from "@tauri-apps/plugin-websocket";
import { getCurrentWindow } from "@tauri-apps/api/window";
var ws;
const state = reactive({
  price: "",
  priceZS: "",
  color: "",
  color2: "",
  priceDP: "",
  priceld:""
});

function throttle(func, delay) {
    let timer = null;
    return function (...args) {
        if (!timer) {
            func.apply(this, args);
            timer = setTimeout(() => {
                timer = null;
            }, delay);
        }
    };
}


const initWebsocket = async () => {
    // 假设 WebSocket 有 connect 方法
     ws = await WebSocket.connect('wss://webhqv1.jrjr.com:39920/ws');
    const handleMessage = throttle((msg) => {
        if (msg.data) {
            let data = JSON.parse(msg.data);
            if (data && data.length) {
                if (data[0].c === 'XAU') {
                    state.priceld = data[0].a;
                    console.log('Received Message:', data[0].a);
                }
            }
        }
    }, 300); // 每 100 毫秒处理一次消息

    ws.addListener(handleMessage);
};




const getJDPrice = async () => {
  const data = await fetch(
    "https://api.jdjygold.com/gw/generic/hj/h5/m/latestPrice",
    {
      method: "GET",
      timeout: 30,
    }
  ).then((response) => response.json());
  state.price = data.resultData.datas.price;
};
const getJDPriceZS = async () => {
  const data = await fetch(
    "https://api.jdjygold.com/gw2/generic/jrm/h5/m/stdLatestPrice?productSku=1961543816",
    {
      method: "post",
      data: {
        reqData: { productSku: "1961543816" },
      },
      timeout: 30,
    }
  ).then((response) => response.json());
  state.priceZS = data.resultData.datas.price;
};

const getPrice = async () => {
  getJDPrice();
  getJDPriceZS();
};
getPrice();
setInterval(() => {
  getPrice();
}, 3000);
initWebsocket()
const close = async () => {
  await getCurrentWindow().close();
};
</script>

<template>
    <div data-tauri-drag-region style="margin-top: 3px; cursor: default" class="red">
    XAU：{{ state.priceld }}
  </div>
  <div data-tauri-drag-region style="margin-top: 3px; cursor: default" class="red">
    民生：{{ state.price }}
  </div>
  <div data-tauri-drag-region style="margin-top: 0px; cursor: default" class="red">
    浙商：{{ state.priceZS }}
  </div>
  <div class="close" @click="close">关闭</div>
</template>

<style>
* {
  padding: 0;
  margin: 0;
}

@media (prefers-color-scheme: dark) {
  html {
    background-color: #2f2f2f;
    padding-left: 10px;
  }
}

/* 当系统处于亮色模式（偏好亮色主题）时应用以下样式 */
@media (prefers-color-scheme: light) {
  html {
    background-color: white;
    padding-left: 10px;
  }
}

html :hover .close {
  display: block;
}

.red {
  color: red;
}

.green {
  color: green;
}

.close {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  color: white;
  display: none;
}
</style>
