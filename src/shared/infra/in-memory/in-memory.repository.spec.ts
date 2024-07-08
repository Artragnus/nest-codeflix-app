import { before } from "lodash";
import { ValueObject } from "../../domain/value-object";
import { Entity } from "../../domain/value-objects/entity";
import { Uuid } from "../../domain/value-objects/uuid.vo";
import { InMemoryRepository } from "./in-memory.repository";
import { NotFoundError } from "../../domain/errors/not-found.error";

type StubEntityProps = {
  entity_id?: Uuid;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor(props: StubEntityProps) {
    super();
    this.entity_id = props.entity_id || new Uuid();
    this.name = props.name;
    this.price = props.price;
  }
  toJSON() {
    return {
      entity_id: this.entity_id.id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
  constructor() {
    super();
  }
}
describe("InMemoryRepository Unit Tests", () => {
  let repo: StubInMemoryRepository;

  beforeEach(() => {
    repo = new StubInMemoryRepository();
  });

  test("should insert a new entity", async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: "Test",
      price: 100,
    });
    await repo.insert(entity);
    expect(repo.items).toHaveLength(1);
    expect(repo.items[0]).toBe(entity);
  });

  test("shoul bulk insert entities", async () => {
    const entities = [
      new StubEntity({
        entity_id: new Uuid(),
        name: "Test",
        price: 100,
      }),
      new StubEntity({
        entity_id: new Uuid(),
        name: "Test",
        price: 100,
      }),
    ];
    await repo.bulkInsert(entities);
    expect(repo.items).toHaveLength(2);
    expect(repo.items[0]).toBe(entities[0]);
    expect(repo.items[1]).toBe(entities[1]);
  });

  test("should update an entity", async () => {
    const entity = new StubEntity({ name: "name", price: 100 });
    await repo.insert(entity);

    const updatedEntity = new StubEntity({
      entity_id: entity.entity_id,
      name: "new name",
      price: 200,
    });

    await repo.update(updatedEntity);

    expect(updatedEntity.toJSON()).toStrictEqual(repo.items[0].toJSON());
  });

  test("should delete an entity", async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: "Test",
      price: 100,
    });
    await repo.insert(entity);
    await repo.delete(entity.entity_id);
    expect(repo.items).toHaveLength(0);
  });
  ``;
  test("should find an entity by id", async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: "Test",
      price: 100,
    });
    await repo.insert(entity);
    const foundEntity = await repo.findById(entity.entity_id);
    expect(foundEntity).toBe(entity);
  });
});
