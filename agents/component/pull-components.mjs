import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { BUILTIN_COMPONENT_LIBRARY_NAME, COMPONENTS_DIR } from "../../utils/constants.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function pullComponents({ url }) {
  if (!url) {
    return { message: "Please provide a URL to pull components" };
  }

  const componentDir = path.join(__dirname, "../../", COMPONENTS_DIR);

  try {
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    const filePath = path.join(componentDir, BUILTIN_COMPONENT_LIBRARY_NAME);

    const text = await res.text();
    fs.writeFileSync(filePath, text);

    // --- 解析 YAML ---
    const doc = parse(text);

    const atomicCount = doc.atomic?.length || 0;
    const compositeCount = doc.composite?.length || 0;

    // --- 格式化输出 ---
    let statsMessage = `✅ Pull Components successfully!
📊 Statistics:
  🔹 Atomic components: ${atomicCount}`;

    doc.atomic?.forEach((a) => {
      statsMessage += `\n    • ${a.name} - ${a.summary}`;
    });

    statsMessage += `\n  🧩 Composite components: ${compositeCount}`;
    doc.composite?.forEach((c) => {
      statsMessage += `\n    • ${c.name} - ${c.summary || "no summary"}`;
    });

    return { message: statsMessage };
  } catch (err) {
    return { message: `❌ Pull Components Error: ${err.message}` };
  }
}

pullComponents.taskTitle = "Pull components from URL";
