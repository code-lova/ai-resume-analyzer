import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionContent,
} from "./Accordion";
import { cn } from "~/utils";

interface Tip {
  type: "good" | "improve";
  tip: string;
  explanation: string;
}

/**
 * ScoreBadge - Displays a colored badge based on score
 *
 * @param score - Score from 0-100
 *
 * Green background + check icon if score > 69
 * Yellow background if score > 39
 * Red background otherwise
 */
const ScoreBadge = ({ score }: { score: number }) => {
  const getBgColor = () => {
    if (score > 69) return "bg-green-100";
    if (score > 39) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getTextColor = () => {
    if (score > 69) return "text-green-700";
    if (score > 39) return "text-yellow-700";
    return "text-red-700";
  };

  const getIcon = () => {
    if (score > 69) return "/icons/check.svg";
    if (score > 39) return "/icons/warning.svg";
    return "/icons/error.svg";
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-full",
        getBgColor()
      )}
    >
      <img src={getIcon()} alt="score status" className="w-4 h-4" />
      <span className={cn("text-sm font-semibold", getTextColor())}>
        {score}/100
      </span>
    </div>
  );
};

/**
 * CategoryHeader - Renders a title and ScoreBadge side by side
 *
 * @param title - Category title
 * @param categoryScore - Score for this category
 */
const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

/**
 * CategoryContent - Renders tips in a two-column grid with explanation boxes
 *
 * @param tips - Array of tips with type, tip text, and explanation
 */
const CategoryContent = ({ tips }: { tips: Tip[] }) => {
  if (!tips || tips.length === 0) {
    return (
      <p className="text-gray-500 italic">
        No tips available for this category.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Two-column grid of tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg",
              item.type === "good" ? "bg-green-50" : "bg-yellow-50"
            )}
          >
            <img
              src={
                item.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"
              }
              alt={item.type}
              className="w-5 h-5 mt-0.5 shrink-0"
            />
            <span className="text-sm text-gray-700">{item.tip}</span>
          </div>
        ))}
      </div>

      {/* Explanation boxes */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-600">
          Detailed Explanations
        </h4>
        {tips.map((item, index) => (
          <div
            key={index}
            className={cn(
              "p-4 rounded-lg border-l-4",
              item.type === "good"
                ? "bg-green-50 border-green-500"
                : "bg-amber-50 border-amber-500"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <img
                src={
                  item.type === "good"
                    ? "/icons/check.svg"
                    : "/icons/warning.svg"
                }
                alt={item.type}
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "text-xs font-semibold uppercase",
                  item.type === "good" ? "text-green-700" : "text-amber-700"
                )}
              >
                {item.type === "good" ? "Strength" : "Improvement Needed"}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-1">{item.tip}</p>
            <p className="text-sm text-gray-600">{item.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Details Component - Displays feedback in an accordion with four sections
 *
 * Sections: Tone & Style, Content, Structure, Skills
 * Each section has a header with title + score badge and expandable content with tips
 *
 * @param feedback - Feedback object containing scores and tips for each category
 */
const Details = ({ feedback }: { feedback: Feedback }) => {
  const sections = [
    {
      id: "tone-style",
      title: "Tone & Style",
      score: feedback.toneAndStyle?.score || 0,
      tips: feedback.toneAndStyle?.tips || [],
    },
    {
      id: "content",
      title: "Content",
      score: feedback.content?.score || 0,
      tips: feedback.content?.tips || [],
    },
    {
      id: "structure",
      title: "Structure",
      score: feedback.structure?.score || 0,
      tips: feedback.structure?.tips || [],
    },
    {
      id: "skills",
      title: "Skills",
      score: feedback.skills?.score || 0,
      tips: feedback.skills?.tips || [],
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Detailed Feedback</h2>
        <p className="text-sm text-gray-500">
          Click on each section to view detailed tips and explanations
        </p>
      </div>

      <Accordion className="divide-y divide-gray-200">
        {sections.map((section) => (
          <AccordionItem key={section.id} id={section.id}>
            <AccordionHeader itemId={section.id} className="hover:bg-gray-50">
              <CategoryHeader
                title={section.title}
                categoryScore={section.score}
              />
            </AccordionHeader>
            <AccordionContent itemId={section.id} className="bg-gray-50">
              <CategoryContent tips={section.tips} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Details;
