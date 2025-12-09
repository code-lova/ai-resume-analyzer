import { usePuterStore } from "libs/puter";
import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";

export const meta = () => [
  { title: "Review - Resumind" },
  { name: "description", content: "Detailed overview of your resume." },
];

const resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [resumeUrl, setResumeUrl] = React.useState<string | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<Feedback | null>(null);
  const navigate = useNavigate();

   useEffect(() => {
      if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [auth.isAuthenticated, isLoading]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume_${id}`);

      if (!resume) return;

      const resumeData = JSON.parse(resume);

      const resumeBlob = await fs.read(resumeData.resumeFileUrl);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });

      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(resumeData.resumeImageUrl);
      if (!imageBlob) return;

      //const imgBlob = new Blob([imageBlob], { type: "image/png" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);

      // Parse the feedback - it's double stringified
      let parsedFeedback = resumeData.feedback;
      if (typeof parsedFeedback === "string") {
        try {
          parsedFeedback = JSON.parse(parsedFeedback);
          // May be double stringified
          if (typeof parsedFeedback === "string") {
            parsedFeedback = JSON.parse(parsedFeedback);
          }
        } catch (e) {
          console.error("Failed to parse feedback:", e);
        }
      }
      setFeedback(parsedFeedback);

      console.log({ resumeUrl, imageUrl, feedback: parsedFeedback });
    };

    loadResume();
  }, [id]);

  return (
    <main className="pt-0!">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-gray-500 text-sm font-semibold">
            Back to home page
          </span>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('images/bg-small.svg')] bg-cover h-screen sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-w-xl:h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  alt="Resume"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </a>
            </div>
          )}
        </section>

        <section className="feedback-section">
          <h2 className="text-4xl font-bold text-black!">Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                Summary ATS Details
                <Summary feedback={feedback} />
                <ATS score={feedback.ATS?.score || 0} suggestions={feedback.ATS?.tips || []} />
                <Details feedback={feedback} />
            </div>
          ) : (
            <img
              src="/images/resume-scan-2.gif"
              alt="resume"
              className="w-full"
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default resume;
