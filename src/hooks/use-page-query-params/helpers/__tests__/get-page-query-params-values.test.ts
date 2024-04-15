import { queryParamsConfig } from "../../__fixtures__/page-query-params.fixtures";
import getPageQueryParamsValues from "../get-page-query-params-values";

describe('getPageQueryParamsValues', () => {
    it('should return default values only when its value is undefined', () => {
      const values = getPageQueryParamsValues(queryParamsConfig, { defaulted: 'a' });
      expect(values.defaulted).toBe('a');
  
      const withDefaultValues = getPageQueryParamsValues(queryParamsConfig, {});
      expect(withDefaultValues.defaulted).toBe('defaultValue');
    });
  
    it('should return values only for related query params ', () => {
      const values = getPageQueryParamsValues(queryParamsConfig, {
        sortBy: 'a',
        unrelevant: 'b',
      });
      expect(values.sortBy).toBe('a');
      // @ts-ignore: property unrelevant doesn't exist in unrelevant (this is expected)
      expect(values.unrelevant).not.toBeDefined();
    });
  
    it('should return values only for related query params ', () => {
      const values = getPageQueryParamsValues(queryParamsConfig, {
        parsed: '1',
        parsedMultiVal: ['1', '2', '3'],
      });
      expect(values.parsed).toBe(1);
      expect(values.parsedMultiVal).toStrictEqual([1, 2, 3]);
    });
  });