export default function getFilteredComboboxOptions(
  options: string[],
  filterValue: string
): Array<{ id: string }> {
  const allOptions = options.map((opt) => ({ id: opt }));

  if (!filterValue) return allOptions;

  return allOptions.filter((opt) =>
    opt.id.toLowerCase().includes(filterValue.toLowerCase())
  );
}
