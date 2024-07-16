import { Sequelize } from "sequelize-typescript";
import { CategorySequelizeRepository } from "../category-sequelize.repository";
import { CategoryModel } from "../category.model";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";

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
    await repository.insert(category);

    category.changeName("test");
    await repository.update(category);
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

    await expect(repository.findById(new Uuid())).rejects.toThrow(
      NotFoundError
    );
  });

  test("delete category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    await repository.delete(category.category_id);
    await expect(repository.findById(category.category_id)).rejects.toThrow(
      NotFoundError
    );
  });
});
