import { SearchParams } from "../search-params";

describe("Search Params Unit Tests", () => {
  test("page prop", () => {
    const params = new SearchParams();
    expect(params.page).toBe(1);

    const arrange = [
      { page: 0, expected: 1 },
      { page: -1, expected: 1 },
      { page: undefined, expected: 1 },
      { page: null, expected: 1 },
      { page: {}, expected: 1 },
      { page: true, expected: 1 },
      { page: false, expected: 1 },

      { page: 2, expected: 2 },
      { page: 3, expected: 3 },
    ];

    arrange.forEach((i) => {
      expect(new SearchParams({ page: i.page as any }).page).toBe(i.expected);
    });
  });

  test("per_page prop", () => {
    const params = new SearchParams();
    expect(params.per_page).toBe(15);

    const arrange = [
      { per_page: 0, expected: 15 },
      { per_page: -1, expected: 15 },
      { per_page: undefined, expected: 15 },
      { per_page: null, expected: 15 },
      { per_page: {}, expected: 15 },
      { per_page: true, expected: 15 },
      { per_page: false, expected: 15 },

      { per_page: 2, expected: 2 },
      { per_page: 3, expected: 3 },
    ];

    arrange.forEach((i) => {
      expect(new SearchParams({ per_page: i.per_page as any }).per_page).toBe(
        i.expected
      );
    });
  });

  test("sort prop", () => {
    const params = new SearchParams();
    expect(params.sort).toBe(null);

    const arrange = [
      { sort: "", expected: null },
      { sort: "name", expected: "name" },
      { sort: null, expected: null },
      { sort: undefined, expected: null },
      { sort: true, expected: "true" },
      { sort: false, expected: "false" },

      { sort: "created_at", expected: "created_at" },
      { sort: "updated_at", expected: "updated_at" },
    ];

    arrange.forEach((i) => {
      expect(new SearchParams({ sort: i.sort as any }).sort).toBe(i.expected);
    });
  });

  test("sort_dir prop", () => {
    const params = new SearchParams();
    expect(params.sort_dir).toBe(null);

    const arrange = [
      { sort_dir: true, expected: "asc" },
      { sort_dir: false, expected: "asc" },
      { sort_dir: null, expected: "asc" },
      { sort_dir: undefined, expected: "asc" },
      { sort_dir: "test", expected: "asc" },

      { sort_dir: "desc", expected: "desc" },
      { sort_dir: "asc", expected: "asc" },
      { sort_dir: "DESC", expected: "desc" },
      { sort_dir: "ASC", expected: "asc" },
    ];

    arrange.forEach((i) => {
      expect(
        new SearchParams({ sort: "test", sort_dir: i.sort_dir as any }).sort_dir
      ).toBe(i.expected);
    });
  });
});
