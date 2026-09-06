# B站哔哩哔哩下载增强（bili_download）

Tampermonkey / Violentmonkey 油猴脚本。适用于 B站视频/搜索/用户主页，提供多P/合集视频下载等增强功能。

## 目录结构

```
script_hub/bili_download/
├── README.md                   # 本说明
├── package.json                # 测试命令入口（npm test）
├── bili_download.js            # 脚本源码（部署即用，唯一一份）
└── test/
    ├── package.json            # 测试依赖声明（jsdom / jquery，仅测试用）
    ├── harness.js              # jsdom 沙箱：GM_* mock、假定时器、jQuery/findAndReplace 替身
    ├── bili_download.test.js   # 21 个集成测试用例
    └── node_modules/
```

> 说明：本脚本由旧版（2.1.x，依赖 jQuery + findAndReplaceDOMText、双 API 请求等）重构而来，历史基线可在 git 中检出旧版 `bili_download.js` 提交后对比（`git log -- bili_download/bili_download.js`）。

## 功能特性

| 功能 | 说明 | 生效页面 |
| --- | --- | --- |
| 多P/合集视频下载 | 左侧粉色挂件点“下载视频”→ 拉取可下载列表 | `www.bilibili.com/video/*`、`/watchlater*` |
| 普通多P | 每个分P一行，可单P或批量下载 | 同上 |
| 合集(ugc_season)范围切换 | 合集页自动出现「按集下载(合集) / 下载全部P」：① 每集含多P → 按集整集勾选，批量时自动展开该集全部分P逐个下载；② 每集单P → 按集即每集一行，顶部全选=一次下完整个合集；③ 需要单独挑分P可切“下载全部P”；④ 集数很多时可点「下载当前集」（自动带集名，点击后只勾选当前正在观看的集并滚动定位）；⑤ 下载文件名可自定义「合集名」前缀（默认=合集标题），并自动并入集名与分P标题，形如 `【合集】第3集 标题 P1 分P标题` | 合集视频页 |
| 批量下载 | 勾选后通过 **aria2 JSON-RPC(WebSocket)** 推送到 Motrix / AriaNgGUI，支持自定义 RPC 地址/Token/保存路径，设置自动记忆；列表顶部有一键「全选」与“已选 N/M”计数（含半选态） | 同上 |
| 单P下载 | 点击某一行标题直接 `window.open` 播放直链；多分P的“集”点击后自动勾选并提示走批量下载 | 同上 |
| 一键三连 | 挂件“一键三连”按钮（点赞 + 投币） | 同上 |
| 浏览记录“已看” | 看过的视频在搜索结果/用户投稿列表自动标“已看”；菜单命令可一键清空 | search / space / 投稿列表 |
| 简介网址转链接 | 视频简介中的站外 http/https 链接自动变可点击链接（站内链接不处理），带标记防死循环 | 视频详情页 |
| 功能开关 | 油猴菜单「功能开关」可整体关闭 B站增强 | B站页面 |

> 代码内还保留了“服务器厂商导航条”（tencent/aliyun/huawei 等底部导航）。当前 `@include` 仅匹配 bilibili 域名，该功能默认不激活；如需启用，请自行在元数据中补充对应厂商域名到 `@include`。

## 安装

1. 安装 Tampermonkey（Chrome/Edge）或 Violentmonkey；
2. 扩展菜单 → “新建脚本”，粘贴 `bili_download.js` 全文保存（或用扩展“从文件安装”）；
3. 打开 B站视频页，页面左侧出现粉色小挂件即成功。

### 元数据（用户脚本头）说明

脚本头只保留有实际作用的声明：

| 字段 | 作用 |
| --- | --- |
| `@name / @name:zh / @namespace / @version / @author` | 安装面板标识 |
| `@description` | 功能描述（与当前功能一致，已不含旧版已下线功能） |
| `@icon` | 扩展图标（base64 内嵌） |
| `@include` | 生效域名：www/search/space.bilibili.com（代码实际使用的页面） |
| `@connect` | 允许跨域请求：bilibili.com（view/playurl API）、staticj.top（服务器导航） |
| `@grant` | `GM_getValue / GM_setValue / GM_xmlhttpRequest / GM_registerMenuCommand` 及 `GM.*` 异步变体（代码读取兜底分支使用） |
| `@license / @charset / @run-at` | 协议 / 编码 / 注入时机 |

无用的 `@exclude` 长列表（腾讯云/阿里云/华为云/YouTube 等）与 `read/**` include 已移除——它们对当前 bilibili-only 的 include 永远不会命中。

### 存储键（GM 存储）

