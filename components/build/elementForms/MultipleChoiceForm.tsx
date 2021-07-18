import { useState } from "react";
import { Switch } from "@headlessui/react";
import { classNames } from "../../../lib/utils";

export default function OpenForm({
  element,
  setElement,
  survey,
  persistSurvey,
}) {
  const [enabled, setEnabled] = useState(false);

  const setElementDataAttribute = (key, value, persist = false) => {
    const updatedElement = { ...element };
    updatedElement.data[key] = value;
    setElement(updatedElement, persist);
  };

  const getOption = (optionIdx) => {
    const options = element.data.options || [];
    if (options.length <= optionIdx) return "";
    return options[optionIdx];
  };

  const setOption = (optionIdx, option) => {
    const options = element.data.options || [];
    options[optionIdx] = option;
    if (option === "" && options.length === optionIdx + 1) options.pop(); // remove last entry if empty
    setElementDataAttribute("options", options);
  };

  return (
    <>
      <div>
        <div className="mt-1">
          <input
            type="text"
            name="question"
            id="question"
            className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Question"
            value={element.data.question || ""}
            onChange={(e) =>
              setElementDataAttribute("question", e.target.value)
            }
            onBlur={() => persistSurvey(survey)}
          />
        </div>
        <div className="mt-2">
          <input
            type="text"
            name="description"
            className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Description (optional)"
            value={element.data.description || ""}
            onChange={(e) =>
              setElementDataAttribute("description", e.target.value)
            }
            onBlur={() => persistSurvey(survey)}
          />
        </div>
        <div className="mt-2">
          {(element.data.options || [])
            .concat([""])
            .map((option, optionIdx) => (
              <div
                key={optionIdx}
                className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:py-2"
              >
                <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Option {optionIdx + 1}
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="text"
                    name="option"
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    value={getOption(optionIdx)}
                    onChange={(e) => setOption(optionIdx, e.target.value)}
                    onBlur={(e) => persistSurvey(survey)}
                  />
                </div>
              </div>
            ))}
        </div>
        <hr className="my-2" />
        <div className="mt-2">
          <Switch.Group as="div" className="flex items-center justify-between">
            <span className="flex-grow flex flex-col">
              <Switch.Label
                as="span"
                className="text-sm font-medium text-gray-600"
                passive
              >
                Allow multiple selections
              </Switch.Label>
            </span>
            <Switch
              checked={element.data.multipleChoice}
              onChange={() =>
                setElementDataAttribute(
                  "multipleChoice",
                  !element.data.multipleChoice,
                  true
                )
              }
              className={classNames(
                element.data.multipleChoice ? "bg-pink-600" : "bg-gray-200",
                "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none"
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  element.data.multipleChoice
                    ? "translate-x-5"
                    : "translate-x-0",
                  "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                )}
              />
            </Switch>
          </Switch.Group>
        </div>
        <div className="mt-2">
          <Switch.Group as="div" className="flex items-center justify-between">
            <span className="flex-grow flex flex-col">
              <Switch.Label
                as="span"
                className="text-sm font-medium text-gray-600"
                passive
              >
                Randomize
              </Switch.Label>
            </span>
            <Switch
              checked={element.data.randomize}
              onChange={() =>
                setElementDataAttribute(
                  "randomize",
                  !element.data.randomize,
                  true
                )
              }
              className={classNames(
                element.data.randomize ? "bg-pink-600" : "bg-gray-200",
                "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none"
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  element.data.randomize ? "translate-x-5" : "translate-x-0",
                  "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                )}
              />
            </Switch>
          </Switch.Group>
        </div>
      </div>
    </>
  );
}
