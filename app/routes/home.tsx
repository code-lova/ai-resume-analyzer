import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "libs/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your resumes!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const fetchResumes = async () => {
      setLoading(true);

      const resumes = (await kv.list("resume_*", true)) as KVItem[];
      const parsedResumes = resumes?.map((item) =>
        JSON.parse(item.value)
      ) as Resume[];

      console.log("Fetched resumes:", parsedResumes);
      setResume(parsedResumes || []);
      setLoading(false);
    };

    fetchResumes();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-8">
          <h1>Track Your Applications & Resume Ratings</h1>
          {!loading && resume?.length === 0 ? (
            <h2>No resumes found. Start by uploading your first resume!</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback</h2>
          )}
        </div>
        {loading && (
          <div className="flex flex-col items-center justify-center">
            <img
              src="/images/resume-scan-2.gif"
              alt="loading resume"
              className="w-[200px]"
            />
          </div>
        )}

        {!loading && resume.length > 0 && (
          <div className="resumes-section">
            {resume.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loading && resume?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload your first resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
