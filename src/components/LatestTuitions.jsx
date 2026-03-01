import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import Loading from "./Loading";

const LatestTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTuitions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/tuitions`,
        );
        setTuitions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tuitions:", error);
        setLoading(false);
      }
    };
    fetchTuitions();
  }, []);

  if (loading) return <Loading />;

  return (
    <section className="py-20 px-2 bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">
              Latest Tuition Posts
            </h2>
            <p className="text-[var(--text-secondary)] mt-2">
              New opportunities posted recently
            </p>
          </div>
          <Link
            to="/tuitions"
            className="text-purple-600 font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>

        {tuitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tuitions.map((post) => (
              <Link
                key={post._id}
                to={`/tuitions/${post._id}`}
                className="group bg-[var(--bg-elevated)] border border-[var(--bg-border)]
                  p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-purple-300
                  dark:hover:border-purple-700 transition-all block"
              >
                <span
                  className="bg-purple-100 dark:bg-purple-900/40 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 dark:text-purple-300
                  text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                >
                  {post.subject}
                </span>

                <h3
                  className="font-bold text-xl mt-4 text-[var(--text-primary)]
                  group-hover:text-purple-600 transition-colors"
                >
                  Looking for {post.subject} Tutor
                </h3>

                <p className="text-[var(--text-secondary)] mt-2 flex items-center gap-2">
                  📍 {post.location}
                </p>

                <div
                  className="flex justify-between items-center mt-6 pt-6
                  border-t border-[var(--bg-border)]"
                >
                  <p className="text-2xl font-black text-[var(--text-primary)]">
                    {post.salary}{" "}
                    <span className="text-sm font-normal text-[var(--text-muted)]">
                      BDT/mo
                    </span>
                  </p>
                  {/* ✅ View Details button: dark navy in light, muted in dark */}
                  <span
                    className="bg-[var(--color-neutral)] dark:bg-[var(--bg-muted)]
                    text-white dark:text-[var(--text-primary)]
                    px-2 py-2 rounded-xl text-sm font-semibold
                    group-hover:bg-purple-600 dark:group-hover:bg-purple-600
                    dark:group-hover:text-white transition"
                  >
                    View Details
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            className="py-12 text-center bg-[var(--bg-surface)] rounded-3xl
            border-2 border-dashed border-[var(--bg-border-strong)]"
          >
            <p className="text-[var(--text-muted)] text-lg">
              No tuitions posted yet. Check back later!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestTuitions;
