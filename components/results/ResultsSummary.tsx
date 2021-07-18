import ResultsStats from "./ResultsStats";
import ResultsElement from "./ResultsElement";

export default function ResultsSummary({
  survey,
  answerSessions,
  answersByElementId,
}) {
  return (
    <main className="max-w-7xl mx-auto pt-10 pb-12 px-4 lg:pb-16 w-full">
      <ResultsStats survey={survey} answerSessions={answerSessions} />
      {survey.elements.map((element) => (
        <ResultsElement
          element={element}
          elementAnswers={answersByElementId[element.id] || []}
        />
      ))}
    </main>
  );
}
