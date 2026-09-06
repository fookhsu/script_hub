# script_hub —— 油猴脚本仓库

集中存放与维护 Tampermonkey / Violentmonkey 用户脚本（油猴脚本）。

## 目录约定

**每个功能脚本一个独立子目录**，自带源码、测试与文档，互不干扰：

```
script_hub/
├── README.md                  # 本说明
└── <脚本名>/                  # 例如 bili_download/
    ├── README.md              # 功能说明 + 安装/测试方法（务必维护）
    ├── package.json           # npm test 等测试命令入口
    ├── <脚本>.user.js         # 脚本源码（部署用）
    └── test/
        ├── package.json       # 测试依赖声明
        ├── harness.js         # 通用 jsdom + GM_* mock 沙箱
        ├── <脚本>.test.js     # 测试用例
        └── node_modules/
```

当前已有脚本：

| 子目录 | 说明 |
| --- | --- |
| `bili_download/` | B站哔哩哔哩使用增强：多P/合集视频下载、批量下载(aria2)、一键三连、浏览记录提示、简介转链接、云厂商服务器导航条 |

## 新增一个功能脚本

1. 复制任意现有目录骨架：`mkdir <脚本名>/test`；
2. 把脚本放进 `<脚本名>/`；
3. 复制 `harness.js` 与 `*.test.js`，按被测页面改 URL / DOM / GM 行为（jsdom 沙箱用法见各目录 README）；
4. 补 `<脚本名>/README.md`（功能说明 + 测试命令）与 `package.json` 的 npm scripts；
5. 根 `.gitignore` 已忽略 `node_modules`，其余全部纳入版本管理。

> 测试不要求网络与浏览器：jsdom 模拟 DOM，`GM_*` 全部 mock，定时器可控，网络请求由 router 返回假响应，任何 CI / 本机 Node ≥ 18 均可复现。

## 运行全部脚本测试（示例）

```bash
cd bili_download && npm run test:all
```
