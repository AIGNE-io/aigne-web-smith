import { getAllFieldCombinations } from "./sdk.mjs";
import _ from "lodash";

export default async function checkGenerateComponentLibrary(input) {
  const { middleFormatFiles } = input;
  const [filePath, { componentLibrary }] = Object.entries(input)?.find(
    // 寻找存在 componentLibrary 的项，就是当前正在检测的文件
    (item) => item[1].componentLibrary
  );

  const middleFormatFile = middleFormatFiles.find(
    (item) => item.filePath === filePath
  );

  const allFieldCombinations = getAllFieldCombinations([middleFormatFile]);

  const relatedComponentIds = [];

  // 检查字段组合是否完整
  const missingFieldCombinations = [];
  // 检查原子组件是否完整
  const missingAtomicComponents = [];

  allFieldCombinations.forEach((fieldCombinations) => {
    const exist = componentLibrary.find((component) =>
      _.isEqual(fieldCombinations, component.fieldCombinations)
    );

    if (!exist) {
      // fieldCombinations
      missingFieldCombinations.push(fieldCombinations);
    }
  });

  componentLibrary.forEach((item) => {
    if (item.type === "composite") {
      const relatedComponents = item.relatedComponents;
      relatedComponentIds.push(
        ...relatedComponents.map((item) => item.componentId)
      );
    }
  });

  const uniqueAtomicComponentIds = _.uniq(relatedComponentIds);

  uniqueAtomicComponentIds.forEach((item) => {
    const exist = componentLibrary.find(
      (component) =>
        component.componentId === item && component.type === "atomic"
    );
    if (!exist) {
      // id
      missingAtomicComponents.push(item);
    }
  });

  let isApproved =
    missingFieldCombinations.length === 0 &&
    missingAtomicComponents.length === 0;

  const detailFeedback = [];

  if (!isApproved) {
    if (missingFieldCombinations.length > 0) {
      detailFeedback.push(
        `Missing field combinations: ${JSON.stringify(
          missingFieldCombinations
        )}`
      );
    }
    if (missingAtomicComponents.length > 0) {
      detailFeedback.push(
        `Missing atomic components: ${JSON.stringify(missingAtomicComponents)}`
      );
    }
  }

  console.warn(detailFeedback);

  return {
    isApproved,
    detailFeedback: detailFeedback.join("\n"),
  };
}
