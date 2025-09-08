import _ from "lodash";
import { parse } from "yaml";
import { extractFieldCombinations } from "./sdk.mjs";

/**
 * 测试智能字段映射功能
 * @param {Object} input
 * @param {Array} input.middleFormatFiles - 中间格式文件数组
 * @param {Array} input.componentLibrary - 组件库数组
 * @returns {Promise<Object>}
 */
export default async function testSmartFieldMapping(input) {
  const { middleFormatFiles, componentLibrary } = input;

  console.log("🔍 开始测试智能字段映射...");
  console.log(`📁 中间格式文件数量: ${middleFormatFiles?.length || 0}`);
  console.log(`🧩 组件库数量: ${componentLibrary?.length || 0}`);

  /**
   * 组件选择规则
   */
  function selectComponent(section, componentLibrary) {
    // 使用 SDK 中的字段提取方法
    const sectionAnalysis = extractFieldCombinations({ sections: [section] });
    const contentFields = sectionAnalysis[0]?.fieldCombinations || [];
    const arrayFields = sectionAnalysis[0]?.arrayFields || [];

    console.log(`  📋 Section "${section.name}" 内容字段:`, contentFields);
    if (arrayFields.length > 0) {
      console.log(`  📋 数组字段:`, arrayFields.map(f => `${f.fieldName}(${f.itemCount} items)`));
    }

    // 按匹配度排序组件
    const componentScores = componentLibrary.map((component) => {
      const fieldCombinations = component.fieldCombinations || [];

      // 计算匹配度
      const matchedFields = fieldCombinations.filter((field) =>
        contentFields.includes(field)
      );
      const matchRatio =
        fieldCombinations.length > 0
          ? matchedFields.length / fieldCombinations.length
          : 0;
      const coverageRatio =
        contentFields.length > 0
          ? matchedFields.length / contentFields.length
          : 0;

      // 综合评分：匹配度 + 覆盖度，composite 组件优先
      const typeBonus = component.type === "composite" ? 0.1 : 0;
      const score = matchRatio * 0.6 + coverageRatio * 0.4 + typeBonus;

      return {
        component,
        score,
        matchedFields,
        matchRatio,
        coverageRatio,
      };
    });

    // 选择最佳匹配的组件
    const bestMatch = componentScores
      .filter((item) => item.score > 0) // 至少要有一些匹配
      .sort((a, b) => b.score - a.score)[0];

    if (bestMatch) {
      console.log(
        `  ✅ 最佳匹配组件: ${bestMatch.component.name} (${bestMatch.component.type})`
      );
      console.log(
        `     📊 评分: ${bestMatch.score.toFixed(3)}, 匹配字段:`,
        bestMatch.matchedFields
      );
      console.log(
        `     🎯 匹配度: ${(bestMatch.matchRatio * 100).toFixed(
          1
        )}%, 覆盖度: ${(bestMatch.coverageRatio * 100).toFixed(1)}%`
      );
    } else {
      console.log(`  ❌ 未找到匹配的组件`);
    }

    return bestMatch?.component || null;
  }

  /**
   * 智能字段映射
   */
  function mapFieldsToTemplate(section, component) {
    const template = component.dataSourceTemplate || component.configTemplate;

    if (!template) {
      console.log(`  ⚠️  组件 ${component.name} 没有模板`);
      return {};
    }

    // 创建字段映射对象
    const fieldMapping = {};
    const metaFields = ["name", "summary"];

    // 处理外层字段和数组字段
    Object.keys(section).forEach((sectionKey) => {
      if (metaFields.includes(sectionKey)) return;

      const value = section[sectionKey];
      if (Array.isArray(value)) {
        // 数组字段保持原样，不在这里处理单个item
        // 数组字段的处理应该在更高层级进行，每个item可能需要不同的组件
        console.log(`  📋 发现数组字段 "${sectionKey}"，包含 ${value.length} 个item`);
        console.log(`  ⚠️  数组字段应在更高层级处理，每个item可能需要不同组件`);
        // 暂时跳过数组字段的处理
      } else {
        // 普通字段直接映射
        fieldMapping[sectionKey] = value;
      }
    });

    console.log(`  🔗 字段映射:`, Object.keys(fieldMapping));

    // 使用 lodash template 处理
    const templateString = JSON.stringify(template);
    const compiled = _.template(templateString);

    try {
      const result = JSON.parse(compiled(fieldMapping));
      console.log(`  ✅ 模板编译成功`);
      return result;
    } catch (error) {
      console.log(`  ❌ 模板编译失败:`, error.message);
      return template;
    }
  }

  /**
   * 处理数组字段中的单个item
   */
  function processArrayItem(item, itemIndex, fieldName, componentLibrary) {
    console.log(`    🔍 处理数组 "${fieldName}" 的第 ${itemIndex + 1} 个item`);
    
    if (typeof item !== 'object' || item === null) {
      console.log(`    ⚠️  Item 不是对象类型，跳过`);
      return null;
    }

    // 为单个item选择最适合的组件
    const selectedComponent = selectComponent(item, componentLibrary);
    
    if (selectedComponent) {
      console.log(`    ✅ 为item选择的组件: ${selectedComponent.name}`);
      
      // 为单个item进行字段映射
      const mappedData = mapFieldsToTemplate(item, selectedComponent);
      
      return {
        component: selectedComponent,
        data: mappedData,
        originalItem: item
      };
    } else {
      console.log(`    ❌ 未为item找到合适的组件`);
      return null;
    }
  }

  /**
   * 处理单个中间格式文件
   */
  function processMiddleFormatFile(fileData, index) {
    console.log(`\n📄 处理文件 ${index + 1}`);

    // 使用 SDK 的 extractFieldCombinations 方法分析文件
    const sectionsAnalysis = extractFieldCombinations(fileData);
    
    if (sectionsAnalysis.length === 0) {
      console.log(`  ⚠️  文件没有有效的 sections`);
      return;
    }

    console.log(`  📑 Section 数量: ${sectionsAnalysis.length}`);

    // 显示文件的 meta 信息
    const parsedData = typeof fileData === 'string' ? parse(fileData) : fileData;
    if (parsedData.meta) {
      console.log(`  📋 Meta:`, {
        title: parsedData.meta.title,
        description: parsedData.meta.description?.substring(0, 50) + "...",
      });
    }

    sectionsAnalysis.forEach((sectionAnalysis, sectionIndex) => {
      const section = sectionAnalysis.originalSection;
      console.log(`\n  🏷️  Section ${sectionIndex + 1}: "${section.name}"`);

      // 1. 先处理非数组字段，选择主要组件
      const selectedComponent = selectComponent(section, componentLibrary);

      if (selectedComponent) {
        // 字段映射（非数组字段）
        const mappedData = mapFieldsToTemplate(section, selectedComponent);

        // 输出映射结果的简要信息
        const previewKeys = Object.keys(mappedData).slice(0, 3);
        console.log(
          `  📤 主组件映射结果预览: ${previewKeys.join(", ")}${
            previewKeys.length < Object.keys(mappedData).length ? "..." : ""
          }`
        );
      }

      // 2. 处理数组字段
      sectionAnalysis.arrayFields.forEach((arrayField) => {
        const { fieldName, itemCount } = arrayField;
        const arrayValue = section[fieldName];
        
        console.log(`\n  📋 处理数组字段 "${fieldName}"`);
        
        const arrayResults = arrayValue.map((item, itemIndex) => 
          processArrayItem(item, itemIndex, fieldName, componentLibrary)
        ).filter(result => result !== null);
        
        if (arrayResults.length > 0) {
          console.log(`  ✅ 数组字段 "${fieldName}" 处理完成，成功处理 ${arrayResults.length}/${itemCount} 个item`);
          
          // 显示每个item使用的组件
          const componentSummary = arrayResults.map(result => result.component.name);
          console.log(`  📊 使用的组件: ${componentSummary.join(", ")}`);
        } else {
          console.log(`  ❌ 数组字段 "${fieldName}" 没有成功处理的item`);
        }
      });
    });
  }

  // 处理所有中间格式文件
  if (middleFormatFiles && Array.isArray(middleFormatFiles)) {
    middleFormatFiles.forEach((item, index) =>
      processMiddleFormatFile(item.content, index)
    );
  } else {
    console.log("❌ 没有有效的中间格式文件");
    console.log("📋 middleFormatFiles 类型:", typeof middleFormatFiles);
    if (middleFormatFiles) {
      console.log("📋 middleFormatFiles 结构:", Object.keys(middleFormatFiles));
    }
  }

  console.log("\n🎉 测试完成");

  return {
    success: true,
    processedFiles: middleFormatFiles?.length || 0,
    componentLibrarySize: componentLibrary?.length || 0,
  };
}

testSmartFieldMapping.taskTitle = "测试智能字段映射";
