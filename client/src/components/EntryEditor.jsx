import { useState } from "react";
import ReactQuill from "react-quill";

const moods = ["😔", "😐", "🙂", "😊", "🤩"];

const EntryEditor = ({ initialData, onSubmit, loading }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [date, setDate] = useState(initialData?.date?.slice(0, 10) || new Date().toISOString().slice(0, 10));
  const [mood, setMood] = useState(initialData?.mood || "");
  const [content, setContent] = useState(initialData?.content || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, date, mood, content });
  };

  return (
    <form onSubmit={handleSubmit} className="journal-panel space-y-4 rounded-2xl p-5">
      <p className="text-sm text-cocoa/70">Let your words flow. Your draft auto-keeps mood and date context.</p>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Entry title"
        className="journal-glass w-full rounded-lg border border-[#e6d7c6] px-3 py-2 outline-none focus:border-terracotta"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="journal-glass w-full rounded-lg border border-[#e6d7c6] px-3 py-2 outline-none focus:border-terracotta"
        required
      />
      <div className="flex flex-wrap gap-2">
        {moods.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setMood(item)}
            className={`rounded-lg px-3 py-2 text-xl ${mood === item ? "bg-terracotta/15 ring-2 ring-terracotta" : "bg-[#f7efe5] hover:bg-[#f4e7da]"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <ReactQuill theme="snow" value={content} onChange={setContent} />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-terracotta px-4 py-2 text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-95 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Entry"}
      </button>
    </form>
  );
};

export default EntryEditor;
