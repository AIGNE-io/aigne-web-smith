网站生成后，最后一步是让它在线可访问。本指南涵盖了使用 AIGNE WebSmith 发布网站的各种方法，确保您可以选择最适合您技术和预算要求的选项。

`aigne web publish` 命令是部署您生成的网站文件的主要工具。根据您的需求，您可以部署到免费的 WebSmith Cloud、与您自己现有的基础设施集成，或者建立一个新的专用网站。

### 发布目的地

WebSmith 提供三个不同的发布目标。有关详细的分步说明，请参阅每个选项的具体指南。

<x-cards data-columns="3">
  <x-card data-title="到 WebSmith Cloud" data-icon="lucide:cloud" data-href="/guides/publish-website/to-websmith-cloud">发布到我们免费的、托管的托管平台。非常适合开源项目、个人网站或社区共享。</x-card>
  <x-card data-title="到现有网站" data-icon="lucide:server" data-href="/guides/publish-website/to-existing-website">将生成的页面直接集成并部署到您当前自我管理的网站基础设施上。</x-card>
  <x-card data-title="到新的专用网站" data-icon="lucide:globe" data-href="/guides/publish-website/to-new-dedicated-website">创建并发布到一个拥有自定义域名和专业托管的全新、全托管网站。这是一项付费服务。</x-card>
</x-cards>

### 一般流程

无论发布到哪个目的地，发布过程都由一个命令启动。然后，该工具将引导您完成任何必要的身份验证或配置步骤。

1.  **生成您的网站**：在发布之前，请确保您已使用 `aigne web generate` 命令创建了您的网站。
2.  **运行发布命令**：在您的终端中执行以下命令：
    ```sh aigne web publish icon=lucide:upload-cloud
    aigne web publish
    ```
3.  **遵循交互式提示**：CLI 将向您展示可用的发布选项。如果您没有指定目标，系统会要求您选择一个。对于首次连接到某个服务，浏览器窗口将打开以进行身份验证。

    ![WebSmith 发布选项](../../../assets/images/web-smith-publish-resume.png)

4.  **验证部署**：命令完成后，它将输出一条确认消息和您已发布页面的实时 URL。建议访问这些链接以验证部署是否成功以及网站是否按预期显示。

    ![成功发布输出](../../../assets/images/web-smith-publish-success.png)

### 总结

发布您的网站是一个由 `aigne web publish` 命令处理的简单过程。通过提供多个部署目标，WebSmith 确保了对各种用例的灵活性。

有关每种发布方法的具体说明，请参阅详细指南：

-   [到 WebSmith Cloud](./guides-publish-website-to-websmith-cloud.md)
-   [到现有网站](./guides-publish-website-to-existing-website.md)
-   [到新的专用网站](./guides-publish-website-to-new-dedicated-website.md)