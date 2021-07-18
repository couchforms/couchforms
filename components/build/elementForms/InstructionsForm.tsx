export default function InstructionsForm({
  element,
  setElement,
  survey,
  persistSurvey,
}) {
  const setElementDataAttribute = (key, value) => {
    const updatedElement = { ...element };
    updatedElement.data[key] = value;
    setElement(updatedElement);
  };

  return (
    <>
      <div>
        <div className="mt-1">
          <input
            type="text"
            name="title"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Title"
            value={element.data.title || ""}
            onChange={(e) => setElementDataAttribute("title", e.target.value)}
            onBlur={() => persistSurvey(survey)}
          />
        </div>
        <div className="mt-2">
          <input
            type="text"
            name="description"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Description (optional)"
            value={element.data.description || ""}
            onChange={(e) =>
              setElementDataAttribute("description", e.target.value)
            }
            onBlur={() => persistSurvey(survey)}
          />
        </div>
        <div className="mt-2">
          <textarea
            name="body"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Your Instructions"
            value={element.data.body || ""}
            onChange={(e) => setElementDataAttribute("body", e.target.value)}
            onBlur={() => persistSurvey(survey)}
          />
        </div>
      </div>
    </>
  );
}
