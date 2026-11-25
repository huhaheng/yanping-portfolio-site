# 新媒体作品集独立部署

更新日期：2026-11-25。目标域名为 `https://media.yanpingsun.cn/`；云端项目、DNS 和 HTTPS 尚待腾讯云登录后配置，不能将本地构建或 GitHub 推送视为已上线。

## 源码与网站分工

- 内容协作源仓库：`yanpingsun/yanping-portfolio-site`，`main`。
- 新媒体作品集入口：`new-media-portfolio/index.html`，当前为 V2.2、14 个纵向页面，胶原炮三页位于第10—12页，第13页保留洁颜霜等四张项目封面。最新内容提交 `9c82e2dc19355a210b3412402f1889d625d56fc9`。
- 现有产品内容作品集：`https://yanpingsun.cn/`，源码 `preview/v3/`，仍为 3.0.19，继续使用原 EdgeOne 项目 `yanping-portfolio-overseas`。
- 新媒体网站另建独立 EdgeOne 项目，生产分支为 `main`，**项目根目录必须设置为 `new-media-portfolio`**。

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

沿用本人腾讯云账号，以独立项目绑定 `media.yanpingsun.cn` 的生产环境。先确认生产部署成功，再按平台实际生成的值添加 DNSPod 的 `media` CNAME；如需归属验证，只添加对应 TXT。申请免费的托管 HTTPS 证书，确认已部署并启用强制 HTTPS。

不修改现有 `@` 根 CNAME、原产品网站绑定、证书、项目根目录或构建命令。新网站域名配置不需要重新购买 `yanpingsun.cn`。

## 后续发布

作品内容继续只在原仓库 `new-media-portfolio/` 维护，通过任务分支和 PR 合入 `main`。共享原图需要保留作者所引用的仓库路径。每次发布先运行独立构建，并检查14页、封面、内部导航、原图和手机尺寸。

是否能直接连接原仓库自动部署，待云端仓库授权列表核对。若仍使用 `huhaheng/yanping-portfolio-site` 部署副本，原仓库合入后还需先快进同步副本；副本更新才会触发 EdgeOne 自动构建，不能把这一步称作原仓库到网站全链路自动更新。

```sh
set -e
git fetch origin main:refs/remotes/origin/main
git fetch deploy main:refs/remotes/deploy/main
git merge-base --is-ancestor deploy/main origin/main
git push deploy refs/remotes/origin/main:refs/heads/main
```

运行前核对 `origin` 指向原协作仓库，`deploy` 指向本人部署副本。不强制覆盖副本的独立提交。两个 EdgeOne 项目可以监听同一副本的 `main`，分别读取各自根目录配置；产品运行文件没有变化时，重新构建不会把新媒体内容替换到产品网站。

## 验收与回退

独立浏览器检查桌面与手机尺寸下全部14页，确认第10—12页胶原炮案例、第13页四张项目封面、图片延迟加载、原图、顶部章节导航及四个产品深度链接。源 HTML 与产物的文案、CSS、JavaScript、结构和内嵌二维码逐项保持一致；图片复制件按原文件校验。

云端上线后记录实际项目 ID、仓库、分支、根目录、域名 DNS 和证书状态，再核对公开首页与 `deployment-info.json`。同时比较 `yanpingsun.cn` 的首页和运行文件，确认仍为原产品版。

浏览器尺寸模拟不能代替国内手机流量、宽带和真机 Safari；外部小红书笔记可能受平台登录或访问策略影响，不将链接地址正确等同于所有网络均可直接阅读。

需要回退时，只回滚新媒体代码或新项目部署；不切换原产品网站域名或发布源。
