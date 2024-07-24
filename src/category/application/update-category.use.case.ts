export class UpdateCategoryUseCase {
  categoryRepo: any;
  constructor(categoryRepo: any) {
    this.categoryRepo = categoryRepo;
  }
  async execute(input: { id: any }) {
    const entity = await this.categoryRepo.findById(input.id);
    if (!entity) {
      throw new Error("Category not found");
    }
    entity.update(input);
    await this.categoryRepo.update(entity);
    return {
      id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    };
  }
}
