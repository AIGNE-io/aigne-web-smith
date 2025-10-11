function isEmptyValue(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim().length === 0) return true;
  if (Array.isArray(value)) {
    return value.every((item) => isEmptyValue(item));
  }
  if (typeof value === "object") {
    return Object.keys(value).every((key) => isEmptyValue(value[key]));
  }
  return false;
}

function filterEntities(entities = []) {
  const filtered = entities.reduce((acc, entity, index) => {
    if (!entity || typeof entity !== "object") return false;
    const hasContent = ["l", "s", "h", "d", "al", "au", "at", "i"].some((key) => {
      const value = entity[key];
      if (typeof value === "string") return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "object" && value !== null) return Object.keys(value).length > 0;
      return false;
    });
    if (hasContent) {
      acc.push({ entity, index });
    }
    return acc;
  }, []);

  return {
    filteredEntities: filtered,
    emptyCount: entities.length - filtered.length,
  };
}

function filterFeatures(features = []) {
  const filtered = features.reduce((acc, feature, index) => {
    if (!feature || typeof feature !== "object") return false;
    const hasContent = ["l", "t", "i"].some((key) => {
      const value = feature[key];
      return typeof value === "string" && value.trim().length > 0;
    });
    if (hasContent) {
      acc.push({ feature, index });
    }
    return acc;
  }, []);

  return {
    filteredFeatures: filtered,
    emptyCount: features.length - filtered.length,
  };
}

function buildEntitiesOutput(entities, indent) {
  if (!entities || entities.length === 0) {
    return `${indent}📊 Entities: (none)`;
  }

  const lines = entities
    .map(({ entity }, index) => {
      const parts = [];
      if (entity?.l) parts.push(entity.l);
      if (entity?.s) parts.push(`(${entity.s})`);
      if (entity?.h) parts.push(`[${entity.h}]`);
      return `${indent}     ${index + 1}. ${parts.join(" ") || "(empty)"}`;
    })
    .join("\n");

  return `${indent}📊 Entities (${entities.length} items):\n${lines}`;
}

function buildFeaturesOutput(features, indent) {
  if (!features || features.length === 0) {
    return `${indent}📌 Features: (none)`;
  }

  const lines = features
    .map(({ feature }, index) => {
      const parts = [];
      if (feature?.l) parts.push(feature.l);
      if (feature?.t) parts.push(`(${feature.t})`);
      return `${indent}     ${index + 1}. ${parts.join(" ") || "(empty)"}`;
    })
    .join("\n");

  return `${indent}📌 Features (${features.length} items):\n${lines}`;
}

function formatCell(cell) {
  if (!cell || typeof cell !== "object") return "(empty)";
  const parts = [];
  if (cell.v && cell.v.trim().length > 0) parts.push(cell.v);
  if (cell.t && cell.t.trim().length > 0) parts.push(`(${cell.t})`);
  if (cell.h && cell.h.trim().length > 0) parts.push(`[${cell.h}]`);
  return parts.join(" ") || "(empty)";
}

function buildMatrixOutput(matrix, filteredFeatures, filteredEntities, indent) {
  if (!matrix || typeof matrix !== "object") return null;
  if (!filteredFeatures || filteredFeatures.length === 0) return null;
  if (!filteredEntities || filteredEntities.length === 0) return null;

  const featureKeys = filteredFeatures.map(({ index }) => `f${index}`);
  const entityKeys = filteredEntities.map(({ index }) => `e${index}`);
  const rows = featureKeys
    .map((featureKey, arrayIndex) => {
      const featureRow = matrix[featureKey];
      if (!featureRow || typeof featureRow !== "object") return null;

      const cells = entityKeys
        .map((entityKey, entityArrayIndex) => {
          const cell = featureRow[entityKey];
          const content = formatCell(cell);
          const entityLabel = filteredEntities[entityArrayIndex]?.entity?.l;
          const entityName =
            entityLabel ||
            `Entity ${filteredEntities[entityArrayIndex]?.index + 1 || entityArrayIndex + 1}`;
          return `${indent}       - ${entityName}: ${content}`;
        })
        .join("\n");

      const featureLabel = filteredFeatures[arrayIndex]?.feature?.l;
      const featureName = featureLabel || featureKey.toUpperCase();
      return `${indent}   Feature ${featureName}\n${cells}`;
    })
    .filter(Boolean)
    .join("\n");

  if (!rows || rows.trim().length === 0) {
    return null;
  }

  return `${indent}📊 Comparison Matrix\n${rows}`;
}

export default function renderComparisonTable(section, { indent = "" } = {}) {
  if (!section || typeof section !== "object") {
    return null;
  }

  const entitiesRaw = section.e;
  const featuresRaw = section.f;
  const matrixRaw = section.m;

  const { filteredEntities, emptyCount: emptyEntities } = filterEntities(entitiesRaw || []);
  const { filteredFeatures, emptyCount: emptyFeatures } = filterFeatures(featuresRaw || []);
  const matrixOutput = buildMatrixOutput(matrixRaw, filteredFeatures, filteredEntities, indent);

  const parts = [];

  if (section.comparisonTableTitle) {
    parts.push(`${indent}Title: ${section.comparisonTableTitle}`);
  }

  if (section.featureTitle) {
    parts.push(`${indent}Title: ${section.featureTitle}`);
  }

  parts.push(buildEntitiesOutput(filteredEntities, indent));
  if (emptyEntities > 0) {
    parts.push(`${indent}   • ${emptyEntities} empty entity slots hidden`);
  }

  parts.push(buildFeaturesOutput(filteredFeatures, indent));
  if (emptyFeatures > 0) {
    parts.push(`${indent}   • ${emptyFeatures} empty feature slots hidden`);
  }

  if (matrixOutput) {
    parts.push(matrixOutput);
  }

  return parts.filter((item) => !isEmptyValue(item)).join("\n");
}
