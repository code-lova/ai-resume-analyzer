import React from "react";

interface ATSSuggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: ATSSuggestion[];
}


const ATS = ({ score = 0, suggestions = [] }: ATSProps) => {
  const getGradientClass = () => {
    if (score > 69) return "from-green-100";
    if (score > 49) return "from-yellow-100";
    return "from-red-100";
  };

  const getIcon = () => {
    if (score > 69) return "/icons/ats-good.svg";
    if (score > 49) return "/icons/ats-warning.svg";
    return "/icons/ats-bad.svg";
  };

  const getHeadline = () => {
    if (score > 69) return "Great ATS Compatibility!";
    if (score > 49) return "Good Start, Room to Improve";
    return "Needs Attention";
  };

  return (
    <div
      className={`bg-linear-to-br ${getGradientClass()} to-white rounded-2xl p-6 shadow-md w-full`}
    >
      {/* Top Section */}
      <div className="flex items-center gap-4 mb-6">
        <img src={getIcon()} alt="ATS Status" className="w-12 h-12" />
        <div>
          <h2 className="text-2xl font-bold">
            ATS Score - <span>{score}/100</span>
          </h2>
          <p className="text-gray-600">{getHeadline()}</p>
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">What This Means</h3>
        <p className="text-gray-500 text-sm">
          Your resume's ATS compatibility score indicates how well it can be
          parsed by automated tracking systems. A higher score means better
          chances of passing initial screening filters.
        </p>
      </div>

      {/* Suggestions List */}
      {suggestions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Suggestions</h3>
          <ul className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3">
                <img
                  src={
                    suggestion.type === "good"
                      ? "/icons/check.svg"
                      : "/icons/warning.svg"
                  }
                  alt={suggestion.type}
                  className="w-5 h-5 mt-0.5"
                />
                <span className="text-gray-700">{suggestion.tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Closing Line */}
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500 italic">
          💡 Keep improving! Small changes can significantly boost your ATS
          score and increase your chances of landing interviews.
        </p>
      </div>
    </div>
  );
};

export default ATS;