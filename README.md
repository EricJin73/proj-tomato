# 学一会 · TinyFocus

> 不要想整个项目，只看眼前的几分钟。

一个集成 AI 的极简番茄钟，专门用来重启长期搁置的项目。输入你卡住的地方，AI 把它拆成一个现在就能开始的微任务，然后开始倒计时专注。

## 功能

- AI 拆解微任务（DeepSeek）
- 环形进度条倒计时
- 专注中可放弃（需二次确认）
- 完成后记录进度
- PWA，可安装到手机桌面

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | 纯 HTML + Tailwind CSS |
| AI 代理 | Cloudflare Workers |
| AI 模型 | DeepSeek Chat |
| 托管 | GitHub Pages |
| 域名 | tinyfocus.net（Cloudflare）|

## 部署结构

```
用户浏览器
  └─ GitHub Pages（ericjin73.github.io/proj-tomato）
       └─ api.tinyfocus.net（Cloudflare Worker）
            └─ DeepSeek API
```

## 本地开发

```bash
# 安装依赖
npm install

# 调试 Worker
cd worker
wrangler dev

# 部署 Worker
wrangler deploy

# 更新 API Key
echo "your_key" | wrangler secret put DEEPSEEK_API_KEY
```

## 文件结构

```
├── Index_v2.html        # 主页面
├── manifest.json        # PWA 配置
├── service-worker.js    # 离线缓存
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── worker/
    ├── index.js         # Cloudflare Worker（AI 代理）
    └── wrangler.toml    # Worker 配置
```

## 访问地址

- 线上：https://ericjin73.github.io/proj-tomato/Index_v2.html
- API：https://api.tinyfocus.net
