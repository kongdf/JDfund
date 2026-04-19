import { nextTick, onMounted, onUnmounted } from "vue";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { loadSelectShow, saveSelectShow } from "@/store/appSettings";

const SETTING_LABEL = "setting";
/** 逻辑像素宽度，略大于内容避免 Windows 下数字被裁切 */
const MAIN_WIDTH = 108;

/**
 * 主窗口：恢复勾选、随内容改高度、监听设置页同步、打开设置窗口。
 * @param {{ selectShow: string[] }} state
 * @param {import('vue').Ref<HTMLElement | null>} contentRef
 */
export function useMainWindowSelection(state, contentRef) {
  let unlisten = null;

  async function resizeToContent() {
    await nextTick();
    /** 等一帧布局稳定，减少 Windows / WebView 与 macOS 高度计算差异 */
    await new Promise((r) => requestAnimationFrame(() => r()));
    const el = contentRef.value;
    if (!el) return;
    const h = Math.ceil(el.scrollHeight);
    try {
      await getCurrentWindow().setSize(new LogicalSize(MAIN_WIDTH, Math.max(h, 1)));
    } catch {
      /* ignore */
    }
  }

  async function openOrFocusSettings() {
    const existing = await WebviewWindow.getByLabel(SETTING_LABEL);
    if (existing) {
      await existing.show().catch(() => {});
      await existing.setFocus().catch(() => {});
      return;
    }
    new WebviewWindow(SETTING_LABEL, {
      url: "/setting",
      width: 500,
      height: 100,
      title: "设置",
      x: 100,
      y: 100,
    });
  }

  onMounted(async () => {
    unlisten = await WebviewWindow.getCurrent().listen("changeList", async (event) => {
      state.selectShow = event.payload.list;
      await saveSelectShow(event.payload.list);
      setTimeout(resizeToContent, 10);
    });

    const saved = await loadSelectShow();
    if (saved != null) state.selectShow = saved;
    await resizeToContent();
  });

  onUnmounted(() => {
    if (unlisten) {
      unlisten();
      unlisten = null;
    }
  });

  return { resizeToContent, openOrFocusSettings };
}
