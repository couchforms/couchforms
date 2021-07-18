import { useState } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import LayoutShare from "../../../components/layout/LayoutShare";
import prisma from "../../../lib/prisma";
import { InformationCircleIcon } from "@heroicons/react/solid";
import { Survey } from "../../../lib/types";

type ShareProps = {
  surveyData: Survey;
};

export default function Share({ surveyData }: ShareProps) {
  const [survey, setSurvey] = useState(surveyData);

  const getPublicSurveyUrl = () => {
    if (process.browser) {
      return `${window.location.protocol}//${window.location.host}/s/${survey.id}/`;
    }
  };

  return (
    <>
      <LayoutShare title={survey.title} survey={survey}>
        {!survey.published && (
          <div className="rounded-md bg-pink-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon
                  className="h-5 w-5 text-pink-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-pink-700">
                  Your survey isn't published yet. Publish your survey in the
                  build step to share it with your participants.
                </p>
              </div>
            </div>
          </div>
        )}
        {survey.published &&
          JSON.stringify(survey.elementsDraft) !==
            JSON.stringify(survey.elements) && (
            <div className="rounded-md bg-pink-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InformationCircleIcon
                    className="h-5 w-5 text-pink-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-pink-700">
                    You have unpublished changes in your survey. Go back to the
                    build-step and publish your latest changes!
                  </p>
                </div>
              </div>
            </div>
          )}

        {survey.published && (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Share your survey
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Let your participants fill out your survey by accessing it via
                  the public link.
                </p>
              </div>
              <div className="mt-5 sm:flex sm:items-center">
                <div className="w-full sm:max-w-xs">
                  <label htmlFor="surveyLink" className="sr-only">
                    Public link
                  </label>
                  <input
                    id="surveyLink"
                    type="text"
                    placeholder="Enter your email"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={getPublicSurveyUrl()}
                    disabled
                  />
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getPublicSurveyUrl());
                  }}
                  className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}
      </LayoutShare>
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

  const surveyData = await prisma.survey.findUnique({
    where: {
      id: query.id.toString(),
    },
  });
  return {
    props: { surveyData },
  };
};
