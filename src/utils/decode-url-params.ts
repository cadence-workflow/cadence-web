export default function decodeUrlParams<Params extends { [k: string]: string }>(
  params: Params
): Params {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      decodeURIComponent(value),
    ])
  ) as Params; // shrink object type to include only keys from params
}
