import { normalizePath, toRelativePath } from "../../utils/utils.mjs";

export default function transformDetailDatasources({
  defaultDatasources = [],
  sourceIds,
  datasourcesList,
}) {
  // Build a map for fast lookup, with path normalization for compatibility
  const dsMap = Object.fromEntries(
    (datasourcesList || []).map((ds) => {
      const normalizedSourceId = normalizePath(ds.sourceId);
      return [normalizedSourceId, ds.content];
    }),
  );

  // Merge defaultDatasources with sourceIds and remove duplicates
  const allSourceIds = [...new Set([...(defaultDatasources || []), ...(sourceIds || [])])];

  // Collect formatted contents in order, with path normalization
  const contents = allSourceIds
    .filter((id) => {
      const normalizedId = normalizePath(id);
      return dsMap[normalizedId];
    })
    .map((id) => {
      const normalizedId = normalizePath(id);
      const relativeId = toRelativePath(id);
      return `// sourceId: ${relativeId}\n${dsMap[normalizedId]}\n\n`;
    });

  return { detailDataSources: contents.join("") };
}

transformDetailDatasources.task_render_mode = "hide";
