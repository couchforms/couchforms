import { useState, useEffect } from "react";
import { ArrowSmRightIcon } from "@heroicons/react/solid";
import { shuffle } from "../../lib/utils";
import {
  Element,
  OpenElement,
  MultipleChoiceElement,
  InstructionsElement,
  AnswerData,
} from "../../lib/types";
import ProgressBar from "./ProgressBar";

type OpenCardProps = {
  element: OpenElement;
  colorPrimary: string;
  onSubmit: (elementId: string, value: AnswerData) => void;
};

function OpenCard({ element, colorPrimary, onSubmit }: OpenCardProps) {
  const [value, setValue] = useState("");
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl mb-1">
        {element.data.question || "Your Question"}
      </h1>
      <h2
        style={{ color: colorPrimary }}
        className="text-lg font-regular tracking-tight sm:text-xl"
      >
        {element.data.description}
      </h2>
      <hr className="my-5" />
      <textarea
        name="answer"
        rows={3}
        className="shadow-sm mt-1 block w-full sm:text-md border border-gray-200 rounded-md focus:ring-transparent focus:border-gray-200"
        placeholder="Your answer..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="text-right mt-6">
        <button
          type="button"
          style={{ backgroundColor: colorPrimary }}
          onClick={() => onSubmit(element.id, { value })}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white focus:outline-none"
        >
          Continue
          <ArrowSmRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </>
  );
}

type MultipleChoiceCardProps = {
  element: MultipleChoiceElement;
  colorPrimary: string;
  onSubmit: (
    elementId: string,
    value: AnswerData,
    skipSaveAnswer?: boolean
  ) => void;
};

function MultipleChoiceCard({
  element,
  colorPrimary,
  onSubmit,
}: MultipleChoiceCardProps) {
  const getOptions = (element) => {
    let options = element.data.options;
    if (element.data.randomize) {
      options = shuffle(options);
    }
    return options;
  };

  const [options, setOptions] = useState(null);
  const [checkboxStates, setCheckboxStates] = useState(null);

  useEffect(() => {
    setOptions(getOptions(element));
    setCheckboxStates(new Array(element.data.options.length).fill(false));
  }, [element]);

  const optionClicked = (option, optionIdx, element) => {
    if (!element.data.multipleChoice) {
      return onSubmit(element.id, { value: option });
    }
    const updatedCheckboxStates = [...checkboxStates];
    updatedCheckboxStates[optionIdx] = !updatedCheckboxStates[optionIdx];
    setCheckboxStates(updatedCheckboxStates);
  };

  const submitMultipleChoice = () => {
    const values = [];
    options.map((option, optionIdx) => {
      if (checkboxStates[optionIdx]) {
        values.push(option);
      }
    });
    onSubmit(element.id, { value: values });
  };

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl mb-1">
        {element.data.question || "Your Question"}
      </h1>
      <h2
        style={{ color: colorPrimary }}
        className="text-lg font-regular tracking-tight sm:text-xl"
      >
        {element.data.description}
      </h2>
      <hr className="my-5" />
      {options &&
        options.map((option, optionIdx) => (
          <div
            key={optionIdx}
            style={{
              borderColor: colorPrimary + "90",
              backgroundColor: colorPrimary + "40",
            }}
            className="w-full inline-flex items-center px-4 py-2 my-1 border text-sm font-medium rounded-md shadow-sm text-white bg-pink-100  hover:bg-pink-200 focus:outline-none"
            onClick={() => optionClicked(option, optionIdx, element)}
          >
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="comments"
                  name="comments"
                  type="checkbox"
                  style={{ color: colorPrimary }}
                  className="focus:ring-0 h-4 w-4 border-gray-300 rounded"
                  checked={checkboxStates[optionIdx]}
                  onChange={(e) => {
                    console.log("click");
                    optionClicked(option, optionIdx, element);
                  }}
                />
              </div>
              <div className="ml-3 text-sm">
                <label className="font-medium text-gray-700">{option}</label>
              </div>
            </div>
          </div>
        ))}
      {element.data.multipleChoice && (
        <div className="text-right mt-6">
          <button
            type="button"
            style={{ backgroundColor: colorPrimary }}
            onClick={() => submitMultipleChoice()}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white"
          >
            Continue
            <ArrowSmRightIcon
              className="ml-3 -mr-1 h-5 w-5"
              aria-hidden="true"
            />
          </button>
        </div>
      )}
    </>
  );
}

type InstructionsCardProps = {
  element: InstructionsElement;
  colorPrimary: string;
  onSubmit: (
    elementId: string,
    value: AnswerData,
    skipSaveAnswer?: boolean
  ) => void;
  finalElement: boolean;
};

function InstructionsCard({
  element,
  colorPrimary,
  onSubmit,
  finalElement,
}: InstructionsCardProps) {
  const [value, setValue] = useState("");
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl mb-1">
        {element.data.title || "Your Title"}
      </h1>
      <h2
        style={{ color: colorPrimary }}
        className="text-lg font-regular tracking-tight sm:text-xl"
      >
        {element.data.description}
      </h2>
      <hr className="my-5" />
      <p className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {element.data.body}
      </p>
      {!finalElement && (
        <div className="text-right mt-6">
          <button
            type="button"
            style={{ backgroundColor: colorPrimary }}
            onClick={() => onSubmit(element.id, null, true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white focus:outline-none"
          >
            Continue
            <ArrowSmRightIcon
              className="ml-3 -mr-1 h-5 w-5"
              aria-hidden="true"
            />
          </button>
        </div>
      )}
    </>
  );
}

type ElementCardProps = {
  element: Element;
  colorPrimary: string;
  onSubmit: (
    elementId: string,
    value: AnswerData,
    skipSaveAnswer?: boolean
  ) => void;
  finalElement: boolean;
  progress: number;
};

export default function ElementCard({
  element,
  colorPrimary,
  onSubmit,
  finalElement,
  progress,
}: ElementCardProps) {
  const getElementSpecificCard = (element) => {
    if (element.type === "open") {
      return (
        <OpenCard
          element={element}
          colorPrimary={colorPrimary}
          onSubmit={onSubmit}
        />
      );
    } else if (element.type === "multipleChoice") {
      return (
        <MultipleChoiceCard
          element={element}
          colorPrimary={colorPrimary}
          onSubmit={onSubmit}
        />
      );
    } else if (element.type === "instructions") {
      return (
        <InstructionsCard
          element={element}
          colorPrimary={colorPrimary}
          onSubmit={onSubmit}
          finalElement={finalElement}
        />
      );
    }
  };
  return (
    <div className="bg-white overflow-hidden shadow-lg sm:rounded-xl  text-center">
      <div className="py-8 px-4 sm:px-10">
        {getElementSpecificCard(element)}
      </div>
      <ProgressBar progress={progress} colorPrimary={colorPrimary} />
    </div>
  );
}
