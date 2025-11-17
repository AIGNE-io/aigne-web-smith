# 发布网站

当您的页面在本地看起来效果不错时，运行 `aigne web publish` 将其推送到线上。该命令每次都使用相同的流程——选择一个目标，授权一次，然后 WebSmith 会为您上传所有页面和资产。

## 最快路径 (WebSmith Cloud)

如果您只需要一个公开的 URL，请按照以下步骤操作：

1. **运行命令**  
   ```bash 快速发布 icon=lucide:terminal
   aigne web publish
   ```  
   别名 `aigne web pub` 和 `aigne web p` 也同样有效。
2. **选择 WebSmith Cloud**  
   当提示出现时，选择 **WebSmith Cloud**（默认选项）并按 Enter 键。
3. **授权一次**  
   终端会打开一个浏览器，以便您登录并批准发布访问权限。完成这个一次性步骤后，凭据将被缓存在本地。
4. **等待部署**  
   WebSmith 会压缩您生成的文件，上传媒体，并在完成后打印出线上 URL。稍后重新运行相同的命令即可发布更新——除非您更改目标，否则不会有额外的提示。

> **提示：** 要编写部署脚本或跳过提示，请添加 `--appUrl https://your-site.com`。终端命令会记住上次发布到的 URL，因此未来的运行将是全自动的。

## 何时使用其他选项

选择与您的托管策略相匹配的目标。下面的每张卡片都链接到一个专门的指南。

<x-cards data-columns="3">
  <x-card data-title="到 WebSmith Cloud" data-icon="lucide:cloud" data-href="/guides/publish-website/cloud">
    让您的网站上线的快捷方式。使用我们免费的公共托管服务。此选项非常适合测试、开源项目或社区共享。
  </x-card>
  <x-card data-title="到现有网站" data-icon="lucide:server" data-href="/guides/publish-website/custom">
    适用于已经在 ArcBlock 平台上构建了网站的用户。本指南将解释如何将您新生成的页面集成并发布到您现有的基础设施中。
  </x-card>
  <x-card data-title="到新的专用网站" data-icon="lucide:globe" data-href="/guides/publish-website/new-dedicated-website">
    一项付费服务，可创建一个具有自定义域名和托管功能的新的专用网站。这是专业和商业用途的推荐选择。
  </x-card>
</x-cards>

如果您想从 WebSmith Cloud 迁移到另一个目标（或反之），请运行 `aigne web clear --targets deploymentConfig` 来重置缓存的部署目标，然后再次运行 `aigne web publish` 并选择新的目标。