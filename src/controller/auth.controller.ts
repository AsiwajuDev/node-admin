import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import { RegisterValidation } from "../validation/register.validation";
import bcyrptjs from "bcryptjs";
import { sign } from "jsonwebtoken";
import { LoginValidation } from "../validation/login.validation";

export const Register = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const { error } = RegisterValidation.validate(body);

    if (error) {
      return res.status(400).send(error.details);
    }

    if (body.password !== body.password_confirmation) {
      return res.status(400).send({ message: "Password do not match." });
    }

    const repository = getManager().getRepository(User);

    const exist = await repository.findOne({
      where: { email: body.email },
    });

    if (exist) {
      return res.status(400).send({ message: "Email already exist." });
    }

    const { password, ...user } = await repository.save({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: await bcyrptjs.hash(body.password, 10),
    });

    res.send(user);
  } catch (error) {
    return res.status(400).send({ message: "Something went wrong." });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const { error } = LoginValidation.validate(body);

    if (error) {
      return res.status(400).send(error.details);
    }

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

    const token = sign({ id: user.id }, process.env.SECRET_KEY);

    res.cookie("jwt", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    res.send({
      message: "Logged in successfully.",
    });
  } catch (error) {
    return res.status(400).send({ message: "Invalid credentials." });
  }
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
  const { password, ...user } = req["user"];
  res.send(user);
};

export const Logout = (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 0 });

  res.send({ message: "Logged out successfully." });
};
