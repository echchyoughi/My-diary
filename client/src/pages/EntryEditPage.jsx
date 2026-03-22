import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api/axios";
import EntryEditor from "../components/EntryEditor";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";

const EntryEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntry = async () => {
      setLoading(true);
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

  const handleUpdate = async (payload) => {
    setSaving(true);
    setError("");
    try {
      await api.put(`/api/entries/${id}`, payload);
      navigate(`/entry/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update entry.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-enter mx-auto w-full max-w-4xl px-4 py-6">
        <section className="journal-panel mb-5 rounded-2xl p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-terracotta">Refine your thoughts</p>
          <h1 className="mt-2 text-2xl font-semibold">Edit entry</h1>
          <p className="mt-1 text-cocoa/75">Polish the memory, keep the feeling.</p>
        </section>
        {error ? <p className="mb-3 rounded bg-red-50 p-3 text-red-600">{error}</p> : null}
        {loading ? <LoadingSpinner /> : null}
        {!loading && entry ? <EntryEditor initialData={entry} onSubmit={handleUpdate} loading={saving} /> : null}
      </main>
    </>
  );
};

export default EntryEditPage;
