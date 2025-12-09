import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "libs/puter";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, resumeImageUrl },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();

  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [parsedFeedback, setParsedFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    const loadResumes = async () => {
      // Load resume image
      const blob = await fs.read(resumeImageUrl);
      if (!blob) return;

      const imageUrl = URL.createObjectURL(blob);
      setResumeUrl(imageUrl);
    };
    loadResumes();
  }, [resumeImageUrl]);

  useEffect(() => {
    // Parse feedback if it's a string
    if (typeof feedback === "string") {
      try {
        let parsed = JSON.parse(feedback);
        if (typeof parsed === "string") {
          parsed = JSON.parse(parsed);
        }
        setParsedFeedback(parsed);
      } catch (e) {
        console.error("Failed to parse feedback:", e);
      }
    } else {
      setParsedFeedback(feedback);
    }
  }, [feedback]);

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000 mb-2"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className="text-black font-bold wrap-break-word">
              {companyName}
            </h2>
          )}
          {jobTitle && (
            <h3 className="text-gray-500 text-lg wrap-break-word">
              {jobTitle}
            </h3>
          )}
          {!companyName && !jobTitle && (
            <h2 className="text-black font-bold wrap-break-word">Resume</h2>
          )}
        </div>

        <div className="shrink-0">
          <ScoreCircle score={parsedFeedback?.overallScore || 0} />
        </div>
      </div>

      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-100">
          <div className="w-full h-full">
            <img
              src={resumeUrl}
              alt={`${companyName} logo`}
              className="w-full h-[350px] max-sm:h-[250px] object-cover object-top"
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
