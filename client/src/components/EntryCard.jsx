import { format } from "date-fns";
import { Link } from "react-router-dom";

const stripHtml = (html) => html.replace(/<[^>]*>?/gm, "");

const EntryCard = ({ entry }) => {
  return (
    <Link
      to={`/entry/${entry.id}`}
      className="lift-card block rounded-2xl border border-[#eadfd1] bg-white/95 p-4"
    >
      <div className="mb-3 h-1 w-16 rounded-full bg-gradient-to-r from-terracotta to-[#e6b394]" />
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="line-clamp-1 text-lg font-semibold">{entry.title}</h3>
        {entry.mood ? <span className="text-xl">{entry.mood}</span> : null}
      </div>
      <p className="mb-2 text-sm text-cocoa/70">{format(new Date(entry.date), "PPP")}</p>
      <p className="line-clamp-3 text-sm text-cocoa/80">{stripHtml(entry.content)}</p>
    </Link>
  );
};

export default EntryCard;
