<script setup>
import { reactive } from 'vue';
import { fetch } from '@tauri-apps/plugin-http';
import WebSocket from '@tauri-apps/plugin-websocket';
import { getCurrentWindow } from '@tauri-apps/api/window';

const state = reactive({
  price: "",
  priceZS: '',
  color: '',
  color2: '',
  priceDP: '',
})

var ws;

const headersend = async () => {
  await ws.send(JSON.stringify({
    "cmd_id": 22000,
    "seq_id": 123,
    "trace": "719292a3a922cfa946a49923c29fb7e5-c-app",
    "data": {}
  }));
}




const initWS = async () => {
  ws = await WebSocket.connect('wss://quote.tradeswitcher.com/quote-b-ws-api?token=719292a3a922cfa946a49923c29fb7e5-c-app');

  ws.addListener((msg) => {
    let data = JSON.parse(msg.data)
    console.log('Received Message:', data);
    if (data?.data?.price) {
      state.priceDP = data?.data?.price

    }
  });


  await ws.send(JSON.stringify({
    "cmd_id": 22004,
    "seq_id": 123,
    "trace": "719292a3a922cfa946a49923c29fb7e5-c-app",
    "data": {
      "symbol_list": [
        {
          "code": "GOLD",
        }
      ]
    }
  }));
  setInterval(() => {
    headersend()
  }, 10000);
}


initWS()

const getJDPrice = async () => {


  const data = await fetch('https://api.jdjygold.com/gw/generic/hj/h5/m/latestPrice', {
    method: 'GET',
    timeout: 30,
  }).then(response => response.json());
  state.price = data.resultData.datas.price

}
const getJDPriceZS = async () => {
  const data = await fetch('https://api.jdjygold.com/gw2/generic/jrm/h5/m/stdLatestPrice?productSku=1961543816', {
    method: 'post',
    data: {
      reqData: { "productSku": "1961543816" }
    },
    timeout: 30,
  }).then(response => response.json());
  state.priceZS = data.resultData.datas.price

}



const getPrice = async () => {
  getJDPrice()
  getJDPriceZS()
}
getPrice()
setInterval(() => {
  getPrice()
}, 3000);

const close = async() => {
  await getCurrentWindow().close();
}
</script>

<template>


  <div data-tauri-drag-region style="margin-top: 3px;cursor: default;" class="red">
    民生：{{ state.price }}

  </div>
  <div data-tauri-drag-region style="margin-top: 0px;cursor: default;" class="red">
    浙商：{{ state.priceZS }}
  </div>
  <div data-tauri-drag-region style="margin-top: 0px;cursor: default;" class="red">
    现货：{{ state.priceDP }}
  </div>
  <div class="close" @click="close">
    关闭
  </div>
</template>

<style>
* {
  padding: 0;
  margin: 0;
}

html {
  background-color: #2f2f2f;
  padding-left: 10px;

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
