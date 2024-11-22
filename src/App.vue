<script setup>
import { reactive } from "vue";
import { fetch } from "@tauri-apps/plugin-http";
import WebSocket from "@tauri-apps/plugin-websocket";
import { getCurrentWindow } from "@tauri-apps/api/window";

const state = reactive({
  price: "",
  priceZS: "",
  color: "",
  color2: "",
  priceDP: "",
});

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

const close = async () => {
  await getCurrentWindow().close();
};
</script>

<template>
  <div
    data-tauri-drag-region
    style="margin-top: 3px; cursor: default"
    class="red"
  >
    民生：{{ state.price }}
  </div>
  <div
    data-tauri-drag-region
    style="margin-top: 0px; cursor: default"
    class="red"
  >
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
