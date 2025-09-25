// fetch-file.mjs
import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { BUILTIN_COMPONENT_LIBRARY_NAME, COMPONENTS_DIR } from "../../utils/constants.mjs";

// 获取当前文件目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function pullComponents({ url }) {
  if (!url) {
    return {
      message: "Please provide a URL to pull components",
    };
  }

  const componentDir = path.join(__dirname, "../", COMPONENTS_DIR);

  try {
    // 确保目标目录存在
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    const filePath = path.join(componentDir, BUILTIN_COMPONENT_LIBRARY_NAME);

    const buffer = await res.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    return {
      message: "✅ Pull Components successfully!",
    };
  } catch (err) {
    return {
      message: `❌ Pull Components Error: ${err.message}`,
    };
  }
}

pullComponents.taskTitle = "Pull components from URL";
