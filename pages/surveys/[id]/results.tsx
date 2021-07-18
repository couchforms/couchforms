import { useState } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import LayoutResults from "../../../components/layout/LayoutResults";
import prisma from "../../../lib/prisma";
import ResultsSummary from "../../../components/results/ResultsSummary";
import ResultsResponses from "../../../components/results/ResultsResponses";
import { AnswersByElementId, AnswerSession, Survey } from "../../../lib/types";

type ResultsProps = {
  surveyData: Survey;
  answerSessions: AnswerSession[];
  answersByElementId: AnswersByElementId;
};

export default function Results({
  surveyData,
  answerSessions,
  answersByElementId,
}: ResultsProps) {
  const [survey, setSurvey] = useState(surveyData);
  const [resultMode, setResultMode] = useState<"summary" | "responses">(
    "summary"
  );
  return (
    <>
      <LayoutResults
        title={survey && survey.title}
        survey={survey}
        resultMode={resultMode}
        setResultMode={setResultMode}
      >
        {resultMode === "summary" && (
          <ResultsSummary
            survey={survey}
            answerSessions={answerSessions}
            answersByElementId={answersByElementId}
          />
        )}
        {resultMode === "responses" && (
          <ResultsResponses
            survey={survey}
            answerSessions={answerSessions}
            answersByElementId={answersByElementId}
          />
        )}
      </LayoutResults>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { surveyData: null } };
  }

  const surveyData: any = await prisma.survey.findUnique({
    where: {
      id: query.id.toString(),
    },
    include: {
      answerSessions: {
        include: {
          answers: true,
        },
      },
    },
  });
  // remove answers to non-existing questions and empty sessions
  // build answersByElementId
  const elementIds = surveyData.elements.map((e) => e.id);
  let filteredSessions: AnswerSession[] = [];
  const answersByElementId: AnswersByElementId = {};
  for (let answerSession of surveyData.answerSessions) {
    const filteredSession = {
      ...answerSession,
      answers: [],
    };
    for (let answer of answerSession.answers) {
      if (elementIds.includes(answer.elementId)) {
        filteredSession.answers.push(answer);
        if (!answersByElementId.hasOwnProperty(answer.elementId))
          answersByElementId[answer.elementId] = [];
        answersByElementId[answer.elementId].push(answer);
      }
    }
    if (filteredSession.answers.length > 0) {
      filteredSessions.push(filteredSession);
    }
  }
  filteredSessions = filteredSessions.sort((a, b) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    } else if (a === b) {
      return 0;
    } else {
      return -1;
    }
  });
  delete surveyData.answerSessions;
  return {
    props: {
      surveyData: surveyData,
      answerSessions: filteredSessions,
      answersByElementId,
    },
  };
};
