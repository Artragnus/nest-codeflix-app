import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategoryModelMapper } from "../category-model-mapper";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe("Category Model Mapper Integration Test", () => {
  setupSequelize({ models: [CategoryModel] });

  it("should map entity to model", async () => {
    const category = Category.fake().aCategory().build();
    const model = CategoryModelMapper.toModel(category);
    expect(model.toJSON()).toStrictEqual(category.toJSON());
  });

  it("should map model to entity", async () => {
    const model = CategoryModel.build(
      Category.fake().aCategory().build().toJSON()
    );
    const entity = CategoryModelMapper.toEntity(model);
    expect(entity.toJSON()).toStrictEqual(model.toJSON());
  });
});
