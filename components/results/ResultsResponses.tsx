import { useState } from "react";
import { DateTime } from "luxon";

import { getElementType } from "../../lib/elements";
import { AnswersByElementId, AnswerSession, Survey } from "../../lib/types";
import DownloadResponses from "./DownloadResponses";

export const getElementTypeIcon = (type) => {
  const elementType = getElementType(type);
  return elementType ? (
    <span
      className={classNames(
        `text-${elementType.color}-700`,
        `bg-${elementType.color}-50`,
        "rounded-lg inline-flex p-3 ring-4 ring-white"
      )}
    >
      <elementType.icon className="h-4 w-4" aria-hidden="true" />
    </span>
  ) : null;
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

type ResultsResponseProps = {
  survey: Survey;
  answerSessions: AnswerSession[];
  answersByElementId: AnswersByElementId;
};

export default function ResultsResponses({
  survey,
  answerSessions,
  answersByElementId,
}: ResultsResponseProps) {
  const [activeAnswerSession, setActiveAnswerSession] = useState(
    answerSessions.length > 0 ? answerSessions[0] : null
  );

  const getElementById = (id) => {
    return survey.elements.find((e) => e.id === id);
  };

  const getElementQuestion = (id) => {
    const element = getElementById(id);
    if ("question" in element.data) {
      return element.data.question;
    } else {
      return "";
    }
  };

  return (
    <div className="flex flex-col w-full flex-1 overflow-visible max-w-7xl mx-auto">
      <div className="flex-1 relative z-0 flex overflow-visible">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
          <div className="bg-white overflow-visible shadow sm:rounded-lg">
            {activeAnswerSession && (
              <div className="px-4 py-5 sm:p-12">
                <div className="flow-root">
                  <h1 className="text-gray-700 mb-8">
                    {DateTime.fromISO(
                      activeAnswerSession.createdAt.toISOString()
                    ).toLocaleString(DateTime.DATETIME_MED)}
                  </h1>
                  <ul className="-mb-8">
                    {activeAnswerSession.answers.map((answer, answerIdx) => (
                      <li key={answer.createdAt.toISOString()}>
                        <div className="relative pb-8">
                          {answerIdx !==
                          activeAnswerSession.answers.length - 1 ? (
                            <span
                              className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex items-start space-x-3">
                            <div className="relative">
                              {getElementTypeIcon(
                                getElementById(answer.elementId).type
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div>
                                <div className="text-sm">
                                  <a
                                    href="#"
                                    className="font-medium text-gray-900"
                                  >
                                    {getElementQuestion(answer.elementId)}
                                  </a>
                                </div>
                                {/* <p className="mt-0.5 text-sm text-gray-500">
                                Commented Date
                              </p> */}
                              </div>
                              <div className="mt-2 text-sm text-gray-700">
                                <p>
                                  {typeof answer.data.value === "string"
                                    ? answer.data.value
                                    : Array.isArray(answer.data.value)
                                    ? answer.data.value.join(", ")
                                    : null}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </main>
        <aside className="hidden xl:order-first xl:flex xl:flex-col flex-shrink-0 w-96 border-r border-gray-200">
          <div className="pt-6 pb-1">
            <h2 className="text-lg font-medium text-gray-900">Responses</h2>
            <DownloadResponses
              survey={survey}
              answerSessions={answerSessions}
            />
          </div>
          {/* Directory list */}
          <nav
            className="flex-1 min-h-0 overflow-y-auto"
            aria-label="Directory"
          >
            <div className="relative">
              <ul className="relative z-0 divide-y divide-gray-200">
                {answerSessions.map((answerSession) => (
                  <li key={answerSession.id}>
                    <div className="relative px-6 py-5 flex items-center space-x-3 hover:bg-gray-100 focus-within:bg-gray-100">
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => setActiveAnswerSession(answerSession)}
                          className="focus:outline-none w-full text-left"
                        >
                          {/* Extend touch target to entire panel */}
                          <span
                            className="absolute inset-0"
                            aria-hidden="true"
                          />
                          <p className="text-sm font-medium text-gray-900">
                            {DateTime.fromISO(
                              answerSession.createdAt.toISOString()
                            ).toLocaleString(DateTime.DATETIME_MED)}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {answerSession.answers.length} answers
                          </p>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </aside>
      </div>
    </div>
  );
}
