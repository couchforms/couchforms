import { getElementType } from "../../lib/elements";
import { DateTime } from "luxon";
import { Bar } from "react-chartjs-2";
import { Answer, MultipleChoiceElement } from "../../lib/types";
import { classNames } from "../../lib/utils";

type unit = "year" | "month" | "week" | "day" | "hour" | "minute" | "second";

const timeAgo = (dateString) => {
  const units: unit[] = [
    "year",
    "month",
    "week",
    "day",
    "hour",
    "minute",
    "second",
  ];
  let dateTime = DateTime.fromISO(dateString);
  const diff = dateTime.diffNow().shiftTo(...units);
  const unit = units.find((unit) => diff.get(unit) !== 0) || "second";

  const relativeFormatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });
  return relativeFormatter.format(Math.trunc(diff.as(unit)), unit);
};

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
      <elementType.icon className="w-4 h-4" aria-hidden="true" />
    </span>
  ) : null;
};

function BaseResults({ element, children }) {
  return (
    <div className="my-8 overflow-hidden bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {getElementTypeIcon(element.type)}
          </div>
          <div className="ml-4">
            <h3 className="font-medium leading-6 text-gray-900 text-md">
              {element.data.question}
            </h3>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

function OpenResults({ element, elementAnswers }) {
  return (
    <BaseResults element={element}>
      <div className="flow-root px-8 my-4 mt-6 text-center">
        <ul className="-my-5 divide-y divide-gray-200">
          {elementAnswers.map((answer) => (
            <li key={answer.createdAt} className="py-5">
              <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                <h3 className="text-sm text-gray-700">
                  {/* Extend touch target to entire panel */}
                  <span className="absolute inset-0" aria-hidden="true" />
                  {answer.data.value}
                </h3>
                <p className="mt-1 text-xs text-gray-300 line-clamp-2">
                  {timeAgo(answer.createdAt.toISOString())}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </BaseResults>
  );
}

type MultipleChoiceResultsProps = {
  element: MultipleChoiceElement;
  elementAnswers: Answer[];
};

function MultipleChoiceResults({
  element,
  elementAnswers,
}: MultipleChoiceResultsProps) {
  const getDataset = (
    element: MultipleChoiceElement,
    elementAnswers: Answer[]
  ) => {
    const options = element.data.options;
    const dataset = new Array(options.length).fill(0);
    for (let answer of elementAnswers) {
      if (typeof answer.data.value === "string") {
        const optionsIdx = options.find((o) => o === answer.data.value);
        dataset[optionsIdx] = answer.data.value;
      } else if (Array.isArray(answer.data.value)) {
        for (let value of answer.data.value) {
          const optionsIdx = options.findIndex((o) => o === value);
          dataset[optionsIdx] = dataset[optionsIdx] + 1;
        }
      }
    }
    return dataset;
  };

  const data = {
    labels: element.data.options,
    datasets: [
      {
        data: getDataset(element, elementAnswers),
        backgroundColor: ["rgba(219, 39, 119, 0.2)"],
        borderColor: ["rgba(219, 39, 119, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options: any = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      yAxis: [
        {
          ticks: {
            min: 1,
            precision: 0,
          },
        },
      ],
    },
  };
  return (
    <BaseResults element={element}>
      <div className="flow-root px-8 my-4 mt-6 text-center">
        <Bar data={data} options={options} height={75} />
      </div>
    </BaseResults>
  );
}

export default function ResultsElement({ element, elementAnswers }) {
  return (
    <>
      {element.type === "open" && (
        <OpenResults element={element} elementAnswers={elementAnswers} />
      )}
      {element.type === "multipleChoice" && (
        <MultipleChoiceResults
          element={element}
          elementAnswers={elementAnswers}
        />
      )}
    </>
  );
}
