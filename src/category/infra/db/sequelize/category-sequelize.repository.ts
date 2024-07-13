import { CreatedAt } from "sequelize-typescript";
import { SearchParams } from "../../../../shared/domain/repository/search-params";
import { SearchResult } from "../../../../shared/domain/repository/search-result";
import { Entity } from "../../../../shared/domain/value-objects/entity";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { ICategoryRepository } from "../../../domain/category.repository";
import { CategoryModel } from "./category.model";

export class CategorySequelizeRepository implements ICategoryRepository {
  constructor(private categoryModel: typeof CategoryModel) {}
  sortableFields: string[] = ["name", "created_at"];

  async insert(entity: Category): Promise<void> {
    await this.categoryModel.create({
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });
  }
  bulkInsert(entities: Category[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
  update(entity: Category): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(entityId: Uuid): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findById(entityId: Uuid): Promise<Category | null> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<Category[]> {
    throw new Error("Method not implemented.");
  }
  getEntity(): new (...args: any[]) => Category {
    throw new Error("Method not implemented.");
  }

  search(props: SearchParams<string>): Promise<SearchResult<Entity>> {
    throw new Error("Method not implemented.");
  }
}
