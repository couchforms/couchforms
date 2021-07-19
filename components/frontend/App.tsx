import { useState, useEffect } from "react";
import ElementCard from "../../components/frontend/ElementCard";
import { v4 as uuidv4 } from "uuid";

export default function App({
  surveyData,
  currentElementIdx,
  setCurrentElementIdx,
  submitAnswer,
  useDraft = false,
}) {
  const finalizeSurvey = (surveyData) => {
    const survey = { ...surveyData };
    if (useDraft) {
      survey.elements = survey.elementsDraft;
    }
    const elementsLength = survey.elements.length;
    if (
      elementsLength > 0 &&
      survey.elements[elementsLength - 1].type !== "instructions"
    ) {
      survey.elements.push({
        id: uuidv4(),
        type: "instructions",
        data: {
          title: "Thanks for participating",
          description: "Your answers help us a lot.",
          body: "Thank you for taking the time to answer this survey!",
        },
      });
    }
    return survey;
  };

  const [survey, setSurvey] = useState(finalizeSurvey(surveyData));
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentElementIdx !== null && survey !== null) {
      let numElements = survey.elements.length;
      if (numElements > 0) {
        setProgress(currentElementIdx / (numElements - 1));
      }
    }
  }, [currentElementIdx]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl md:max-w-2xl">
        <ElementCard
          element={survey.elements[currentElementIdx]}
          colorPrimary={survey.colorPrimary}
          onSubmit={submitAnswer}
          finalElement={currentElementIdx === survey.elements.length - 1}
          progress={progress}
        />
      </div>
    </div>
  );
}
