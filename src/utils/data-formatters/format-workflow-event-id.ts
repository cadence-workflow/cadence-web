import toNumber from 'lodash/toNumber';

const formatWorkflowEventId = (input: string | number | null | undefined) => {
  if (input === null || input === undefined || input === '') return null;
  const parsedNumber = toNumber(input);
  return isNaN(parsedNumber) ? input : parsedNumber;
};

export default formatWorkflowEventId;
