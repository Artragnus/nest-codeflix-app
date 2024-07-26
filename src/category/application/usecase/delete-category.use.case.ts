import { IUseCase } from "../../../shared/application/use-case.interface";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { ICategoryRepository } from "../../domain/category.repository";

export class DeleteCategoryUseCase
  implements IUseCase<DeleteCategoryUseCaseInput, DeleteCategoryUseCaseOutput>
{
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(
    input: DeleteCategoryUseCaseInput
  ): Promise<DeleteCategoryUseCaseOutput> {
    const uuid = new Uuid(input.id);
    return await this.categoryRepo.delete(uuid);
  }
}

export type DeleteCategoryUseCaseInput = {
  id: string;
};

export type DeleteCategoryUseCaseOutput = void;
