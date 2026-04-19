<template>
  <el-checkbox-group v-model="selectedOptions" @change="handleChange">
    <el-checkbox
      v-for="item in options"
      :key="item.value"
      :label="item.value"
      :value="item.value"
    >
      {{ item.label }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { loadSelectShow, saveSelectShow } from "@/store/appSettings";
import { PRICE_DISPLAY_ROWS } from "@/constants/priceDisplay";

const options = PRICE_DISPLAY_ROWS.map((r) => ({
  label: r.settingLabel,
  value: r.key,
}));

const selectedOptions = ref([]);

const handleChange = async (val) => {
  await saveSelectShow(val);
  await getCurrentWebview().emitTo("main", "changeList", { list: val });
};

onMounted(async () => {
  const list = await loadSelectShow();
  if (list != null) selectedOptions.value = list;
});
</script>
