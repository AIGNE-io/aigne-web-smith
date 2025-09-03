export default async function generateIds(input) {
  const { count = 1 } = input;

  // 生成16位随机ID的函数
  function generateRandomId() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // 生成指定数量的唯一ID
  const ids = new Set();
  while (ids.size < count) {
    ids.add(generateRandomId());
  }

  const generatedIds = Array.from(ids);

  return {
    ...input,
    idsList: generatedIds,
  };
}

generateIds.taskTitle = "Generate {{ count }} random IDs for {{ path }}";
