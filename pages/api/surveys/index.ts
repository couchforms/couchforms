import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check Authentication
  const session = await getSession({ req: req });
  if (!session) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // POST /api/surveys
  // Creates a new survey
  // Required fields in body: -
  // Optional fields in body: title, elements, elementsDraft
  if (req.method === "POST") {
    const { title, elements, elementsDraft } = req.body;

    const session = await getSession({ req });
    // get unique alphanumeric ID
    let validId = false;
    let id;
    while (!validId) {
      id = generateId(8);
      validId = await checkIdAvailability(id);
    }
    // create survey in database
    const result = await prisma.survey.create({
      data: {
        id,
        title: title || "my survey",
        elements: elements || [],
        elementsDraft: elementsDraft || [],
        owner: { connect: { email: session?.user?.email } },
      },
    });
    res.json(result);
  }

  // Unknown HTTP Method
  else {
    throw new Error(
      `The HTTP ${req.method} method is not supported by this route.`
    );
  }
}

const generateId = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const checkIdAvailability = async (id) => {
  const survey = await prisma.survey.findUnique({
    where: { id },
  });
  if (survey === null) {
    return true;
  } else {
    return false;
  }
};
