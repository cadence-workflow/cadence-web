/** Large page size because backends (SQLite/Postgres) sort by ID, not name.
 * Since we interleave results by name, a small page size causes items
 * to shuffle more often as new pages arrive. */
export const LIST_DOMAINS_API_PAGE_SIZE = 2000;
