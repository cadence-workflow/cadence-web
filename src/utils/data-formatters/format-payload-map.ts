import formatPayload from './format-payload';

const formatPayloadMap = <K extends string>(
  map: { [key in K]: any } | null | undefined,
  fieldKey: K
) => {
  if (!map?.[fieldKey]) {
    return null;
  }

  return {
    [fieldKey]: Object.keys(map[fieldKey])
      .map((key) => ({
        [key]: formatPayload(map[fieldKey][key]),
      }))
      .reduce(
        (accumulator, value) => ({
          ...accumulator,
          ...value,
        }),
        {}
      ),
  } as { [key in K]: any };
};

export default formatPayloadMap;
