<template>
    <el-checkbox-group v-model="selectedOptions" @change="handleChange">

        <el-checkbox v-for="item in options" :label="item.value" :key="item.value" :value="item.value">{{ item.label
            }}</el-checkbox>
    </el-checkbox-group>
</template>

<script setup>
import { ref } from 'vue'
import { getCurrentWebview } from "@tauri-apps/api/webview";
const selectedOptions = ref([]);
const options = [{
    label: "XAU",
    value: "XAU"
}, {
    label: "浙商",
    value: "ZS"
}, {
    label: "民生",
    value: "MS"
}, {
    label: "工行",
    value: "GH"
}]

const handleChange = async (val) => {
    await getCurrentWebview().emitTo('main', 'changeList', { list: val });
} 
</script>