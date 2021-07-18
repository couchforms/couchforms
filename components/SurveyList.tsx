import Link from "next/link";
import Router from "next/router";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

import { DotsHorizontalIcon, TrashIcon } from "@heroicons/react/solid";
import { classNames } from "../lib/utils";

export default function SurveyList({ surveys, setSurveys }) {
  const newSurvey = async () => {
    try {
      const res = await fetch(`/api/surveys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const survey = await res.json();
      if ("id" in survey) {
        await Router.push(`/surveys/${survey.id}/build`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSurvey = async (survey, surveyIdx) => {
    try {
      await fetch(`/api/surveys/${survey.id}`, {
        method: "DELETE",
      });
      // remove locally
      const updatedSurveys = [...surveys];
      updatedSurveys.splice(surveyIdx, 1);
      setSurveys(updatedSurveys);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <button onClick={() => newSurvey()}>
        <li className="col-span-1">
          <div className="bg-pink-600 text-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-8 sm:p-10">+ New Survey</div>
          </div>
        </li>
      </button>
      {surveys
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .map((survey, surveyIdx) => (
          <li key={survey.id} className="col-span-1 ">
            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
              <Link href={`/surveys/${survey.id}/build`}>
                <a>
                  <div className="px-4 py-5 sm:p-6">{survey.title}</div>
                </a>
              </Link>
              <div className="px-4 py-1 sm:px-6 text-right">
                <Menu as="div" className="relative inline-block text-left">
                  {({ open }) => (
                    <>
                      <div>
                        <Menu.Button className="-m-2 p-2 rounded-full flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                          <span className="sr-only">Open options</span>
                          <DotsHorizontalIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>

                      <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items
                          static
                          className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() =>
                                    deleteSurvey(survey, surveyIdx)
                                  }
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "flex px-4 py-2 text-sm w-full"
                                  )}
                                >
                                  <TrashIcon
                                    className="mr-3 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  <span>Delete Survey</span>
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
}
