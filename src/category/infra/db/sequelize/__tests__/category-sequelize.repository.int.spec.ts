import { Sequelize } from "sequelize-typescript";
import { CategorySequelizeRepository } from "../category-sequelize.repository";
import { CategoryModel } from "../category.model";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";

describe('Category Sequelize Repository Integration Test', () => {
    let sequelize;
    let repository: CategorySequelizeRepository;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            models: [CategoryModel],
            logging: false
        })
        await sequelize.sync({force: true});
        repository = new CategorySequelizeRepository(CategoryModel);
    })

    it('should create a category', async () => {
        const category = Category.fake().aCategory().build();
        await repository.insert(category)
        let entity = await CategoryModel.findByPk(category.category_id.id)
        expect(category.toJSON()).toStrictEqual(entity.toJSON()) 
    })

    

    it('shoud update a category', async () => {
        const category_id = new Uuid()
        const category = Category.fake().aCategory().withUuid(category_id).build();
        console.log(category_id)
        console.log(category.category_id.id)
        await repository.insert(category)
        
      
        let entity = await CategoryModel.findByPk(category.category_id.id)

        console.log(entity.toJSON())

        expect(category.toJSON()).toStrictEqual(entity.toJSON())


    })
})