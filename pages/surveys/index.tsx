import LayoutBasic from "../../components/layout/LayoutBasic";
import SurveyList from "../../components/SurveyList";
import prisma from "../../lib/prisma";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { useState } from "react";
import Head from "next/head";
import { Survey } from "../../lib/types";

type SurveysProps = {
  surveysData: Survey[];
};

export default function Surveys({ surveysData }: SurveysProps) {
  const [surveys, setSurveys] = useState(surveysData);
  surveysData.map((f) => f.toString());
  return (
    <>
      <Head>
        <title>Your surveys - couchsurvey</title>
      </Head>
      <LayoutBasic>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <SurveyList surveys={surveys} setSurveys={setSurveys} />
          </div>
        </div>
      </LayoutBasic>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { surveysData: [] } };
  }

  const surveysData = await prisma.survey.findMany({
    where: {
      owner: { email: session.user.email },
    },
    include: {
      owner: {
        select: { name: true },
      },
    },
  });
  return {
    props: { surveysData },
  };
};
