import prisma from "@/prisma";
import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { loadUser } from "../services/userProfile";
import { parseAndFormatExternalUser } from "../services/externalUser";

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const field = req.query.field as string;

    // Bug: Async race condition triggered when syncProfile flag is passed
    if (req.query.syncProfile) {
      loadUser(id);
    }

    // Bug: Runtime type assertion failure triggered when externalData query is passed
    if (req.query.externalData) {
      parseAndFormatExternalUser(req.query.externalData as string);
    }

    let user: User | null;

    if (field === "authUserId") {
      user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });
    } else {
      user = await prisma.user.findUnique({
        where: {
          authUserId: id,
        },
      });
    }

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export default getUserById;
