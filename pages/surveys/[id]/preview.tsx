import { useState } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import App from "../../../components/frontend/App";
import LayoutPreview from "../../../components/layout/LayoutPreview";
import prisma from "../../../lib/prisma";

export default function Share({ surveyData }) {
  const [currentElementIdx, setCurrentElementIdx] = useState(0);
  return (
    <LayoutPreview
      title={surveyData.title}
      survey={surveyData}
      setCurrentElementIdx={setCurrentElementIdx}
    >
      <App
        surveyData={surveyData}
        currentElementIdx={currentElementIdx}
        setCurrentElementIdx={setCurrentElementIdx}
        submitAnswer={() => {
          setCurrentElementIdx(currentElementIdx + 1);
        }}
        useDraft={true}
      />
    </LayoutPreview>
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

  const surveyData = await prisma.survey.findUnique({
    where: {
      id: query.id.toString(),
    },
  });
  return {
    props: { surveyData },
  };
};
