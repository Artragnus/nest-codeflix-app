import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";
describe("Category Unit Tests", () => {
  describe("constructor", () => {
    test("should set only category name property", () => {
      const category = new Category({
        name: "Movie",
      });
      expect(category.name).toBe("Movie");
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test("should set all category properties", () => {
      const created_at = new Date();
      const category = new Category({
        category_id: new Uuid(),
        created_at,
        name: "Movie",
        description: "Movies",
        is_active: false,
      });
      expect(category.name).toBe("Movie");
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.description).toBe("Movies");
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });

  describe("create command", () => {
    test("should create category with only name property", () => {
      const category = Category.create({
        name: "Movie",
      });
      expect(category.name).toBe("Movie");
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test("should create category with all properties", () => {
      const category = Category.create({
        name: "Movie",
        description: "Movies",
        is_active: false,
      });
      expect(category.name).toBe("Movie");
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.description).toBe("Movies");
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });

  describe("factory methods", () => {
    test("should change category name", () => {
      const category = Category.create({
        name: "Movie",
      });
      category.changeName("Music");
      expect(category.name).toBe("Music");
    });

    test("should change category description", () => {
      const category = Category.create({
        name: "Movie",
      });
      category.changeDescription("Movies");
      expect(category.description).toBe("Movies");
    });

    test("should change category status to active", () => {
      const category = Category.create({
        name: "Movie",
        is_active: false,
      });
      category.activate();
      expect(category.is_active).toBeTruthy();
    });

    test("should change category status to inactive", () => {
      const category = Category.create({
        name: "Movie",
      });
      category.deactivate();
      expect(category.is_active).toBeFalsy();
    });

    test("should return a JSON object", () => {
      const uuid = new Uuid();
      const category = new Category({
        category_id: uuid,
        name: "Movie",
      });
      const categoryJSON = category.toJSON();
      expect(categoryJSON).toEqual({
        category_id: uuid.id,
        name: "Movie",
        description: null,
        is_active: true,
        created_at: category.created_at,
      });
    });
  });

  describe("category_id field", () => {
    const arrange = [
      { category_id: null },
      { category_id: undefined },
      { category_id: new Uuid() },
      { category_id: new Uuid("123e4567-e89b-12d3-a456-426614174000") },
    ];

    test.each(arrange)("id = %j", ({ category_id }) => {
      const category = new Category({
        category_id: category_id as any,
        name: "Movie",
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      if (category_id instanceof Uuid) {
        expect(category.category_id).toBe(category_id);
      }
    });
  });
});
