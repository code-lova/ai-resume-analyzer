import React from "react";
import ScoreBadge from "./ScoreBadge";
import ScoreGauge from "./ScoreGauge";

const textColor = (score: number) => {
  if (score >= 70) return "text-green-600";
  if (score >= 49) return "text-yellow-600";
  return "text-red-500";
};

const Category = ({ title, score }: { title: string; score: number }) => {
  return (
    <div className="resume-summary">
      <div className="category">
        <div className="flex gap-2 items-center justify-center">
          <p className="text-2xl"> {title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className="text-2xl">
          <span className={textColor(score)}>{score}/100</span>
        </p>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl w-full">
      <div className="flex flex-row item-center p-4 gap-8">
        <ScoreGauge score={feedback.overallScore} />

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Resume Overall Score</h2>
          <p className="text-gray-500 text-sm">
            This score is calculated based on the variables listed below
          </p>
        </div>
      </div>

      <Category
        title="Tone and Style"
        score={feedback.toneAndStyle?.score || 0}
      />
      <Category title="Content" score={feedback.content?.score || 0} />
      <Category title="Structure" score={feedback.structure?.score || 0} />
      <Category title="Skills" score={feedback.skills?.score || 0} />
    </div>
  );
};

export default Summary;
