export default function getOptionsFromLabelMap(
  labelMap: Record<string, string>
) {
  return Object.entries(labelMap).map(([key, value]) => ({
    id: key,
    label: value,
  }));
}
