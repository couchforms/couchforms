import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import App from "../../components/frontend/App";
import prisma from "../../lib/prisma";
import Head from "next/head";

export default function ShowSurvey({ surveyData }) {
  const [currentElementIdx, setCurrentElementIdx] = useState(0);
  const [answerSessionId, setAnswerSessionId] = useState(null);

  const submitAnswer = async (
    elementId,
    answerData,
    skipSaveAnswer = false
  ) => {
    try {
      if (!skipSaveAnswer) {
        let sessionId = answerSessionId;
        // create session if needed
        if (sessionId === null) {
          const res = await fetch(
            `/api/surveys/${surveyData.id}/answerSessions`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({}),
            }
          );
          const answerSession = await res.json();
          sessionId = answerSession.id;
          setAnswerSessionId(answerSession.id);
        }
        // submit answer
        const res = await fetch(
          `/api/surveys/${surveyData.id}/answerSessions/${sessionId}/answers`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ elementId, data: answerData }),
          }
        );
      }
      // go to next question
      setCurrentElementIdx(currentElementIdx + 1);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Head>
        <title>Couchsurvey</title>
      </Head>
      <App
        surveyData={surveyData}
        currentElementIdx={currentElementIdx}
        setCurrentElementIdx={setCurrentElementIdx}
        submitAnswer={submitAnswer}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const surveyData = await prisma.survey.findUnique({
    where: {
      id: query.id.toString(),
    },
  });
  return {
    props: { surveyData },
  };
};
