import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import EntryEditor from "../components/EntryEditor";
import Navbar from "../components/Navbar";

const EntryNewPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (payload) => {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/entries", payload);
      navigate(`/entry/${data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-enter mx-auto w-full max-w-4xl px-4 py-6">
        <section className="journal-panel mb-5 rounded-2xl p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-terracotta">Fresh page</p>
          <h1 className="mt-2 text-2xl font-semibold">New entry</h1>
          <p className="mt-1 text-cocoa/75">Write freely. You can always edit your words later.</p>
        </section>
        {error ? <p className="mb-3 rounded bg-red-50 p-3 text-red-600">{error}</p> : null}
        <EntryEditor onSubmit={handleCreate} loading={loading} />
      </main>
    </>
  );
};

export default EntryNewPage;
