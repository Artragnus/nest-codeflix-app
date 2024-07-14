import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { SearchParams } from "../../../../shared/domain/repository/search-params";
import { SearchResult } from "../../../../shared/domain/repository/search-result";
import { Entity } from "../../../../shared/domain/value-objects/entity";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import {
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from "../../../domain/category.repository";
import { CategoryModel } from "./category.model";

export class CategorySequelizeRepository implements ICategoryRepository {
  constructor(private categoryModel: typeof CategoryModel) {}
  sortableFields: string[] = ["name", "created_at"];

  private async _get(id: string) {
    return await this.categoryModel.findByPk(id);
  }

  async insert(entity: Category): Promise<void> {
    await this.categoryModel.create({
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    await this.categoryModel.bulkCreate(
      entities.map((entity) => ({
        category_id: entity.category_id.id,
        name: entity.name,
        description: entity.description,
        is_active: entity.is_active,
        created_at: entity.created_at,
      }))
    );
  }

  async update(entity: Category): Promise<void> {
    const category_id = entity.category_id.id;
    const model = await this._get(category_id);

    if (!model) {
      throw new NotFoundError(category_id, this.getEntity());
    }

    await this.categoryModel.update(
      {
        category_id,
        name: entity.name,
        description: entity.description,
        is_active: entity.is_active,
        created_at: entity.created_at,
      },
      { where: { category_id } }
    );
  }

  async delete(entity_id: Uuid): Promise<void> {
    const category_id = entity_id.id;
    const model = await this._get(category_id);
    if (!model) {
      throw new NotFoundError(category_id, this.getEntity());
    }
    await this.categoryModel.destroy({ where: { category_id } });
  }

  async findById(entity_id: Uuid): Promise<Category | null> {
    const model = await this._get(entity_id.id);

    return new Category({
      category_id: new Uuid(model.category_id),
      name: model.name,
      description: model.description,
      is_active: model.is_active,
      created_at: model.created_at,
    });
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();
    return models.map((model) => {
      return new Category({
        category_id: new Uuid(model.category_id),
        name: model.name,
        description: model.description,
        is_active: model.is_active,
        created_at: model.created_at,
      });
    });
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }

  search(props: CategorySearchParams): Promise<CategorySearchResult> {
    throw new Error("Method not implemented.");
  }
}
