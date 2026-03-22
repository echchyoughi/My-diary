import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";

const EntryViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntry = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/api/entries/${id}`);
        setEntry(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load entry.");
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this entry permanently?")) {
      return;
    }
    try {
      await api.delete(`/api/entries/${id}`);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete entry.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-enter mx-auto w-full max-w-4xl px-4 py-6">
        {loading ? <LoadingSpinner /> : null}
        {error ? <p className="mb-3 rounded bg-red-50 p-3 text-red-600">{error}</p> : null}
        {!loading && entry ? (
          <article className="journal-panel rounded-2xl p-6">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-terracotta">Entry details</p>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-2xl font-semibold">{entry.title}</h1>
              <div className="text-xl">{entry.mood || ""}</div>
            </div>
            <p className="mb-4 text-sm text-cocoa/70">{format(new Date(entry.date), "PPP")}</p>
            <div className="prose prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: entry.content }} />
            <div className="mt-6 flex gap-3">
              <Link to={`/entry/${id}/edit`} className="rounded-lg bg-terracotta px-4 py-2 text-white shadow-sm transition hover:-translate-y-0.5">
                Edit
              </Link>
              <button onClick={handleDelete} className="rounded-lg border border-red-400 px-4 py-2 text-red-600 transition hover:bg-red-50">
                Delete
              </button>
            </div>
          </article>
        ) : null}
      </main>
    </>
  );
};

export default EntryViewPage;
