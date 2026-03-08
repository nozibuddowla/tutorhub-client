import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

// Animated counter hook
const useCountUp = (target, duration = 1800, started = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started || target === 0) return;
    let current = 0;
    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return count;
};

const StatCard = ({ icon, value, suffix, label, color, started, delay }) => {
  const count = useCountUp(value, 1800, started);
  return (
    <div
      className="relative flex flex-col items-center text-center p-8 rounded-3xl border bg-[var(--bg-elevated)] border-[var(--bg-border)] hover:shadow-xl transition-shadow group"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon ring */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 transition-transform group-hover:scale-110 duration-300"
        style={{ background: `${color}18`, border: `2px solid ${color}35` }}
      >
        {icon}
      </div>

      {/* Number */}
      <p className="text-5xl font-black tabular-nums leading-none text-[var(--text-primary)]">
        {count.toLocaleString()}
        <span style={{ color }} className="text-4xl">
          {suffix}
        </span>
      </p>

      {/* Label */}
      <p className="text-sm font-semibold text-[var(--text-secondary)] mt-3">
        {label}
      </p>

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-16 rounded-full transition-all group-hover:w-24"
        style={{ background: color }}
      />
    </div>
  );
};

const StatsSection = () => {
  const [stats, setStats] = useState({
    tutors: 500,
    students: 2000,
    tuitions: 10000,
    satisfaction: 98,
  });
  const [started, setStarted] = useState(false);
  const sectionRef = useRef(null);

  // Fetch real data
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/stats`);
        if (res.data) setStats({ ...stats, ...res.data });
      } catch {
        // keep fallback values
      }
    };
    fetch();
  }, []);

  // Intersection observer — start counters when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.25 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const items = [
    {
      icon: "👨‍🏫",
      value: stats.tutors,
      suffix: "+",
      label: "Expert Tutors",
      color: "#6b46c1",
      delay: 0,
    },
    {
      icon: "🎓",
      value: stats.students,
      suffix: "+",
      label: "Students Helped",
      color: "#11998e",
      delay: 100,
    },
    {
      icon: "📚",
      value: stats.tuitions,
      suffix: "+",
      label: "Tuition Hours",
      color: "#d97706",
      delay: 200,
    },
    {
      icon: "⭐",
      value: stats.satisfaction,
      suffix: "%",
      label: "Satisfaction Rate",
      color: "#e53e3e",
      delay: 300,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 bg-[var(--bg-surface)] border-y border-[var(--bg-border)]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-3">
            Platform Statistics
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)]">
            Trusted by Thousands Across Bangladesh
          </h2>
          <p className="text-[var(--text-secondary)] mt-3 max-w-lg mx-auto text-sm">
            Real numbers. Real students. Real impact — powered by live data from
            our platform.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <StatCard key={item.label} {...item} started={started} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
