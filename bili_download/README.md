# B站哔哩哔哩使用增强（bili_download）

Tampermonkey / Violentmonkey 油猴脚本。适用于 B站 www/search/space 及部分云厂商官网页面。

## 目录结构

```
bili_download/
├── README.md                   # 本说明
├── package.json                # 测试命令入口（npm test / test:optimized / test:all）
├── bili_download.js            # 原始版本（基线备份，勿改动）
├── bili_download.optimized.js  # 优化重构版（推荐部署）
└── test/
    ├── package.json            # 测试依赖声明（jsdom / jquery）
    ├── harness.js              # jsdom 沙箱：GM_* mock、假定时器、jQuery/findAndReplace 替身
    ├── bili_download.test.js   # 20 个集成测试用例（功能 + 回归修复 + 新功能）
    └── node_modules/
```

## 功能特性

| 功能 | 说明 | 生效页面 |
| --- | --- | --- |
| 视频下载（多P/合集） | 页面左侧粉色挂件点“下载视频”→ 拉取分P列表弹框；支持多P、合集(ugc_season)、稍后再看页 | `www.bilibili.com/video/*`、`/watchlater*` |
| 单P下载 | 点击弹框内某一行标题直接 `window.open` 播放直链；多分P的“集”点击后自动勾选并提示走批量下载 | 同上 |
| 批量下载 | 勾选后通过 **aria2 JSON-RPC(WebSocket)** 推送到 Motrix / AriaNgGUI，支持自定义 RPC 地址/Token/保存路径，设置自动记忆；列表顶部有一键「全选」与“已选 N/M”计数 | 同上 |
| 一键三连 | 挂件“一键三连”按钮，依次触发点赞、投币 | 同上 |
| 浏览记录“已看”角标 | 看过的视频在搜索结果/用户投稿列表自动标出“已看”；菜单命令可一键清空记录 | search / space / 投稿列表页 |
| 简介网址转链接 | 把视频简介中的站外 http/https 链接转为可点击链接（站内 bilibili 链接不做处理） | 视频详情页 |
| 合集下载范围 | 合集(ugc_season)页自动出现「按集下载(合集) / 下载全部P」切换：① 每集含多P → 按集整集勾选，批量时自动展开该集全部分P逐个下载；② 每集单P → 按集即每个视频一行，全选=一次下完整个合集；③ 要单独挑分P可切“下载全部P”；④ 集数很多时可点「下载当前集」(显示集名) 一键定位勾选正在观看的这集 | 合集视频页 |
| 服务器厂商导航条 | 页面底部隐藏式导航条（内容由 `server.staticj.top` 拉取），并为命中关键词的站内链接注入来源参数 | tencent / aliyun / huaweicloud / bandwagonhost / hostwinds 域名 |

> 签到功能在原版中已下线（2024-07），本仓库保持一致。

## 原版 vs 优化版

| 项目 | bili_download.js（原版） | bili_download.optimized.js（优化版） |
| --- | --- | --- |
| 代码规模 | 1662 行 / 59.6 KB | 991 行 / 40.6 KB（约 -32%） |
| CDN 依赖（@require） | jQuery 3.2.1 + findAndReplaceDOMText | **无**，全部原生 DOM |
| 分P信息请求 | view 接口请求 **2 次**（bvid→aid 再查一次） | **1 次** |
| GM 封装 | CommonFunction / ServerNavigation 各实现一份 | 统一一份 |
| 已修复缺陷 | — | 服务器导航菜单 `toast.show` 未定义报错（原版真实 Bug）；dialog 重复关闭/字符串参数异常；toast 清理；aria2 单选框 `checked`、RPC 预填、连接失败/断开处理；简介转链接防无限循环 |
| 新增能力 | — | 多选集顶部“全选+计数(半选态)”；“合集按集/全部P”下载范围（每集多P自动展开，每集单P可整合集批量） | 服务器导航菜单 `toast.show` 未定义报错（原版真实 Bug）；dialog 重复关闭/字符串参数异常；toast 动画不触发时元素不清理；aria2 单选框用 `checked` 属性选中、RPC 预填；aria2 连接失败/断开时 Promise 正确 reject；简介转链接加标记防 MutationObserver 无限循环 |
| 自动更新地址 | 指向原作者 greasyfork（downloadURL/updateURL） | 已移除（自托管/分叉时避免被错误覆盖） |

部署时直接使用 `bili_download.optimized.js`。

## 安装

1. 安装 Tampermonkey（Chrome/Edge）或 Violentmonkey；
2. 扩展菜单 → “新建脚本”，删除默认内容后粘贴 `bili_download.optimized.js` 全文，保存；
   （或使用扩展的“从文件安装”导入）
3. 打开任意 B站视频页，页面左侧出现粉色小挂件即成功。

### 浏览器端申请权限（脚本头部已声明）

- `@include`：bilibili.com / search.bilibili.com / space.bilibili.com 等；
- `@connect`：bilibili.com（API）、staticj.top（服务器导航内容）；
- `@grant`：`GM_getValue / GM_setValue / GM_xmlhttpRequest / GM_registerMenuCommand`（及对应 `GM.*` 异步写法）。

### 存储键（GM 存储，可在扩展管理面板查看）

