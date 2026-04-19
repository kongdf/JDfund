# JDfund

基于 **Tauri 2** 的桌面小工具：在屏幕角落以**透明浮窗**展示京东积存金相关行情（国际金 XAU 与部分银行报价），窗口置顶、可拖动，适合边看盘边做别的事。

---

## 功能概览

- **多路行情**：国际金（WebSocket 实时）+ 民生 / 工行 / 浙商等（HTTP 轮询，以接口实际返回为准）
- **自选展示**：在设置中勾选要显示的条目，配置会持久保存
- **系统托盘**：托盘菜单可打开设置或退出应用
- **轻量浮窗**：无标题栏、可拖拽移动，高度随内容变化

---

## 下载

预编译安装包见 **GitHub Releases**：

**[前往下载](https://github.com/kongdf/JDfund/releases)**

目前提供 **macOS** 与 **Windows** 构建（具体以 Releases 页面资产为准）。若系统提示「未识别的开发者」，请在系统设置中按平台说明放行。

---

## 使用说明

1. 启动后主窗口为浮窗；若尚未勾选任何条目，会显示「设置」按钮。
2. 打开设置，勾选需要在浮窗中展示的行情项并保存。
3. 拖动浮窗空白区域即可移动位置；通过托盘图标可再次打开设置或退出。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 桌面壳 | Tauri 2 |
| 前端 | Vue 3、Vue Router、Vite、Element Plus |
| 数据 | 官方插件：`http`、`websocket`、`store`（本地持久化）等 |

---

## 本地开发

**环境要求**

- [Node.js](https://nodejs.org/)（建议当前 LTS）
- [Rust](https://www.rust-lang.org/)（Tauri 构建需要）

**命令**

```bash
# 安装依赖
npm install

# 开发调试（启动 Vite + Tauri）
npm run tauri dev

# 仅构建前端
npm run build
```

---

## 打包发布

```bash
npm run tauri build
```

产物位于 `src-tauri/target/release/bundle/`（具体子目录因平台而异）。  
发布前请在本机执行完整构建并自测安装包。

---

## 免责声明

- 本软件为**第三方开源工具**，与京东及相关金融机构无隶属关系。
- 展示的行情数据来源于公开可访问的接口，**仅供参考**，不构成任何投资或交易建议；实盘操作请以各平台官方页面与协议为准。
- 使用本软件所产生的任何直接或间接后果，由使用者自行承担。

---

## 链接

- 源码与问题反馈：[GitHub 仓库](https://github.com/kongdf/JDfund)
- 版本下载：[Releases](https://github.com/kongdf/JDfund/releases)
