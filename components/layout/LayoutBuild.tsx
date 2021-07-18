import { Fragment } from "react";
import Head from "next/head";
import Link from "next/link";
import { EyeIcon } from "@heroicons/react/solid";
import { Popover, Transition } from "@headlessui/react";
import MenuBreadcrumbs from "./MenuBreadcrumbs";
import MenuSteps from "./MenuSteps";
import MenuProfile from "./MenuProfile";
import { useSession, signIn } from "next-auth/client";
import Loading from "../Loading";

export default function LayoutBuild({ title, survey, setSurvey, children }) {
  const [session, loading] = useSession();

  if (loading) {
    return <Loading />;
  }

  if (!session) {
    signIn();
    return <div>You need to be authenticated to view this page.</div>;
  }

  const publishSurvey = async () => {
    console.log("publish");
    try {
      const res = await fetch(`/api/surveys/${survey.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const newSurvey = await res.json();
      setSurvey(newSurvey);
    } catch (error) {
      console.error(error);
    }
  };

  const getPublicSurveyUrl = () => {
    if (process.browser) {
      return `${window.location.protocol}//${window.location.host}/s/${survey.id}/`;
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        {/* Content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="w-full">
            <div className="relative z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm flex">
              <div className="flex-1 flex px-4 sm:px-6">
                <MenuBreadcrumbs survey={survey} />
                <MenuSteps survey={survey} currentStep="build" />
                <div className="ml-2 flex flex-1 items-center justify-end space-x-2 sm:ml-6 sm:space-x-4">
                  <span className="hidden lg:inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-pink-100 text-pink-700">
                    <svg
                      className="-ml-0.5 mr-1.5 h-2 w-2 text-pink-400"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                    saves automatically
                  </span>

                  <Link href={`/surveys/${survey.id}/preview`}>
                    <a className="flex bg-gray-400 p-2 rounded-lg items-center justify-center text-white hover:bg-gray-500 focus:outline-none">
                      <EyeIcon className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Preview</span>
                    </a>
                  </Link>
                  <Popover className="relative">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`
                ${open ? "" : "text-opacity-90"}
                flex bg-pink-600 px-3 py-2 rounded-lg items-center justify-center text-white text-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50`}
                          disabled={
                            JSON.stringify(survey.elements) ===
                            JSON.stringify(survey.elementsDraft)
                          }
                        >
                          <button onClick={() => publishSurvey()}>
                            Publish
                          </button>
                        </Popover.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-400"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 transform -translate-x-80 left-3/4 sm:px-0 lg:max-w-">
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                              <div className="bg-white p-7 text-sm text-gray-700">
                                Your survey is now open to the world. Share the
                                following link to let your participants access
                                the survey.
                                <br />
                                Publish again if you want new changes to be
                                live!
                              </div>
                              <div className="p-4 bg-gray-50">
                                <div className="sm:flex">
                                  <div className="min-w-0 flex-1">
                                    <label
                                      htmlFor="surveyLink"
                                      className="sr-only"
                                    >
                                      Public link
                                    </label>
                                    <input
                                      id="surveyLink"
                                      type="text"
                                      placeholder="Enter your email"
                                      className="block w-full px-4 py-3 rounded-md border-0 text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900"
                                      value={getPublicSurveyUrl()}
                                      disabled
                                    />
                                  </div>
                                  <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <button
                                      type="submit"
                                      className="block w-full py-3 px-4 rounded-md shadow bg-gray-800 text-white text-sm font-medium hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900"
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          getPublicSurveyUrl()
                                        );
                                      }}
                                    >
                                      Copy
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                  <div className="h-full border-l border-gray-200"></div>
                  {/* Profile dropdown */}
                  <MenuProfile />
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          {children}
        </div>
      </div>
    </>
  );
}
