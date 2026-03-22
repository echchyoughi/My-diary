import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-enter mx-auto grid min-h-screen w-full max-w-6xl items-center gap-6 px-4 py-6 lg:grid-cols-2">
      <section className="journal-panel hidden rounded-2xl p-8 lg:block">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-terracotta">Today is a blank page</p>
        <h2 className="mb-4 text-4xl font-semibold leading-tight">Write the story you will be proud to read later.</h2>
        <p className="mb-6 text-cocoa/75">
          A few honest lines each day can change how you remember your life.
        </p>
        <div className="rounded-xl border border-[#e5d4c1] bg-white/70 p-5">
          <p className="text-5xl">📖</p>
          <p className="mt-3 text-sm text-cocoa/80">
            "Small entries become a beautiful book of your growth."
          </p>
        </div>
      </section>
      <form onSubmit={handleSubmit} className="journal-panel w-full rounded-2xl p-6">
        <h1 className="mb-1 text-2xl font-semibold">Welcome back</h1>
        <p className="mb-4 text-sm text-cocoa/70">Continue your journal journey.</p>
        {error ? <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p> : null}
        <input className="mb-3 w-full rounded border border-[#ddc8b3] bg-white px-3 py-2" type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
        <input className="mb-4 w-full rounded border border-[#ddc8b3] bg-white px-3 py-2" type="password" placeholder="Password" required value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
        <button disabled={loading} className="w-full rounded bg-terracotta px-4 py-2 text-white">
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="mt-4 text-sm">
          New here? <Link to="/register" className="text-terracotta">Create an account</Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
