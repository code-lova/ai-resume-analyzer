import { usePuterStore } from "libs/puter";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
export const meta = () => [
  { title: "Auth - Resumind" },
  { name: "description", content: "Login to you account." },
];

const auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col item-center gap-2 text-center">
            <h1 className="text-2xl font-bold text-center">Welcome</h1>
            <h2>Login to continue your job journey</h2>
          </div>

          {isLoading ? (
            <button className="auth-button animate-pulse">
              signing you in...
            </button>
          ) : (
            <>
              {auth.isAuthenticated ? (
                <button className="auth-button" onClick={auth.signOut}>
                  LogOut
                </button>
              ) : (
                <button className="auth-button" onClick={auth.signIn}>
                  Login
                </button>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default auth;
