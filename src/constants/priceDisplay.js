/**
 * 主窗口行顺序与设置页选项（与后端 key 一致）
 * @typedef {{ key: string, settingLabel: string, rowLabel: string }} PriceDisplayRow
 */

/** @type {PriceDisplayRow[]} */
export const PRICE_DISPLAY_ROWS = [
  { key: "XAU", settingLabel: "XAU", rowLabel: "X:" },
  { key: "MS", settingLabel: "民生", rowLabel: "民:" },
  { key: "GH", settingLabel: "工行", rowLabel: "工:" },
  { key: "ZS", settingLabel: "浙商", rowLabel: "浙:" },
];
