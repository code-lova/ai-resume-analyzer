import React from "react";

interface ScoreBadgeProps {
  score: number;
}

/**
 * A reusable badge component that displays a score-based label with dynamic styling.
 *
 * @param score - The score value (0-100) to determine badge style and label
 *
 * @example
 * ```tsx
 * <ScoreBadge score={85} /> // Green badge with "Strong"
 * <ScoreBadge score={55} /> // Yellow badge with "Good Start"
 * <ScoreBadge score={30} /> // Red badge with "Needs Work"
 * ```
 */
const ScoreBadge = ({ score }: ScoreBadgeProps) => {
  const getBadgeStyle = () => {
    if (score > 70) return "bg-green-100 text-green-700";
    if (score > 49) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const getLabel = () => {
    if (score > 70) return "Strong";
    if (score > 49) return "Good Start";
    return "Needs Work";
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeStyle()}`}
    >
      {getLabel()}
    </span>
  );
};

export default ScoreBadge;
