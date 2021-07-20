import Link from "next/link";
import { useRouter } from "next/router";
import { Survey } from "../../lib/types";
import { classNames } from "../../lib/utils";

type MenuStepsProps = {
  survey: Survey;
  currentStep: "build" | "share" | "results";
};

export default function MenuSteps({ survey, currentStep }: MenuStepsProps) {
  const router = useRouter();
  const tabs = [
    {
      name: "Build",
      id: "build",
      href: `/surveys/${survey.id}/build`,
    },
    {
      name: "Share",
      id: "share",
      href: `/surveys/${survey.id}/share`,
    },
    {
      name: "Results",
      id: "results",
      href: `/surveys/${survey.id}/results`,
    },
  ];
  return (
    <div className="flex-1 flex items-center justify-left sm:justify-center">
      <div className="sm:hidden w-full">
        <label htmlFor="tabs" className="sr-only">
          Select a view
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
          defaultValue={tabs.find((tab) => tab.id === currentStep).name}
          onChange={(e) => {
            const stepId = e.target.children[e.target.selectedIndex].id;
            router.push(`/surveys/${survey.id}/${stepId}`);
          }}
        >
          {tabs.map((tab) => (
            <option key={tab.name} id={tab.id}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <Link key={tab.name} href={tab.href}>
              <a
                className={classNames(
                  tab.id === currentStep
                    ? "border-pink-500 text-pink-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                  "whitespace-nowrap py-5 px-1 border-b-2 font-medium text-sm"
                )}
                aria-current={tab.id === currentStep ? "page" : undefined}
              >
                {tab.name}
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
