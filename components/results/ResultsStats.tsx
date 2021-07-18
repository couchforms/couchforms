export default function ResultsStats({ survey, answerSessions }) {
  const getCompletionRate = (answerSessions, survey) => {
    if (answerSessions.length === 0) {
      return 0;
    }
    const nonInstructionElements = survey.elements.filter(
      (e) => e.type !== "instructions"
    );
    const completedSessions = answerSessions.filter(
      (s) => s.answers.length === nonInstructionElements.length
    );
    return (completedSessions.length / answerSessions.length) * 100;
  };
  const stats = [
    { name: "Responses", stat: answerSessions.length },
    {
      name: "Completion Rate",
      stat: `${getCompletionRate(answerSessions, survey).toFixed(2)}%`,
    },
  ];
  return (
    <div>
      <dl className="mt-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200 md:grid-cols-2 md:divide-y-0 md:divide-x">
        {stats.map((item) => (
          <div key={item.name} className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-gray-900">{item.name}</dt>
            <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-pink-600">
                {item.stat}
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
