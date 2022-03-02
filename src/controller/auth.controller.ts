import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import { RegisterValidation } from "../validation/register.validation";
import bcyrptjs from "bcryptjs";
import { sign } from "jsonwebtoken";

export const Register = async (req: Request, res: Response) => {
  const body = req.body;

  const { error } = RegisterValidation.validate(body);

  if (error) {
    return res.status(400).send(error.details);
  }

  if (body.password !== body.password_confirmation) {
    return res.status(400).send({ message: "Password do not match." });
  }

  const repository = getManager().getRepository(User);

  const { password, ...user } = await repository.save({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password: await bcyrptjs.hash(body.password, 10),
  });

  res.send(user);
};

export const Login = async (req: Request, res: Response) => {
  const body = req.body;

  const repository = getManager().getRepository(User);

  const user = await repository.findOne({
    where: { email: body.email },
  });

  if (!user) {
    return res.status(404).send({ message: "User not found." });
  }

  const isValid = await bcyrptjs.compare(body.password, user.password);

  if (!isValid) {
    return res.status(400).send({ message: "Invalid password." });
  }

  const token = sign({ id: user.id }, "secret");

  res.cookie("jwt", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

  const { password, ...userData } = user;

  res.send({
    message: "Logged in successfully.",
  });
};
