import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { InMemoryRepository } from "../../../../../shared/infra/db/in-memory/in-memory.repository";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { CreateCategoryUseCase } from "../../create-category.use.case";

describe("Create Category Use Case Unit Test", () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase(repository);
  });

  it("should create a new category", async () => {
    const spyInsert = jest.spyOn(repository, "insert");
    const output = await useCase.execute({ name: "Category 1" });
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      name: "Category 1",
      id: repository.items[0].category_id.id,
      description: null,
      is_active: true,
      created_at: repository.items[0].created_at,
    });
  });
});
