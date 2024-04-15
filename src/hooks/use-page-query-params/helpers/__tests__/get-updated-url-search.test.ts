import { queryParamsConfig } from "../../__fixtures__/page-query-params.fixtures";
import getUpdatedUrlSearch from "../get-updated-url-search";

describe('getUpdatedUrlSearch', () => {
    it('should return empty string if no values to update and current search string is empty', async () => {
        const newSearchString = getUpdatedUrlSearch(queryParamsConfig, {}, '');
        expect(newSearchString).toBe('');
    });
    it('should return current search string if no values to update', () => {
        const newSearchString = getUpdatedUrlSearch(queryParamsConfig, {}, '?sortBy=x&random=1');
        expect(newSearchString).toBe('sortBy=x&random=1');
    });
    it('should return the new url search string with applied values', () => {
        const newSearchString = getUpdatedUrlSearch(
            queryParamsConfig,
            {
                multiValDefaulted: ["a", "b", "c"],
                sortBy: 'a',
            },
            ''
        );
        expect(newSearchString).toBe('sortBy=a&multiValDefaulted=a&multiValDefaulted=b&multiValDefaulted=c');
    });
    it('should use the queryParamKey instead of key if present', () => {
        const newSearchString = getUpdatedUrlSearch(
            queryParamsConfig,
            {
                aliased: 'aa',
            },
            ''
        );
        expect(newSearchString).toBe('aliasName=aa');
    });
    it('should append values to current search string if present', () => {
        const newSearchString = getUpdatedUrlSearch(
            queryParamsConfig,
            {
                sortBy: 'a',
            },
            '?existing=existing'
        );
        expect(newSearchString).toBe('existing=existing&sortBy=a');
    });
});