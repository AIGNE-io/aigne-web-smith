import comparisonTableFormatter from "./comparison-table.mjs";

const formatterRegistry = new Map(
  [
    ["comparison-table", comparisonTableFormatter],
    ["arpghy2x1gujtdu7", comparisonTableFormatter],
    ["comparison table", comparisonTableFormatter],
  ].filter(Boolean),
);

function normalizeRegistryKey(value) {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.toLowerCase().replace(/\s+/g, "-");
}

export function getSectionFormatterByComponent(component) {
  if (!component) return null;

  if (component.key) {
    const formatter = formatterRegistry.get(component.key);
    if (formatter) return formatter;
  }

  if (component.id) {
    const formatter = formatterRegistry.get(component.id);
    if (formatter) return formatter;
  }

  if (component.name) {
    const nameFormatter =
      formatterRegistry.get(component.name) ||
      formatterRegistry.get(normalizeRegistryKey(component.name));
    if (nameFormatter) return nameFormatter;
  }

  return null;
}

export function getSectionFormatterByMatch(matchResult) {
  if (!matchResult) return null;
  const { component } = matchResult;
  return getSectionFormatterByComponent(component);
}
