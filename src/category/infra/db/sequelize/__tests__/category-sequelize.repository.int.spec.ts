import { Sequelize } from "sequelize-typescript";
import { CategorySequelizeRepository } from "../category-sequelize.repository";
import { CategoryModel } from "../category.model";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { CategoryModelMapper } from "../category-model-mapper";
import {
  CategorySearchParams,
  CategorySearchResult,
} from "../../../../domain/category.repository";

describe("Category Sequelize Repository Integration Test", () => {
  let sequelize;
  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [CategoryModel],
      logging: false,
    });
    await sequelize.sync({ force: true });
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  it("should create a category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    let entity = await CategoryModel.findByPk(category.category_id.id);
    expect(category.toJSON()).toStrictEqual(entity.toJSON());
  });

  it("shoud update a category", async () => {
    const category_id = new Uuid();
    const category = Category.fake().aCategory().withUuid(category_id).build();
    const randomCategory = Category.fake().aCategory().build();
    await repository.insert(category);

    category.changeName("test");
    await repository.update(category);
    await expect(repository.update(randomCategory)).rejects.toThrow(
      NotFoundError
    );
    let entity = await CategoryModel.findByPk(category.category_id.id);

    expect(entity.name).toBe("test");
    expect(entity.toJSON()).toStrictEqual(category.toJSON());
  });

  it("should find all categories", async () => {
    const categories = Category.fake().theCategories(3).build();

    categories.forEach(async (category) => {
      await repository.insert(category);
    });

    let entities = await repository.findAll();
    expect(entities).toHaveLength(3);
    expect(entities.map((entity) => entity.toJSON())).toStrictEqual(
      categories.map((category) => category.toJSON())
    );
  });

  test("find category by id", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    let entity = await repository.findById(category.category_id);
    expect(entity).toMatchObject(category);
    expect(entity.toJSON()).toStrictEqual(category.toJSON());
    expect(entity.category_id).toStrictEqual(category.category_id);

    await expect(repository.findById(new Uuid())).resolves.toBe(null);
  });

  test("delete category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    await repository.delete(category.category_id);
    await expect(repository.findById(category.category_id)).resolves.toBe(null);

    await expect(repository.delete(new Uuid())).rejects.toThrow(NotFoundError);
  });

  describe("search method tests", () => {
    it("should only apply paginate when other params are null", async () => {
      const created_at = new Date();
      const categories = Category.fake()
        .theCategories(16)
        .withName("Test")
        .withDescription(null)
        .withCreatedAt(created_at)
        .build();
      await repository.bulkInsert(categories);

      const spyToEntity = jest.spyOn(CategoryModelMapper, "toEntity");
      const searchOutput = await repository.search(new CategorySearchParams());
      expect(searchOutput).toBeInstanceOf(CategorySearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.category_id).toBeDefined();
      });
    });
    it("should order by created_at DESC when search params are null", async () => {
      const created_at = new Date();
      const categories = Category.fake()
        .theCategories(16)
        .withName((index) => `Test ${index}`)
        .withDescription(null)
        .withCreatedAt((index) => new Date(created_at.getTime() + index))
        .build();
      const searchOutput = await repository.search(new CategorySearchParams());
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(`Test ${index}`).toBe(categories[index + 1].name);
      });
    });

    it("should apply paginate and filter", async () => {
      const categories = [
        Category.fake()
          .aCategory()
          .withName("test")
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        Category.fake()
          .aCategory()
          .withName("a")
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        Category.fake()
          .aCategory()
          .withName("TEST")
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        Category.fake()
          .aCategory()
          .withName("TeSt")
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ];

      await repository.bulkInsert(categories);
      let searchOutput = await repository.search(
        new CategorySearchParams({
          page: 1,
          per_page: 2,
          filter: "TEST",
        })
      );

      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[0], categories[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
        }).toJSON(true)
      );
    });

    it("should apply paginate and sort", async () => {
      expect(repository.sortableFields).toStrictEqual(["name", "created_at"]);

      const categories = [
        Category.fake().aCategory().withName("d").build(),
        Category.fake().aCategory().withName("b").build(),
        Category.fake().aCategory().withName("a").build(),
        Category.fake().aCategory().withName("c").build(),
      ];

      await repository.bulkInsert(categories);

      const arrange = [
        {
          params: new CategorySearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
          }),

          result: new CategorySearchResult({
            items: [categories[2], categories[1]],
            total: 4,
            current_page: 1,
            per_page: 2,
          }),
        },

        {
          params: new CategorySearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
          }),

          result: new CategorySearchResult({
            items: [categories[3], categories[0]],
            total: 4,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      for (let i = 0; i < arrange.length; i++) {
        const result = await repository.search(arrange[i].params);
        expect(result.toJSON(true)).toMatchObject(
          arrange[i].result.toJSON(true)
        );
      }
    });

    it("should apply paginate, filter and sort", async () => {
      const categories = [
        Category.fake().aCategory().withName("test").build(),
        Category.fake().aCategory().withName("TeST").build(),
        Category.fake().aCategory().withName("a").build(),
        Category.fake().aCategory().withName("TEST").build(),
      ];

      await repository.bulkInsert(categories);

      const arrange = [
        {
          params: new CategorySearchParams({
            page: 1,
            per_page: 2,
            filter: "TEST",
            sort: "name",
          }),
          result: new CategorySearchResult({
            items: [categories[3], categories[1]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },

        {
          params: new CategorySearchParams({
            page: 1,
            per_page: 2,
            filter: "a",
            sort: "name",
          }),

          result: new CategorySearchResult({
            items: [categories[2]],
            total: 1,
            current_page: 1,
            per_page: 2,
          }),
        },
      ];

      for (let i = 0; i < arrange.length; i++) {
        const result = await repository.search(arrange[i].params);
        expect(result.toJSON(true)).toMatchObject(
          arrange[i].result.toJSON(true)
        );
      }
    });
  });
});
