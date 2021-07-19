import { classNames } from "../../lib/utils";

export default function SidebarTabs({ tabs, state, setState }) {
  return (
    <div className="">
      <nav
        className="relative z-0 shadow flex divide-x divide-gray-200"
        aria-label="Tabs"
      >
        {tabs.map((tab, tabIdx) => (
          <button
            key={tab.name}
            onClick={() => setState(tab.id)}
            className={classNames(
              state === tab.id
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700",
              "group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10 focus:outline-none"
            )}
            aria-current={state === tab.id ? "page" : undefined}
          >
            <span>{tab.name}</span>
            <span
              aria-hidden="true"
              className={classNames(
                state === tab.id ? "bg-pink-500" : "bg-transparent",
                "absolute inset-x-0 bottom-0 h-0.5"
              )}
            />
          </button>
        ))}
      </nav>
    </div>
  );
}
