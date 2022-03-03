import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";

export const UpdateInfo = async (req: Request, res: Response) => {
  try {
    const user = req["user"];

    const repository = getManager().getRepository(User);

    await repository.update(user.id, req.body);

    const { password, ...updatedUser } = await repository.findOne(user.id);

    res.send(updatedUser);
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong." });
  }
};
