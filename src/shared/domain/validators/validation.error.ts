import { FieldsErrors } from "./validators-fields-interface";

export class EntityValidationError extends Error {
  constructor(
    public errors: FieldsErrors,
    message: string = "Validation Error"
  ) {
    super(message);
  }

  count() {
    return Object.keys(this.errors).length;
  }
}
