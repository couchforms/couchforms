import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddElementModal from "./AddElementModal";
import { getElementType } from "../../lib/elements";
import OpenForm from "./elementForms/OpenForm";
import MultipleChoiceForm from "./elementForms/MultipleChoiceForm";
import InstructionsForm from "./elementForms/InstructionsForm";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SingleElement({
  element,
  elementIdx,
  activeElementId,
  setActiveElementId,
  survey,
  setSurvey,
  persistSurvey,
}) {
  const setElement = (element, persist = false) => {
    const elementsDraft = [...survey.elementsDraft];
    const idx = elementsDraft.findIndex((e) => e.id === element.id);
    if (typeof idx !== "undefined") {
      elementsDraft[idx] = element;
      const updatedSurvey = { ...survey, elementsDraft };
      setSurvey(updatedSurvey);
      if (persist) {
        persistSurvey(updatedSurvey);
      }
    }
  };

  const removeElement = (element) => {
    const elementsDraft = [...survey.elementsDraft];
    const idx = elementsDraft.findIndex((e) => e.id === element.id);
    if (typeof idx !== "undefined") {
      elementsDraft.splice(idx, 1);
      const updatedSurvey = { ...survey, elementsDraft };
      setActiveElementId(null);
      setSurvey(updatedSurvey);
      persistSurvey(updatedSurvey);
    }
  };

  const getElementTypeIcon = (type) => {
    const elementType = getElementType(type);
    return elementType ? (
      <span
        className={classNames(
          `text-${elementType.color}-700`,
          `bg-${elementType.color}-50`,
          "rounded-lg inline-flex p-3 ring-4 ring-white"
        )}
      >
        <elementType.icon className="h-4 w-4" aria-hidden="true" />
      </span>
    ) : null;
  };

  const getElementForm = (type, element, setElement) => {
    if (type === "open") {
      return (
        <OpenForm
          element={element}
          setElement={setElement}
          survey={survey}
          persistSurvey={persistSurvey}
        />
      );
    } else if (type === "multipleChoice") {
      return (
        <MultipleChoiceForm
          element={element}
          setElement={setElement}
          survey={survey}
          persistSurvey={persistSurvey}
        />
      );
    } else if (type === "instructions") {
      return (
        <InstructionsForm
          element={element}
          setElement={setElement}
          survey={survey}
          persistSurvey={persistSurvey}
        />
      );
    }
  };
  return (
    <Draggable key={element.id} draggableId={element.id} index={elementIdx}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={classNames(
            activeElementId === element.id
              ? "border-2 border-pink-400 border-opacity-50"
              : "",
            "bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 mb-5 focus:outline-none"
          )}
        >
          <div
            className="px-4 py-5 sm:px-6 w-full focus:outline-none"
            onClick={() => setActiveElementId(element.id)}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {getElementTypeIcon(element.type)}
              </div>
              <div className="ml-4">
                <h3 className="text-md leading-6 font-medium text-gray-900">
                  {element.data.question || element.data.title || "New Element"}
                </h3>
              </div>
            </div>
          </div>
          {activeElementId === element.id && (
            <div>
              <div className="px-4 py-5 sm:p-6">
                {getElementForm(element.type, element, setElement)}
              </div>
              <div className="text-right pr-2 pb-2 ">
                <button
                  className="text-sm text-gray-400 hover:underline"
                  onClick={() => removeElement(element)}
                >
                  Remove Element
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default function ManageQuestions({
  survey,
  setSurvey,
  persistSurvey,
  activeElementId,
  setActiveElementId,
}) {
  const [showElementModal, setShowElementModal] = useState(false);

  const addElement = (type) => {
    const elementsDraft = [...survey.elementsDraft];
    const element = {
      id: uuidv4(),
      type,
      data: {},
    };
    if (type === "open") {
      element.data = {
        question: "",
        description: "",
      };
    } else if (type === "multipleChoice") {
      element.data = {
        question: "",
        description: "",
        options: [],
        multipleChoice: false,
        randomize: false,
      };
    }
    elementsDraft.push(element);
    const updatedSurvey = { ...survey, elementsDraft };
    setSurvey(updatedSurvey);
    persistSurvey(updatedSurvey);
    setActiveElementId(element.id);
  };

  // Drag & Drop
  const reorder = (list, startIndex, endIndex) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const elementsDraft = reorder(
      survey.elementsDraft,
      result.source.index,
      result.destination.index
    );
    const updatedSurvey = { ...survey, elementsDraft };
    setSurvey(updatedSurvey);
    persistSurvey(updatedSurvey);
  };

  return (
    <div className="mx-5 my-5">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {survey.elementsDraft.map((element, elementIdx) => (
                <SingleElement
                  key={elementIdx}
                  element={element}
                  elementIdx={elementIdx}
                  activeElementId={activeElementId}
                  setActiveElementId={setActiveElementId}
                  survey={survey}
                  setSurvey={setSurvey}
                  persistSurvey={persistSurvey}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button
        type="button"
        className="w-full content-center text-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        onClick={() => setShowElementModal(true)}
      >
        + Add Element
      </button>
      <AddElementModal
        open={showElementModal}
        setOpen={setShowElementModal}
        addElement={addElement}
      />
    </div>
  );
}
