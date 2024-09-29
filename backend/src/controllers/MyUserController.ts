import { Request, Response } from "express";
import { jwtCheck } from "../middleware/auth";
import bcrypt from "bcryptjs";
import User from "../models/user";

const createUser = async (req: Request, res: Response) => {
  try {
    let user = await User.findOne({
      where: { email: req.body.email },
    });
    if (user) {
      return res.status(404).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    user = await User.create({
      id: req.body.id,
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    jwtCheck(user.id, res);

    return res.status(200).send({ message: "User registered OK" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    jwtCheck(user.id, res);
    res.status(200).json({ userId: user.id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default {
  createUser,
  userLogin,
};
