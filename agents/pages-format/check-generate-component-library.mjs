import _ from "lodash";
import { getAllFieldCombinations } from "./sdk.mjs";

export default async function checkGenerateComponentLibrary(input) {
  const { middleFormatFiles } = input;
  const [filePath, { componentLibrary }] = Object.entries(input || {}).find(
    // 寻找存在 componentLibrary 的项，就是当前正在检测的文件
    (item) => item[1].componentLibrary,
  );

  const middleFormatFile = middleFormatFiles.find((item) => item.filePath === filePath);

  const allFieldCombinations = getAllFieldCombinations([middleFormatFile]);

  const relatedComponentIds = [];

  // 检查字段组合是否完整
  const missingFieldCombinations = [];
  // 检查原子组件是否完整
  const missingAtomicComponents = [];
  // 检查复合组件的 relatedComponents 是否覆盖所有字段组合
  const missingRelatedFieldCombinations = [];

  allFieldCombinations.forEach((fieldCombinations) => {
    const exist = componentLibrary.find((component) =>
      _.isEqual(fieldCombinations, component.fieldCombinations),
    );

    if (!exist) {
      // fieldCombinations
      missingFieldCombinations.push(fieldCombinations);
    }
  });

  componentLibrary.forEach((item) => {
    if (item.type === "composite") {
      const relatedComponents = item.relatedComponents;
      relatedComponentIds.push(...relatedComponents.map((item) => item.componentId));

      // 检查复合组件的每个字段组合是否都有对应的 relatedComponents 处理
      const allRelatedFieldCombinations = new Set();
      relatedComponents.forEach((relatedComponent) => {
        relatedComponent.fieldCombinations?.forEach((field) => {
          allRelatedFieldCombinations.add(field);
        });
      });

      const missingFields = item.fieldCombinations.filter(
        (field) => !allRelatedFieldCombinations.has(field),
      );

      if (missingFields.length > 0) {
        missingRelatedFieldCombinations.push({
          componentName: item.name,
          componentId: item.componentId,
          missingFields,
        });
      }
    }
  });

  const uniqueAtomicComponentIds = _.uniq(relatedComponentIds);

  uniqueAtomicComponentIds.forEach((item) => {
    const exist = componentLibrary.find(
      (component) => component.componentId === item && component.type === "atomic",
    );
    if (!exist) {
      // id
      missingAtomicComponents.push(item);
    }
  });

  const isApproved =
    missingFieldCombinations.length === 0 &&
    missingAtomicComponents.length === 0 &&
    missingRelatedFieldCombinations.length === 0;

  const detailFeedback = [];

  if (!isApproved) {
    if (missingFieldCombinations.length > 0) {
      detailFeedback.push(
        `Missing field combinations, please add component mapping: ${JSON.stringify(
          missingFieldCombinations,
        )}`,
      );
    }
    if (missingAtomicComponents.length > 0) {
      detailFeedback.push(
        `Missing atomic components, please add atomic component mapping: ${JSON.stringify(
          missingAtomicComponents,
        )}`,
      );
    }
    if (missingRelatedFieldCombinations.length > 0) {
      detailFeedback.push(
        `Missing relatedComponents for field combinations, please add component mapping: ${JSON.stringify(
          missingRelatedFieldCombinations,
        )}`,
      );
    }
  }

  return {
    isApproved,
    detailFeedback: detailFeedback.join("\n"),
    latestComponentLibrary: {
      componentLibrary,
    },
  };
}
