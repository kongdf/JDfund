<template>
  <div class="content" data-tauri-drag-region ref="contentRef">
    <div
      v-for="row in visibleRows"
      :key="row.key"
      class="price-item"
      data-tauri-drag-region
    >
      <span class="label" data-tauri-drag-region>{{ row.rowLabel }}</span>
      <span class="value" data-tauri-drag-region>{{ displayPrice(row.key) }}</span>
    </div>
    <el-button
      v-if="!selectShow.length"
      class="settings-btn"
      type="primary"
      size="small"
      @click="openOrFocusSettings"
    >
      设置
    </el-button>
  </div>
</template>

<script setup>
import { reactive, toRefs, computed, ref } from "vue";
import { PRICE_DISPLAY_ROWS } from "@/constants/priceDisplay";
import { useHttpBankPrices } from "@/composables/useHttpBankPrices";
import { useXauWebSocket } from "@/composables/useXauWebSocket";
import { useMainWindowSelection } from "@/composables/useMainWindowSelection";

const contentRef = ref(null);

const state = reactive({
  xauPrice: "--",
  minshengPrice: "--",
  icbcPrice: "--",
  zheshangPrice: "--",
  selectShow: [],
});

const { selectShow } = toRefs(state);

/** 只渲染勾选项，:last-child 才是「最后一行」，避免单行时仍带底边框与假空白 */
const visibleRows = computed(() =>
  PRICE_DISPLAY_ROWS.filter((row) => selectShow.value.includes(row.key))
);

const priceByKey = computed(() => ({
  XAU: state.xauPrice,
  MS: state.minshengPrice,
  GH: state.icbcPrice,
  ZS: state.zheshangPrice,
}));

function displayPrice(key) {
  return priceByKey.value[key] ?? "--";
}

useHttpBankPrices(state);
useXauWebSocket(state);
const { openOrFocusSettings } = useMainWindowSelection(state, contentRef);
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 3px 6px;
  min-height: 0;
  line-height: 1.25;
}

.price-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 1px 0;
  margin: 0;
  border-bottom: 1px solid #e0e0e0;
}

.price-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.label {
  flex: 0 0 auto;
  font-size: 13px;
  line-height: 1.25;
  color: #666;
}

.value {
  flex: 1 1 auto;
  text-align: right;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.25;
  font-variant-numeric: tabular-nums;
}

.settings-btn {
  align-self: flex-start;
  margin: 2px 0 0;
  padding: 4px 10px;
  line-height: 1.2;
}

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
