import { Joi } from "express-validation";

export const RegisterValidation = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  password_confirmation: Joi.string().required(),
});
