import { Joi } from "express-validation";

export const PasswordValidation = Joi.object({
  password: Joi.string().required(),
  new_password: Joi.string().required(),
  new_password_confirmation: Joi.string().required(),
});
