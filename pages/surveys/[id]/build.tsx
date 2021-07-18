import { useState, useEffect } from "react";
import { resetServerContext } from "react-beautiful-dnd";
import ElementCard from "../../../components/frontend/ElementCard";
import ManageElements from "../../../components/build/ManageElements";
import ManageLayout from "../../../components/build/ManageLayout";
import SurveyOnboardingModal from "../../../components/build/SurveyOnboardingModal";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../../lib/prisma";
import { Survey } from "../../../lib/types";
import LayoutBuild from "../../../components/layout/LayoutBuild";
import SidebarTabs from "../../../components/build/SidebarTabs";

const sidebarTabs = [
  { name: "Elements", id: "elements" },
  { name: "Layout", id: "layout" },
];

type BuildSurveyProps = {
  surveyData: Survey;
};

export default function BuildSurvey({ surveyData }: BuildSurveyProps) {
  const [survey, setSurvey] = useState<Survey>(surveyData);
  const [activeElementId, setActiveElementId] = useState<string>(
    surveyData && surveyData.elementsDraft.length > 0
      ? surveyData.elementsDraft[0].id
      : null
  );
  const [openInitialModal, setOpenInitialModal] = useState(true);
  const [sidebarMode, setSidebarMode] = useState(sidebarTabs[0].id);

  const persistSurvey = async (survey) => {
    try {
      const res = await fetch(`/api/surveys/${survey.id}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(survey),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getActiveElementCard = () => {
    if (activeElementId === null) return null;
    const elementsDraft = [...survey.elementsDraft];
    const elementIdx = elementsDraft.findIndex((e) => e.id === activeElementId);
    if (typeof elementIdx === "undefined") return null;
    return (
      <ElementCard
        element={elementsDraft[elementIdx]}
        colorPrimary={survey.colorPrimary}
        onSubmit={() => {}}
        finalElement={
          elementsDraft[elementsDraft.length - 1].id === activeElementId
        }
      />
    );
  };
  return (
    <LayoutBuild
      title={survey && survey.title}
      survey={survey}
      setSurvey={setSurvey}
    >
      <div className="flex-1 flex items-stretch overflow-hidden">
        <main className="w-full md:w-6/12 bg-gray-100 border-r border-gray-200 overflow-y-auto lg:w-4/12">
          <h1 id="primary-heading" className="sr-only">
            Manage Questions
          </h1>
          <SidebarTabs
            tabs={sidebarTabs}
            state={sidebarMode}
            setState={setSidebarMode}
          />
          {sidebarMode === "elements" && (
            <ManageElements
              survey={survey}
              setSurvey={setSurvey}
              persistSurvey={persistSurvey}
              activeElementId={activeElementId}
              setActiveElementId={setActiveElementId}
            />
          )}
          {sidebarMode === "layout" && (
            <ManageLayout
              survey={survey}
              setSurvey={setSurvey}
              persistSurvey={persistSurvey}
            />
          )}
        </main>
        <aside className="flex-1 hidden md:block overflow-y-auto">
          {/* Primary column */}
          <section
            aria-labelledby="primary-heading"
            className="min-w-0 flex-1 h-full overflow-hidden lg:order-last bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8 shadow-inner"
          >
            <h1 id="primary-heading" className="sr-only">
              Preview
            </h1>
            <div className="sm:mx-auto sm:w-full sm:max-w-xl md:max-w-2xl">
              {getActiveElementCard()}
            </div>
          </section>
        </aside>
      </div>
      {survey && !survey.finishedOnboarding && (
        <SurveyOnboardingModal
          open={openInitialModal}
          setOpen={setOpenInitialModal}
          survey={survey}
          setSurvey={setSurvey}
          persistSurvey={persistSurvey}
        />
      )}
    </LayoutBuild>
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

  resetServerContext();
  const surveyData = await prisma.survey.findUnique({
    where: {
      id: query.id.toString(),
    },
  });
  return {
    props: { surveyData },
  };
};
