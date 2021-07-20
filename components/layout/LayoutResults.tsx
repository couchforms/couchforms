import Head from "next/head";
import MenuBreadcrumbs from "./MenuBreadcrumbs";
import MenuSteps from "./MenuSteps";
import MenuProfile from "./MenuProfile";
import { classNames } from "../../lib/utils";
import { signIn, useSession } from "next-auth/client";
import Loading from "../Loading";

export default function LayoutShare({
  title,
  survey,
  resultMode,
  setResultMode,
  children,
}) {
  const [session, loading] = useSession();

  if (loading) {
    return <Loading />;
  }

  if (!session) {
    signIn();
    return <div>You need to be authenticated to view this page.</div>;
  }

  const resultModes = [
    { name: "Summary", id: "summary" },
    { name: "Responses", id: "responses" },
  ];
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="bg-gray-50 flex overflow-hidden h-screen">
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="w-full">
            <div className="relative z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 flex">
              <div className="flex-1 flex px-4 sm:px-6">
                <MenuBreadcrumbs survey={survey} />
                <MenuSteps survey={survey} currentStep="results" />
                <div className="flex flex-1 items-center justify-end text-right space-x-2 sm:space-x-4">
                  {/* Profile dropdown */}
                  <MenuProfile />
                </div>
              </div>
            </div>
            <div className="relative z-10 flex-shrink-0 h-16 bg-gray-50 border-b border-gray-200 flex">
              <div className="flex-1 flex px-4 items-center justify-center">
                <nav className="flex space-x-4" aria-label="resultModes">
                  {resultModes.map((mode) => (
                    <button
                      key={mode.name}
                      onClick={() => setResultMode(mode.id)}
                      className={classNames(
                        mode.id === resultMode
                          ? "bg-gray-200 text-gray-800"
                          : "text-gray-600 hover:text-gray-800",
                        "px-3 py-2 font-medium text-sm rounded-md"
                      )}
                      aria-current={mode.id === resultMode ? "page" : undefined}
                    >
                      {mode.name}
                    </button>
                  ))}
                </nav>
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
