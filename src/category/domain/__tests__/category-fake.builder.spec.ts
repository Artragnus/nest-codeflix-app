import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { CategoryFakeBuilder } from "../category-fake.builder";
import { Category } from "../category.entity";

describe("Category Fake Builder Unit Test", () => {
  describe("category_id prop", () => {
    const faker = Category.fake().aCategory();
    it("should throw error when any with methods has called", () => {
      expect(() => faker.category_id).toThrow(
        new Error("Property category_id not have a factory, use 'with' methods")
      );
    });

    it("should be undefined", () => {
      expect(faker["_category_id"]).toBeUndefined();
    });

    test("with uuid", () => {
      const category_id = new Uuid();
      const $this = faker.withUuid(category_id);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["_category_id"]).toBeDefined();
      expect(faker["_category_id"]).toBe(category_id);
      expect(faker.category_id).toBe(category_id);
    });
  });

  describe("name prop", () => {
    const faker = Category.fake().aCategory();
    const fakerMany = Category.fake().theCategories(10);

    expect(faker["_name"]).toBeDefined();

    test("with name", () => {
      const name = "Category 1";
      const $this = faker.withName(name);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["_name"]).toBeDefined();
      expect(faker["_name"]).toBe(name);
      expect(faker.name).toBe(name);

      const categorie = $this.build();
      expect(categorie.name).toBe(name);
      expect(categorie).toBeInstanceOf(Category);
    });

    test("with invalid name empty", () => {
      const $this = faker.withInvalidNameEmpty("");
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["_name"]).toBe("");
      expect(faker.name).toBe("");

      const categorie = $this.build();
      expect(categorie.name).toBe("");
      expect(categorie).toBeInstanceOf(Category);
    });

    test("many faker entity with name", () => {
      const categories = fakerMany
        .withName((index) => `Category ${index + 1}`)
        .build();
      expect(categories).toHaveLength(10);
      expect(categories[0].name).toBe("Category 1");
      expect(categories[9].name).toBe("Category 10");
    });
  });
});
