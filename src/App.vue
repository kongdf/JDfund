<script setup>
import { reactive } from 'vue';

import { fetch } from '@tauri-apps/api/http';


const state = reactive({
  price: "",
  color:''
})


const getJDPrice = async () => {
  const response = await fetch('https://api.jdjygold.com/gw/generic/hj/h5/m/latestPrice', {
    method: 'GET',
    timeout: 30,
  });
  console.log(response)
  state.price = response.data.resultData.datas.price
  
  if(Number(response.data.resultData.datas.price)>Number(response.data.resultData.datas.yesterdayPrice)){
    state.color='red'
  }else if(Number(response.data.resultData.datas.price)<Number(response.data.resultData.datas.yesterdayPrice)){
    state.color='green'
  } 
}
getJDPrice()
setInterval(() => {
  getJDPrice()
}, 2000);
</script>

<template>
  <div data-tauri-drag-region style="margin-top: 3px;cursor: default;" :class="state.color">
    {{ state.price }}
  </div>
 
</template>

<style>
*{
  padding: 0;
  margin: 0;
}
html{
text-align: center;
 
}
body{ 
  
}
 .red{
  color: red;
 }
 .green{
  color: green;
 }
</style>
