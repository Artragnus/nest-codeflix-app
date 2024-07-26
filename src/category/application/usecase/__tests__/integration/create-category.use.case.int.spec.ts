import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { CreateCategoryUseCase } from "../../create-category.use.case";

describe("Create Category Use Case Int Test", () => {
  let repository: CategorySequelizeRepository;
  let useCase: CreateCategoryUseCase;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new CreateCategoryUseCase(repository);
  });

  it("should create a new category", async () => {
    const spyInsert = jest.spyOn(repository, "insert");
    const output = await useCase.execute({ name: "Category 1" });
    const entity = await repository.findById(new Uuid(output.id));
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      name: entity.name,
      id: entity.category_id.id,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });
  });
});
