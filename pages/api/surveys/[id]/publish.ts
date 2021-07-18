import type { NextApiResponse, NextApiRequest } from "next";
import prisma from "../../../../lib/prisma";
import { hasOwnership } from "../../../../lib/apiHelpers";
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

  const surveyId = req.query.id.toString();

  // POST /api/surveys/:id/publish
  // Publishes an existing survey
  // Required fields in body: -
  // Optional fields in body: -
  if (req.method === "POST") {
    if (!hasOwnership(session, surveyId)) {
      return res
        .status(401)
        .json({ message: "You are not authorized to change this survey" });
    }
    const currentSurvey = await prisma.survey.findUnique({
      where: { id: surveyId },
    });
    const prismaRes = await prisma.survey.update({
      where: { id: surveyId },
      data: { published: true, elements: currentSurvey.elementsDraft },
    });
    res.json(prismaRes);
  }

  // Unknown HTTP Method
  else {
    throw new Error(
      `The HTTP ${req.method} method is not supported by this route.`
    );
  }
}
