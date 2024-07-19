import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategoryModelMapper } from "../category-model-mapper";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";

describe('Category Model Mapper Integration Test', () => {
let sequelize;
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [CategoryModel],
      logging: false,
    });
    await sequelize.sync({ force: true });
  });

    it("should map entity to model", async () => {
        const category = Category.fake().aCategory().build();
        const model = CategoryModelMapper.toModel(category);
        expect(model.toJSON()).toStrictEqual(category.toJSON());
    });

    it("should map model to entity", async () => {
        const model = CategoryModel.build(Category.fake().aCategory().build().toJSON());
        const entity = CategoryModelMapper.toEntity(model);
        expect(entity.toJSON()).toStrictEqual(model.toJSON());
    })

    it('should throw error when is an invalid category', async () => {
        const model = CategoryModel.build({
            category_id: new Uuid().id
        })

        expect(() => CategoryModelMapper.toEntity(model)).containsErrorMessages({
            name: [
                "name should not be empty",
                "name must be a string",
                "name must be shorter than or equal to 255 characters",
              ],
        })
    })
})