import { NotFoundError } from "../../../domain/errors/not-found.error";
import {
  IRepository,
  ISearchableRepository,
} from "../../../domain/repository/repository-interface";
import { SearchParams } from "../../../domain/repository/search-params";
import { SearchResult } from "../../../domain/repository/search-result";
import { ValueObject } from "../../../domain/value-object";
import { Entity } from "../../../domain/value-objects/entity";
export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject
> implements IRepository<E, EntityId>
{
  items: E[] = [];
  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }
  async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities);
  }
  async update(entity: E): Promise<void> {
    const indexFound = this.items.findIndex((item) =>
      item.entity_id.equals(entity.entity_id)
    );
    if (indexFound === -1) {
      throw new NotFoundError(entity.entity_id, this.getEntity());
    }
    this.items[indexFound] = entity;
  }
  async delete(entity_id: EntityId): Promise<void> {
    const indexFound = this.items.findIndex((item) =>
      item.entity_id.equals(entity_id)
    );

    if (indexFound === -1) {
      throw new NotFoundError(entity_id, this.getEntity());
    }

    this.items.splice(indexFound, 1);
  }
  async findById(entity_id: EntityId): Promise<E> {
    const item = this.items.find((item) => item.entity_id.equals(entity_id));
    return typeof item === "undefined" ? null : item;
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }
  abstract getEntity(): new (...args: any[]) => E;
}

export abstract class InMemorySearchableRepository<
    E extends Entity,
    EntityId extends ValueObject,
    Filter = string
  >
  extends InMemoryRepository<E, EntityId>
  implements ISearchableRepository<E, EntityId, Filter>
{
  sortableFields: string[] = [];
  search(props: SearchParams<Filter>): Promise<SearchResult<Entity>> {
    throw new Error("Method not implemented.");
  }
}
