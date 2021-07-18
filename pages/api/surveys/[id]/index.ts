import type { NextApiResponse, NextApiRequest } from "next";
import { getSession } from "next-auth/client";
import { hasOwnership } from "../../../../lib/apiHelpers";
import prisma from "../../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check Authentication
  const session = await getSession({ req: req });
  if (!session) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const surveyId = req.query.id.toString();

  // POST /api/surveys/:id
  // Updates an existing survey
  // Required fields in body: -
  // Optional fields in body: title, published, finishedOnboarding, elements, elementsDraft
  if (req.method === "POST") {
    const ownership = await hasOwnership(session, surveyId);
    if (!ownership) {
      return res
        .status(401)
        .json({ message: "You are not authorized to change this survey" });
    }
    const data = { ...req.body, updatedAt: new Date() };
    const prismaRes = await prisma.survey.update({
      where: { id: surveyId },
      data,
    });
    return res.json(prismaRes);
  } else if (req.method === "DELETE") {
    const ownership = await hasOwnership(session, surveyId);
    if (!ownership) {
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this survey" });
    }
    const prismaRes = await prisma.survey.delete({
      where: { id: surveyId },
    });
    return res.json(prismaRes);
  }
  // Unknown HTTP Method
  else {
    throw new Error(
      `The HTTP ${req.method} method is not supported by this route.`
    );
  }
}