| 键 | 内容 |
| --- | --- |
| `setingData` | 功能开关 `{"bilibiliHelper": true}` |
| `bilibili_video_record` | 观看过的 BV 号拼接串（保留最近约 4800 字符） |
| `download_setting_key` | 批量下载配置 `{RPCURL, savePath, RPCToken, downloadWay}` |
| `server_navigation_key` | 服务器导航开关（默认不激活） |

## 自动化测试

无需浏览器，直接跑 Node。测试原理：用 **jsdom** 模拟 DOM，mock 全部 `GM_*` API、`WebSocket`、`confirm/prompt`、假定时器（setInterval/setTimeout 可控），再真实触发按钮点击、菜单命令，断言 DOM 与请求结果。

### 环境要求与运行

```bash
cd script_hub/bili_download
npm install --prefix test        # 首次安装测试依赖（jsdom / jquery）
npm test                         # 默认对 bili_download.js 运行全部用例 → 21/21
```

也可直接指定被测文件（便于对比 git 历史旧版）：

```bash
SCRIPT_PATH=./bili_download.js node test/bili_download.test.js
```

测试运行器支持 `KNOWN_FAIL_SUBSTR`（逗号分隔）：名称命中关键词的失败用例只提示、不置为非零退出码。当前仓库内单份脚本应 **21/21** 全绿；如检出历史旧版跑测试，可用它把“旧版缺失的新功能/已修复 Bug”归类为已知失败。

### 用例清单（共 21 条）

1. 通用页面加载无报错，注册“功能开关”菜单
2. 普通视频页渲染工具栏与多P弹框（mock view 返回 3P）
3. 普通视频批量下载选中 2P → 校验 playurl 请求与单连接 addUri 消息（全部送达）、保存配置
4. （新功能）多选集：弹框顶部一键“全选”勾选框
5. （新功能）多选集：顶部全选状态与“已选 N/M”计数实时联动（含半选态）
6. 浏览记录：搜索页已看视频显示“已看”角标
7. 浏览记录：视频页浏览后 BV 写入缓存
8. “功能开关”弹框开关选项并保存、toast 提示
9. 视频简介外部网址转 `<a target="_blank">`，不重复生成/不死循环
10. 单P下载点击后 `window.open` 播放直链
11. 云厂商页服务器导航容器与 API 内容注入、锚点 track 参数
12. （新功能）合集每集多P：默认“按集”渲染每一集，多P集标注分P数
13. （新功能）合集每集多P：一键“下载当前集”按钮显示集名称并只勾选当前集
14. （新功能）合集每集多P：切换“下载全部P”平铺所有分P
15. （新功能）合集每集多P：勾选整集批量下载自动展开该集全部分P（cid/文件名校验，单连接批量推送）
16. （新功能）合集每集多P：点击多分P的集行自动勾选并提示转批量下载
17. （新功能）合集每集单P：顶部全选后批量下载 = 一次下完整个合集（80 集规模复测全部送达）
18. （回归）弹框默认真正选中 Motrix 单选框
19. （回归）切换 AriaNgGUI 自动带出 ws://localhost:6800 RPC 地址
20. （回归）服务器导航设置菜单保存后正常弹提示（对应旧版 `toast.show` Bug）
21. （新功能）合集文件名 = 可自定义“合集名前缀”（默认合集标题）+ 集名 + 分P标题（含 P 编号），修改前缀后立即生效

### 新增/维护用例

- 测试文件使用 `test('描述', withScript({url, bodyHtml, seedValues, router}, fn))` 注册；
- `withScript` 每次创建全新 jsdom 沙箱并执行被测脚本；
- 网络请求由 `router(rec)` 返回假响应；定时器用 `sb.timers.runTimeouts() / runIntervals(n)` 拨动；微任务用 `await sb.flush()` 冲刷；
- 详见 `test/harness.js` 的 `makeSandbox()`。

## 常见问题

- 批量下载没反应/全集只下到一半：先打开 Motrix/AriaNgGUI（Motrix 默认 RPC `ws://localhost:16800/jsonrpc`）再操作，保存路径不能为空。
  *（新版本已修复）旧版逐个 setTimeout 推任务，任务量大时浏览器对后台标签页定时器节流，后半部分会长时间停滞看似“遗漏”；现改为单条 WebSocket 事件驱动批量推送，不受该节流影响，并会提示成功/失败数量；
- 合集里找不到当前集：按集模式下点粉色「◎ 下载当前集：第N集 …」按钮即可定位；
- 单P点了没弹下载：浏览器弹窗拦截或直链需携带 Referer/Cookie，推荐 BBDown 等工具（弹框内有提示）；
- 服务器导航条没出现：该功能需把厂商域名加入 `@include`（见上文），默认未激活。
