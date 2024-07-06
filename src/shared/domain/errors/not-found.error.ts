import { Entity } from "../value-objects/entity";

export class NotFoundError extends Error {
  constructor(id: any[] | any, entityClass: new (...args: any[]) => Entity) {
    const idMessage = Array.isArray(id) ? id.join(", ") : id;
    super(`${entityClass.name} with id ${idMessage} not found`);
    this.name = "NotFoundError";
  }
}
