# 新媒体作品集独立部署

更新日期：2026-11-25。正式网站为 [media.yanpingsun.cn](https://media.yanpingsun.cn/)，独立项目和 DNS 已生效，免费托管 HTTPS 证书已部署。强制 HTTPS 已启用，301 跳转已保存并重新打开核对。

## 源码与网站分工

- 内容协作源仓库：`yanpingsun/yanping-portfolio-site`，`main`。
- 新媒体作品集入口：`new-media-portfolio/index.html`，当前为 V2.2、14 个纵向页面，胶原炮三页位于第10—12页，第13页保留洁颜霜等四张项目封面。最新内容提交 `9c82e2dc19355a210b3412402f1889d625d56fc9`。
- 现有产品内容作品集：`https://yanpingsun.cn/`，源码 `preview/v3/`，仍为 3.0.19，继续使用原 EdgeOne 项目 `yanping-portfolio-overseas`。
- 新媒体网站已另建独立 EdgeOne 项目，生产分支为 `main`，**项目根目录为 `new-media-portfolio`**。

| 实际托管配置 | 值 |
| --- | --- |
| 项目 | `yanping-media-portfolio`，ID `makers-ovl8xngj1can` |
| 控制台 | [项目概览](https://console.cloud.tencent.com/edgeone/makers/project/makers-ovl8xngj1can/index) |
| 部署仓库 | `huhaheng/yanping-portfolio-site` |
| 生产分支与根目录 | `main` / `new-media-portfolio` |
| 首次部署 | `dpezul1lxtic`，提交 `89a035bdd0643a56c3858cf6d778767d22a93a47`，成功 |
| 默认项目域名 | `https://yanping-media-portfolio-eqpdkcag.edgeone.dev/` |
| 已验证的内容更新 | `388583735bc4d2f0b451918d0aa336691271ea76`，V2.2，副本更新后自动发布 |
| 套餐与区域 | 免费，全球可用区（不含中国大陆） |

## 构建与路径

在完整仓库中运行：

```sh
node tools/build_new_media_edgeone.mjs
python3 -m http.server 8766 --directory new-media-portfolio/dist-edgeone
```

构建入口与输出独立于产品版的 `tools/build_edgeone.mjs` 和仓库根 `edgeone.json`。新项目读取 `new-media-portfolio/edgeone.json`：

| 设置 | 值 |
| --- | --- |
| 框架 | Other / 自定义 |
| 项目根目录 | `new-media-portfolio` |
| 安装命令 | `node --version` |
| 构建命令（相对项目根目录执行） | `node ../tools/build_new_media_edgeone.mjs` |
| 输出目录（相对项目根目录） | `dist-edgeone` |
| Node 版本 | `22.11.0` |
| 加速区域 | 全球可用区（不含中国大陆） |

当前输出共 18 个文件，包含首页、16 个图片原件和 `deployment-info.json`。生成目录已加入 Git 忽略，不提交产物，不在云端安装第三方依赖。

构建仅适配输出 HTML 的链接地址：

1. 将作者原来指向 GitHub Pages 的图片、原图复制到新站同源路径，避免正常浏览依赖 GitHub 图片服务。
2. 四个产品深度案例链接指向现有产品网站的对应案例，保留原有查询参数及页面锚点。
3. 站内 `#s1`—`#s14` 导航、文案、CSS、JavaScript、小红书原笔记链接和内嵌二维码图像保持原样。打印二维码仍指向作者原来的 GitHub 原图地址，本次不重绘二维码。
4. 原始 `new-media-portfolio/index.html` 保持不变，GitHub Pages 预览继续沿用作者版本。

`deployment-info.json` 记录源 HTML 与部署 HTML 的 SHA-256、页序、资源和路径替换，便于核对实际发布版本。若作者以后在本目录新增图片或静态资源，构建会按相对目录复制；共享素材仍应保留原文件路径。

## 云端绑定

新域名已绑定独立项目的生产环境。DNSPod 已保存以下记录，Google 与阿里 DNS 均解析到相同 CNAME 和公开服务 IP：

| 主机记录 | 类型 | 线路 | 记录值 | TTL |
| --- | --- | --- | --- | --- |
| `media` | CNAME | 默认 | `media.yanpingsun.cn.pages.dnsoe5.com` | 600 秒 |

父域名归属验证已通过，此次无需新增 TXT。原 `@` CNAME `yanpingsun.cn.pages.dnsoe6.com`、归属验证 TXT 和 NS 记录均保留。新站使用免费托管单域名证书和自动验证。证书入口为“域名管理 → media 域名 HTTPS 配置列 → 边缘 HTTPS 证书”；不要重复申请或改动原产品站证书。强制 HTTPS 的 301 跳转已保存并重新打开确认；独立浏览器访问 HTTPS 无证书警告，HTTP 入口跳转到同一 HTTPS 作品集。证书到期日和续期详情未在当前配置抽屉显示，未凭估计填写。

不修改现有 `@` 根 CNAME、原产品网站绑定、证书、项目根目录或构建命令。新网站域名配置不需要重新购买 `yanpingsun.cn`。

## 后续发布

作品内容继续只在原仓库 `new-media-portfolio/` 维护，通过任务分支和 PR 合入 `main`。共享原图需要保留作者所引用的仓库路径。每次发布先运行独立构建，并检查14页、封面、内部导航、原图和手机尺寸。

实际 Git 接入使用 `huhaheng/yanping-portfolio-site` 部署副本。副本 `main` 更新后由 EdgeOne 自动构建发布；原协作仓库合入后仍需先快进同步副本。已通过将 `3885837` 同步到副本后观察正式域名由13页更新为14页，验证平台自动构建发布。尚未添加原仓库到副本的自动同步，不能将当前方式称为全链路自动更新。

```sh
set -e
git fetch origin main:refs/remotes/origin/main
git fetch deploy main:refs/remotes/deploy/main
git merge-base --is-ancestor deploy/main origin/main
git push deploy refs/remotes/origin/main:refs/heads/main
```

运行前核对 `origin` 指向原协作仓库，`deploy` 指向本人部署副本。不强制覆盖副本的独立提交。两个 EdgeOne 项目可以监听同一副本的 `main`，分别读取各自根目录配置；产品运行文件没有变化时，重新构建不会把新媒体内容替换到产品网站。

## 验收与回退

2026-11-25 在本地及正式域名分别以 320、390、1280px 检查最新 V2.2 的14页，共各42组；所有页面可见且无横向溢出，16张图片及原图均加载成功、返回图片 MIME 并逐字节匹配原件。第10—12页胶原炮三页、第13页洁颜霜第四张封面、全部内部锚点及顶部章节导航通过。源 HTML 与产物的文案、CSS、JavaScript、结构和内嵌二维码保持一致。

正式域名首页和 `deployment-info.json` 均与构建产物一致，源 HTML SHA-256 为 `31cf00e25112b801c664ce1bd866897d281ef1c6a33eac238223569da12dc778`，部署首页 SHA-256 为 `714605cf9e8a69554f2ae1e76d81877203711d1dcc4a1d6976e2c7d9e1c7b970`。

四个产品深度案例在手机尺寸下实际打开正常；`yanpingsun.cn` 的六个运行文件仍与保留的 3.0.19 源码逐字节一致。原站首页 SHA-256 仍为 `b263717c554d8424f0b9828ecf9dc2d24d3e260823fddecb8b1757d45541ea6f`。新域名首次生效期间出现过短暂解析和403响应，后续正式域名的完整验收已通过；未为此修改网页内容或设计。

浏览器尺寸模拟不能代替国内手机流量、宽带和真机 Safari；外部小红书笔记可能受平台登录或访问策略影响，不将链接地址正确等同于所有网络均可直接阅读。

需要回退时，只回滚新媒体代码或新项目部署；不切换原产品网站域名或发布源。