| 键 | 内容 |
| --- | --- |
| `setingData` | 功能开关，如 `{"bilibiliHelper":true}` |
| `bilibili_video_record` | 观看过的 BV 号拼接串（保留最近约 4800 字符） |
| `download_setting_key` | 批量下载配置 `{RPCURL, savePath, RPCToken, downloadWay}` |
| `server_navigation_key` | 服务器导航开关 `true/false` |

## 自动化测试

无需浏览器，直接跑 Node。测试原理：用 **jsdom** 模拟 DOM，mock 全部 `GM_*` API、`WebSocket`、`confirm/prompt`、假定时器（setInterval/setTimeout 可控），再真实触发按钮点击、菜单命令等，断言 DOM 与请求结果。

### 环境要求

- Node.js ≥ 18（开发环境为 Node 25）；
- 首次执行 `npm install` 安装 jsdom（jquery 仅用于跑原版基线用例）。

### 运行

```bash
cd bili_download

npm install --prefix test        # 首次安装测试依赖

npm test                         # ① 默认：对 优化版（部署版）跑测试，20/20 全绿
npm run test:original            # ② 对 原版 bili_download.js 跑基线（11 通过 + 9 已知失败提示，退出码仍为 0）
npm run test:all                 # ③ 依次执行上面两个
```

也可以直接指定目标脚本文件：

```bash
# 优化版（无 jQuery 环境验证，证明已无依赖）
NO_JQUERY=1 SCRIPT_PATH=./bili_download.optimized.js node test/bili_download.test.js
# 原版基线
KNOWN_FAIL_SUBSTR=服务器导航设置,多选集,每集多P,每集单P,下载当前集 SCRIPT_PATH=./bili_download.js node test/bili_download.test.js
```

`KNOWN_FAIL_SUBSTR`（逗号分隔可多个）：把名称命中关键词的失败用例标记为“已知失败（预期）”而不影响退出码。原版基线中这类用例包括：**已修复的原版 Bug（服务器导航菜单 `toast.show` 未定义）**、**优化版新增的“多选集全选”与“合集按集/全部P下载”功能（原版没有）**。正常跑原版时应显示：

```
结果: 11/20 通过（另 9 个为已知预期失败）
```

### 预期结果

| 目标脚本 | 结果 | 说明 |
| --- | --- | --- |
| `bili_download.optimized.js`（默认/部署版） | **20/20** 通过 | 无 jQuery 环境下同样全绿 |
| `bili_download.js`（原版基线） | 11/20 通过 + 9 已知失败 | 1 项原版真实 Bug + 新功能（多选集全选、合集按集/全部P、下载当前集）原版未实现 |

### 用例清单（test/bili_download.test.js，共 20 条）

1. 通用页面加载无报错，注册“功能开关”菜单
2. 普通视频页渲染工具栏与多P弹框（mock view 返回 3P）
3. 普通视频批量下载选中 2P → 校验 playurl 请求与 aria2 WebSocket 连接、保存配置
4. （新功能）多选集：弹框顶部一键“全选”勾选框
5. （新功能）多选集：顶部全选状态与“已选 N/M”计数实时联动（含半选态）
6. 浏览记录：搜索页已看视频显示“已看”角标
7. 浏览记录：视频页浏览后 BV 写入缓存
8. “功能开关”弹框开关选项并保存、toast 提示
9. 视频简介外部网址转 `<a target="_blank">`，不重复生成/不死循环
10. 单P下载点击后 `window.open` 播放直链
11. 云厂商页服务器导航容器与 API 内容注入、锚点 track 参数
12. （新功能）合集每集多P：默认“按集”渲染每一集，多P集标注分P数
13. （新功能）合集每集多P：切换“下载全部P”平铺所有分P
14. （新功能）合集每集多P：勾选整集批量下载自动展开该集全部分P（cid 校验）
14b. （新功能）合集每集多P：一键“下载当前集”按钮显示集名称并只勾选当前集（其余取消、行高亮）
15. （新功能）合集每集多P：点击多分P的集行自动勾选并提示转批量下载
16. （新功能）合集每集单P：顶部全选后批量下载 = 一次下完整个合集
17. （回归）弹框默认真正选中 Motrix 单选框
18. （回归）切换 AriaNgGUI 自动带出 ws://localhost:6800 RPC 地址
19. （回归，对应原版 Bug）服务器导航设置菜单保存后正常弹提示

### 新增/维护用例

- 测试文件使用顶部 `test('描述', withScript({url, bodyHtml, seedValues, router}, fn))` 形式注册；
- `withScript` 每次创建全新 jsdom 沙箱并执行被测脚本；
- 网络请求由 `router(rec)` 返回假响应；定时器用 `sb.timers.runTimeouts() / runIntervals(n)` 手动拨动；微任务用 `await sb.flush()` 冲刷；
- 详见 `test/harness.js` 中的 `makeSandbox()`。

## 常见问题

- 批量下载没反应：请先打开 Motrix/AriaNgGUI 并保持 RPC 默认地址（Motrix 为 `ws://localhost:16800/jsonrpc`），再点“批量下载”；保存路径不能为空；
- 单P点了没弹下载：浏览器弹窗拦截或直链需要携带 Referer/Cookie，推荐用 BBDown 等工具下载单P（弹框内有提示）；
- 想恢复原版：直接部署 `bili_download.js` 即可。
