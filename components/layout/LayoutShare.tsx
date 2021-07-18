import Head from "next/head";
import MenuBreadcrumbs from "./MenuBreadcrumbs";
import MenuSteps from "./MenuSteps";
import MenuProfile from "./MenuProfile";
import { signIn, useSession } from "next-auth/client";
import Loading from "../Loading";

export default function LayoutShare({ title, survey, children }) {
  const [session, loading] = useSession();

  if (loading) {
    return <Loading />;
  }

  if (!session) {
    signIn();
    return <div>You need to be authenticated to view this page.</div>;
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="w-full">
            <div className="relative z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm flex">
              <div className="flex-1 flex px-4 sm:px-6">
                <MenuBreadcrumbs survey={survey} />
                <MenuSteps survey={survey} currentStep="share" />
                <div className="flex flex-1 items-center justify-end text-right space-x-2 sm:ml-6 sm:space-x-4">
                  {/* Profile dropdown */}
                  <MenuProfile />
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="max-w-lg mx-auto pt-10 pb-12 px-4 lg:pb-16">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
