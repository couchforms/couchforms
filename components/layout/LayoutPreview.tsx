import Head from "next/head";
import Link from "next/link";

import { ArrowLeftIcon, RefreshIcon } from "@heroicons/react/outline";
import { useSession, signIn } from "next-auth/client";
import Loading from "../Loading";

export default function LayoutShare({
  title,
  survey,
  setCurrentElementIdx,
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
                <div className="flex flex-1 items-center">
                  <Link href={`/surveys/${survey.id}/build`}>
                    <a>
                      <ArrowLeftIcon className="h-6 w-6" aria-hidden="true" />
                    </a>
                  </Link>
                </div>
                <p className="flex flex-1 items-center justify-center text-gray-600">
                  Preview
                </p>
                <div className="flex flex-1 items-center justify-end text-right space-x-2 sm:ml-6 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentElementIdx(0)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    Restart
                    <RefreshIcon
                      className="ml-2 -mr-1 h-5 w-5"
                      aria-hidden="true"
                    />
                  </button>
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
