import prisma from "./prisma";

export const hasOwnership = async (session, surveyId) => {
  try {
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        owner: {
          select: { email: true },
        },
      },
    });
    if (survey.owner.email === session.user.email) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(`can't verify ownership: ${e}`);
    return false;
  }
};
