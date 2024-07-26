import { IUseCase } from "../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../domain/category.entity";
import { ICategoryRepository } from "../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "./common/category-output";

export class GetCategoryUseCase
  implements IUseCase<GetCategoryUseCaseInput, GetCategoryUseCaseOutput>
{
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(
    input: GetCategoryUseCaseInput
  ): Promise<GetCategoryUseCaseOutput> {
    const uuid = new Uuid(input.id);
    const category = await this.categoryRepo.findById(uuid);

    if (!category) {
      throw new NotFoundError(input.id, Category);
    }

    return CategoryOutputMapper.toOutput(category);
  }
}

export type GetCategoryUseCaseInput = {
  id: string;
};

export type GetCategoryUseCaseOutput = CategoryOutput;
