import { Op } from "sequelize";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import {
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from "../../../domain/category.repository";
import { CategoryModel } from "./category.model";
import { CategoryModelMapper } from "./category-model-mapper";

export class CategorySequelizeRepository implements ICategoryRepository {
  constructor(private categoryModel: typeof CategoryModel) {}
  sortableFields: string[] = ["name", "created_at"];

  private async _get(id: string) {
    return await this.categoryModel.findByPk(id);
  }

  async insert(entity: Category): Promise<void> {
    await this.categoryModel.create(CategoryModelMapper.toModel(entity).toJSON());
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    await this.categoryModel.bulkCreate(
      entities.map((entity) => ({
        ...CategoryModelMapper.toModel(entity).toJSON(),
      }))
    );
  }

  async update(entity: Category): Promise<void> {
    const category_id = entity.category_id.id;
    const model = await this._get(category_id);

    if (!model) {
      throw new NotFoundError(category_id, this.getEntity());
    }

    const modelToUpdate = CategoryModelMapper.toModel(entity);
    await this.categoryModel.update(
      modelToUpdate.toJSON(),
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
    const category_id = entity_id.id;
    const model = await this._get(category_id);

    return model ? CategoryModelMapper.toEntity(model) : null
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();
    return models.map((model) => {
      return CategoryModelMapper.toEntity(model);
    });
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: { [Op.like]: `%${props.filter}%` },
        },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: [[props.sort, props.sort_dir]] }
        : { order: [["created_at", "desc"]] }),
      offset,
      limit,
    });

    return new CategorySearchResult({
      items: models.map((model) => {
       return CategoryModelMapper.toEntity(model);
      }),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }
}