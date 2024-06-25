import { Category } from "../domain/category.entity";

describe("Category Unit Tests", () => {
  describe("constructor", () => {
    test("should set only category name property", () => {
      const category = new Category({
        name: "Movie",
      });
      expect(category.name).toBe("Movie");
      expect(category.category_id).toBeNull();
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test("should set all category properties", () => {
      const created_at = new Date();
      const category = new Category({
        created_at,
        name: "Movie",
        description: "Movies",
        is_active: false,
      });
      expect(category.name).toBe("Movie");
      expect(category.category_id).toBeNull();
      expect(category.description).toBe("Movies");
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });

  describe("create command", () => {
    test("should set only category name property", () => {
      const category = Category.create({
        name: "Movie",
      });
      expect(category.name).toBe("Movie");
      expect(category.category_id).toBeNull();
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test("should set all category properties", () => {
      const category = Category.create({
        name: "Movie",
        description: "Movies",
        is_active: false,
      });
      expect(category.name).toBe("Movie");
      expect(category.category_id).toBeNull();
      expect(category.description).toBe("Movies");
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });

  describe("factory methods", () => {
    test("should change category name", () => {
      const category = new Category({
        name: "Movie",
      });
      category.changeName("Music");
      expect(category.name).toBe("Music");
    });

    test("should change category description", () => {
      const category = new Category({
        name: "Movie",
      });
      category.changeDescription("Movies");
      expect(category.description).toBe("Movies");
    });

    test("should change category status to active", () => {
      const category = new Category({
        name: "Movie",
        is_active: false,
      });
      category.activate();
      expect(category.is_active).toBeTruthy();
    });

    test("should change category status to inactive", () => {
      const category = new Category({
        name: "Movie",
      });
      category.deactivate();
      expect(category.is_active).toBeFalsy();
    });

    test("should return a JSON object", () => {
      const category = new Category({
        name: "Movie",
      });
      const categoryJSON = category.toJSON();
      expect(categoryJSON).toEqual({
        category_id: null,
        name: "Movie",
        description: null,
        is_active: true,
        created_at: category.created_at,
      });
    });
  });
});
