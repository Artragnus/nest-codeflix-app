import { SearchResult } from "../search-result";

describe("Search Result Unit Tests", () => {
  test("constructor props", () => {
    let result = new SearchResult({
      items: ["entity1", "entity2", "entity3"] as any,
      total: 3,
      current_page: 1,
      per_page: 10,
    });

    expect(result.toJSON()).toStrictEqual({
      items: ["entity1", "entity2", "entity3"] as any,
      total: 3,
      current_page: 1,
      per_page: 10,
      last_page: 1,
    });
  });

  test("last_page prop", () => {
    let result = new SearchResult({
      items: ["entity1", "entity2", "entity3"] as any,
      total: 4,
      current_page: 1,
      per_page: 2,
    });

    expect(result.toJSON()).toStrictEqual({
      items: ["entity1", "entity2", "entity3"] as any,
      total: 4,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    result = new SearchResult({
      items: ["entity1", "entity2", "entity3"] as any,
      total: 101,
      current_page: 1,
      per_page: 20,
    });

    expect(result.toJSON()).toStrictEqual({
      items: ["entity1", "entity2", "entity3"] as any,
      total: 101,
      current_page: 1,
      per_page: 20,
      last_page: 6,
    });
  });
});
