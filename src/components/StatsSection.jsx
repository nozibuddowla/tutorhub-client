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

// Static Tailwind class maps — prevents purging
const colorMap = {
  purple: {
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconBorder: "border-2 border-purple-300 dark:border-purple-700",
    suffix: "text-purple-600 dark:text-purple-400",
    accent: "bg-purple-600",
  },
  teal: {
    iconBg: "bg-teal-600 dark:bg-teal-900/30",
    iconBorder: "border-2 border-teal-300 dark:border-teal-700",
    suffix: "text-teal-600 dark:text-teal-400",
    accent: "bg-teal-600",
  },
  amber: {
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconBorder: "border-2 border-amber-300 dark:border-amber-700",
    suffix: "text-amber-600 dark:text-amber-400",
    accent: "bg-amber-500",
  },
  red: {
    iconBg: "bg-red-100 dark:bg-red-900/30",
    iconBorder: "border-2 border-red-300 dark:border-red-700",
    suffix: "text-white dark:text-red-400",
    accent: "bg-red-6000",
  },
};

const StatCard = ({ icon, value, suffix, label, colorKey, started }) => {
  const count = useCountUp(value, 1800, started);
  const c = colorMap[colorKey];

  return (
    <div className="relative flex flex-col items-center text-center p-8 rounded-3xl border bg-[var(--bg-elevated)] border-[var(--bg-border)] hover:shadow-xl transition-shadow group">
      {/* Icon */}
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 transition-transform group-hover:scale-110 duration-300 ${c.iconBg} ${c.iconBorder}`}
      >
        {icon}
      </div>

      {/* Number */}
      <p className="text-5xl font-black tabular-nums leading-none text-[var(--text-primary)]">
        {count.toLocaleString()}
        <span className={`text-4xl ${c.suffix}`}>{suffix}</span>
      </p>

      {/* Label */}
      <p className="text-sm font-semibold text-[var(--text-secondary)] mt-3">
        {label}
      </p>

      {/* Bottom accent — no inline style */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-16 rounded-full transition-all group-hover:w-24 ${c.accent}`}
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/stats`);
        if (res.data) setStats((prev) => ({ ...prev, ...res.data }));
      } catch {
        // keep fallback values
      }
    };
    fetchStats();
  }, []);

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
      colorKey: "purple",
    },
    {
      icon: "🎓",
      value: stats.students,
      suffix: "+",
      label: "Students Helped",
      colorKey: "teal",
    },
    {
      icon: "📚",
      value: stats.tuitions,
      suffix: "+",
      label: "Tuition Hours",
      colorKey: "amber",
    },
    {
      icon: "⭐",
      value: stats.satisfaction,
      suffix: "%",
      label: "Satisfaction Rate",
      colorKey: "red",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 bg-[var(--bg-surface)] border-y border-[var(--bg-border)]"
    >
      <div className="max-w-6xl mx-auto">
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
