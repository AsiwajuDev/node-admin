import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import bcyrptjs from "bcryptjs";
import { ProfileValidation } from "../validation/profile.validation";
import { PasswordValidation } from "../validation/password.validation";

export const UpdateInfo = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const { error } = ProfileValidation.validate(body);

    if (error) {
      return res.status(400).send(error.details);
    }

    const user = req["user"];

    const repository = getManager().getRepository(User);

    await repository.update(user.id, req.body);

    const { password, ...updatedUser } = await repository.findOne(user.id);

    res.send(updatedUser);
  } catch (error) {
    return res.status(400).send({ message: "Profile Update Failed." });
  }
};

export const UpdatePassword = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const { error } = PasswordValidation.validate(body);

    if (error) {
      return res.status(400).send(error.details);
    }

    if (req.body.new_password !== req.body.new_password_confirmation) {
      return res.status(400).send({ message: "Password do not match." });
    }

    const user = req["user"];

    const isValid = await bcyrptjs.compare(req.body.password, user.password);

    if (!isValid) {
      return res.status(400).send({ message: "Invalid password." });
    }

    const repository = getManager().getRepository(User);

    await repository.update(user.id, {
      password: await bcyrptjs.hash(req.body.new_password, 10),
    });

    res.send({ message: "Password updated successfully." });
  } catch (error) {
    return res.status(400).send({ message: "Password Updated Failed." });
  }
};
