import { PAGES_KIT_API_BASE } from "../utils/constants.mjs";

// Agent 函数：上传 pageTemplate 到 Pages Kit
export default async function Agent({ pageTemplate, locale, projectId }) {
  // 构建请求头
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  // 构建请求体
  const raw = JSON.stringify({
    projectId,
    lang: locale,
    pageYaml: pageTemplate,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    // 发送请求到 Pages Kit 接口
    const response = await fetch(`${PAGES_KIT_API_BASE}/upload-page`, requestOptions);

    // 尝试解析为 JSON，失败则返回文本
    try {
      const data = await response.json();
      return {
        uploadPageResult: data,
        success: response.ok,
        status: response.status,
      };
    } catch {
      const text = await response.text();
      return {
        uploadPageResult: text,
        success: response.ok,
        status: response.status,
      };
    }
  } catch (error) {
    // 捕获并返回错误信息
    return {
      error: error.message,
      success: false,
      status: 0,
    };
  }
}

// 定义输出 schema
Agent.output_schema = {
  type: "object",
  properties: {
    uploadPageResult: {
      description: "Pages Kit API 响应内容",
    },
    success: {
      type: "boolean",
      description: "上传是否成功",
    },
    status: {
      type: "number",
      description: "HTTP 状态码",
    },
    error: {
      type: "string",
      description: "错误信息（仅在失败时存在）",
    },
  },
  required: ["success"],
};

// 函数描述
Agent.description = "上传页面模板到 Pages Kit 平台，支持多语言和项目管理";
