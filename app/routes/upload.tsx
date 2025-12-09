import { prepareInstructions } from "../../constants";
import { convertPdfToImage } from "libs/pdf2Img";
import { usePuterStore } from "libs/puter";
import React from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { generateUUID } from "~/utils";

const upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [statusText, setStatusText] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);

  const handleAnalyse = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File | null;
  }) => {
    setIsProcessing(true);
    setStatusText("Analyzing your resume...");

    if (!file) {
      setStatusText("No file selected.");
      setIsProcessing(false);
      return;
    }

    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText("Failed to upload file.");

    setStatusText("Converting to image....");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file) {
      return setStatusText(imageFile.error || "Failed to convert PDF to image.");
    }

    setStatusText("Uploading the image...");

    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText("Failed to upload image.");

    setStatusText("Preparing data...");

    const uuid = generateUUID();

    const resumeData = {
      id: uuid,
      resumeFileUrl: uploadedFile.path,
      resumeImageUrl: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };
    await kv.set(`resume_${uuid}`, JSON.stringify(resumeData));

    setStatusText("Analyzing....");

    const feedback = await ai.feedback(
      uploadedImage.path,
      prepareInstructions({ jobTitle, jobDescription })
    );

    if (!feedback) setStatusText("Error: Failed to analyse resume.");

    const feedbackText =
      typeof feedback?.message.content === "string"
        ? feedback?.message.content
        : feedback?.message.content[0].text;

    resumeData.feedback = JSON.stringify(feedbackText);
    await kv.set(`resume_${uuid}`, JSON.stringify(resumeData));
    setStatusText("Analysis complete! redirecting...");

    console.log(resumeData);

    navigate(`/resume/${uuid}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert("please upload a resume file");
      return;
    }
    const form = e.currentTarget.closest("form");
    if (!form) return;

    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    // console.log({companyName, jobTitle, jobDescription, file});

    handleAnalyse({ companyName, jobTitle, jobDescription, file });
  };

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading">
          <h1>Smart feedback from your dream job</h1>
          {isProcessing ? (
            <>
              {statusText}
              <img
                src="/images/resume-scan.gif"
                alt="resume-scan"
                className="w-full"
              />
            </>
          ) : (
            <h2>Drop your resume for an ATS score and improvement</h2>
          )}
          {!isProcessing && (
            <form
              id="form-submit"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  id="company-name"
                  name="company-name"
                  placeholder="Company Name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  id="job-title"
                  name="job-title"
                  placeholder="Job Title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  id="job-description"
                  name="job-description"
                  placeholder="Job Description"
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button className="primary-button" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default upload;
