// export type FieldsErrors = {
//   [field: string]: string[];
// };

import { Notification } from "./notification";

// export interface IValidatorFields<PropsValidated> {
//   errors: FieldsErrors | null;
//   validatedData: PropsValidated | null;
//   validate(data: any): boolean;
// }

export type FieldsError =
  | {
      [field: string]: string[];
    }
  | string;

export interface IValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean;
}
