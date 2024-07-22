import { InvalidUuidError, Uuid } from "../uuid.vo";

describe("Uuid Unit Tests", () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, "validate");
  test("Should generate a valid Uuid", () => {
    const uuid = new Uuid();
    expect(uuid.id).toBeTruthy();
    expect(validateSpy).toHaveBeenCalled();
  });

  test("Should create a Uuid with a given id", () => {
    const uuid = new Uuid("123e4567-e89b-12d3-a456-426614174000");
    expect(uuid.id).toBe("123e4567-e89b-12d3-a456-426614174000");
    expect(validateSpy).toHaveBeenCalled();
  });

  test("Should throw an error if the id is invalid", () => {
    expect(() => new Uuid("invalid-uuid")).toThrow(InvalidUuidError);
    expect(validateSpy).toHaveBeenCalled();
  });
});
