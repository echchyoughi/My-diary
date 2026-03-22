import { format } from "date-fns";
import { useEffect, useState } from "react";

import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";

const AdminPage = () => {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      setError("");
      try {
        const [overviewRes, usersRes] = await Promise.all([
          api.get("/api/admin/overview"),
          api.get("/api/admin/users"),
        ]);
        setOverview(overviewRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <>
      <Navbar />
      <main className="page-enter mx-auto w-full max-w-6xl px-4 py-6">
        <section className="journal-panel mb-6 rounded-2xl p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-terracotta">Creator Dashboard</p>
          <h1 className="mt-2 text-2xl font-semibold">App usage analytics</h1>
          <p className="mt-1 text-cocoa/75">Monitor who is using your app and how active they are.</p>
        </section>

        {loading ? <LoadingSpinner /> : null}
        {error ? <p className="rounded bg-red-50 p-3 text-red-600">{error}</p> : null}

        {!loading && !error && overview ? (
          <>
            <section className="mb-6 grid gap-4 sm:grid-cols-3">
              <article className="journal-glass rounded-xl p-4">
                <p className="text-sm text-cocoa/70">Total users</p>
                <p className="mt-1 text-2xl font-semibold">{overview.totalUsers}</p>
              </article>
              <article className="journal-glass rounded-xl p-4">
                <p className="text-sm text-cocoa/70">Total entries</p>
                <p className="mt-1 text-2xl font-semibold">{overview.totalEntries}</p>
              </article>
              <article className="journal-glass rounded-xl p-4">
                <p className="text-sm text-cocoa/70">Active in last 7 days</p>
                <p className="mt-1 text-2xl font-semibold">{overview.activeWritersLast7Days}</p>
              </article>
            </section>

            <section className="journal-panel mb-6 rounded-2xl p-5">
              <h2 className="mb-3 text-xl font-semibold">Top writers</h2>
              {overview.topWriters.length === 0 ? (
                <p className="text-cocoa/70">No entries yet.</p>
              ) : (
                <div className="grid gap-2">
                  {overview.topWriters.map((writer) => (
                    <div key={writer.id} className="journal-glass flex items-center justify-between rounded-lg px-3 py-2">
                      <p className="font-medium">{writer.name}</p>
                      <p className="text-sm text-cocoa/70">{writer.entriesCount} entries</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="journal-panel rounded-2xl p-5">
              <h2 className="mb-3 text-xl font-semibold">Users list</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#eadfd1] text-left text-cocoa/70">
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Joined</th>
                      <th className="px-3 py-2">Entries</th>
                      <th className="px-3 py-2">Last entry</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-[#f0e5d7]">
                        <td className="px-3 py-2">{user.name}</td>
                        <td className="px-3 py-2">{user.email}</td>
                        <td className="px-3 py-2">{format(new Date(user.createdAt), "PP")}</td>
                        <td className="px-3 py-2">{user.entriesCount}</td>
                        <td className="px-3 py-2">
                          {user.lastEntry ? format(new Date(user.lastEntry.createdAt), "PPp") : "No entry yet"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : null}
      </main>
    </>
  );
};

export default AdminPage;
