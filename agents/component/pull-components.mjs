// fetch-file.mjs
import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { BUILTIN_COMPONENT_LIBRARY_NAME, COMPONENTS_DIR } from "../../utils/constants.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function pullComponents({ url }, options = {}) {
  if (!url) {
    return { message: "Please provide a URL to pull components" };
  }

  const componentDir = path.join(__dirname, "../../", COMPONENTS_DIR);
  const filePath = path.join(componentDir, BUILTIN_COMPONENT_LIBRARY_NAME);

  try {
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
    }

    // --- 读取旧文件 ---
    let oldAtomicCount = 0;
    let oldCompositeCount = 0;
    if (fs.existsSync(filePath)) {
      try {
        const oldText = fs.readFileSync(filePath, "utf8");
        const oldDoc = parse(oldText);
        oldAtomicCount = oldDoc.atomic?.length || 0;
        oldCompositeCount = oldDoc.composite?.length || 0;
      } catch {
        // ignore parse error
      }
    }

    // --- 拉取新文件（但不立即保存）---
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    const text = await res.text();
    const doc = parse(text);

    const atomicCount = doc.atomic?.length || 0;
    const compositeCount = doc.composite?.length || 0;

    // --- 格式化输出 ---
    let statsMessage = `✅ Pull Components successfully (not saved yet)!
📊 New Components Statistics:
  🔹 Atomic components: ${atomicCount} (${oldAtomicCount} → ${atomicCount})`;
    doc.atomic?.forEach((a) => {
      statsMessage += `\n    • ${a.name} - ${a.summary}`;
    });

    statsMessage += `\n  🧩 Composite components: ${compositeCount} (${oldCompositeCount} → ${compositeCount})`;
    doc.composite?.forEach((c) => {
      statsMessage += `\n    • ${c.name} - ${c.summary || "no summary"}`;
    });

    console.log(statsMessage);

    let resultMessage = "";

    // --- 是否需要保存 ---
    if (options.prompts) {
      const answer = await options.prompts.confirm({
        message: "Do you want to update (save) the built-in components file?",
        initial: false,
      });

      if (answer) {
        // 确认后才保存
        fs.writeFileSync(filePath, text);
        resultMessage += `\n💾 New components saved.`;
      } else {
        resultMessage += `\n⏩ No modification applied.`;
      }
    }

    return { message: resultMessage };
  } catch (err) {
    return { message: `❌ Pull Components Error: ${err.message}` };
  }
}

pullComponents.taskTitle = "Pull components from URL";
