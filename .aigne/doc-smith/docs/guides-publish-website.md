Once your website is generated, the final step is to make it accessible online. This guide covers the various methods to publish your site using AIGNE WebSmith, ensuring you can choose the option that best fits your technical and budget requirements.

The `aigne web publish` command is the primary tool for deploying your generated website files. Depending on your needs, you can deploy to the free WebSmith Cloud, integrate with your own existing infrastructure, or set up a new dedicated website.

### Publishing Destinations

WebSmith provides three distinct publishing targets. For detailed step-by-step instructions, please refer to the specific guides for each option.

<x-cards data-columns="3">
  <x-card data-title="To WebSmith Cloud" data-icon="lucide:cloud" data-href="/guides/publish-website/to-websmith-cloud">Publish to our free, managed hosting platform. Ideal for open-source projects, personal sites, or community sharing.</x-card>
  <x-card data-title="To Existing Website" data-icon="lucide:server" data-href="/guides/publish-website/to-existing-website">Integrate and deploy the generated pages directly onto your current, self-managed website infrastructure.</x-card>
  <x-card data-title="To New Dedicated Website" data-icon="lucide:globe" data-href="/guides/publish-website/to-new-dedicated-website">Create and publish to a new, fully-managed website with a custom domain and professional hosting. This is a paid service.</x-card>
</x-cards>

### General Process

Regardless of the destination, the publishing process is initiated with a single command. The tool will then guide you through any necessary authentication or configuration steps.

1.  **Generate Your Website**: Before publishing, ensure your website has been created using the `aigne web generate` command.
2.  **Run the Publish Command**: Execute the following command in your terminal:
    ```sh aigne web publish icon=lucide:upload-cloud
    aigne web publish
    ```
3.  **Follow Interactive Prompts**: The CLI will present you with the available publishing options. If you haven't specified a target, you will be asked to select one. For first-time connections to a service, a browser window will open for authentication.

    ![WebSmith Publish Options](../../../assets/images/web-smith-publish-resume.png)

4.  **Validate Deployment**: After the command completes, it will output a confirmation message and the live URLs for your published pages. It is recommended to visit these links to verify that the deployment was successful and the website appears as expected.

    ![Successful Publish Output](../../../assets/images/web-smith-publish-success.png)

### Summary

Publishing your website is a straightforward process handled by the `aigne web publish` command. By offering multiple deployment targets, WebSmith ensures flexibility for various use cases.

For specific instructions on each publishing method, refer to the detailed guides:

-   [To WebSmith Cloud](./guides-publish-website-to-websmith-cloud.md)
-   [To Existing Website](./guides-publish-website-to-existing-website.md)
-   [To New Dedicated Website](./guides-publish-website-to-new-dedicated-website.md)