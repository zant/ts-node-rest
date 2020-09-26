import { ValidationError } from "yup";
import { FormattedError } from "../types";

export const formatYupError = (err: ValidationError): FormattedError[] => {
  const errors: FormattedError[] = [];

  err.inner.forEach((e) => {
    errors.push({
      path: e.path,
      message: e.message,
    });
  });
  return errors;
};
