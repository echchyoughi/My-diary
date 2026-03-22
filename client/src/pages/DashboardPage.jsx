import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";


import api from "../api/axios";
import EntryCard from "../components/EntryCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/api/entries");
        setEntries(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load entries.");
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const filtered = useMemo(() => {
    return entries.filter((entry) => {
      const text = `${entry.title} ${entry.content}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesMonth = !month || format(new Date(entry.date), "yyyy-MM") === month;
      return matchesSearch && matchesMonth;
    });
  }, [entries, search, month]);

  return (
    <>
      <Navbar />
      <main className="page-enter mx-auto w-full max-w-6xl min-h-screen px-4 py-6">
        <section className="journal-panel mb-6 rounded-2xl p-5 sm:p-7">
          <p className="text-sm uppercase tracking-[0.2em] text-terracotta">Your personal journal</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Capture thoughts, memories, and growth.</h2>
          <p className="mt-2 text-cocoa/75">
            Every entry is a page in your story - keep writing.
          </p>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div className="journal-glass rounded-xl px-4 py-3"><span className="font-semibold">{entries.length}</span> total entries</div>
            <div className="journal-glass rounded-xl px-4 py-3"><span className="font-semibold">{filtered.length}</span> shown now</div>
            <div className="journal-glass rounded-xl px-4 py-3"><span className="font-semibold">{new Date().toLocaleDateString()}</span> today</div>
          </div>
        </section>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Your entries</h1>
          <Link to="/entry/new" className="rounded-lg bg-terracotta px-4 py-2 text-center text-white shadow-sm transition hover:-translate-y-0.5">
            + New Entry
          </Link>
        </div>
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <input className="journal-glass rounded-lg border border-[#e6d7c6] px-3 py-2 outline-none focus:border-terracotta" placeholder="Search title or content..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <input type="month" className="journal-glass rounded-lg border border-[#e6d7c6] px-3 py-2 outline-none focus:border-terracotta" value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>
        {loading ? <LoadingSpinner /> : null}
        {error ? <p className="rounded bg-red-50 p-3 text-red-600">{error}</p> : null}
        {!loading && !error && filtered.length === 0 ? (
          <div className="journal-panel rounded-2xl border border-dashed border-[#d8c2aa] p-10 text-center">
            <p className="mb-2 text-4xl">📔</p>
            <p className="text-cocoa/80">No entries found. Start by writing your first one.</p>
          </div>
        ) : null}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </section>
      </main>
    </>
  );
};

export default DashboardPage;
