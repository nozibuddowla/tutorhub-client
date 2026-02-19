import React from "react";
import { Link } from "react-router";

const stats = [
  { value: "500+", label: "Active Tutors", icon: "👨‍🏫" },
  { value: "2,000+", label: "Students Helped", icon: "🎓" },
  { value: "10,000+", label: "Tuition Hours", icon: "⏱️" },
  { value: "98%", label: "Satisfaction Rate", icon: "⭐" },
];

const team = [
  {
    name: "Md. Nozib",
    role: "Founder & CEO",
    bio: "Passionate about making quality education accessible to every student in Bangladesh.",
    avatar: "MN",
    color: "#632ee3",
  },
  {
    name: "Sarah Ahmed",
    role: "Head of Tutors",
    bio: "Ensures every tutor on the platform meets our high standards of excellence.",
    avatar: "SA",
    color: "#11998e",
  },
  {
    name: "Karim Hassan",
    role: "Lead Developer",
    bio: "Builds the tools that power seamless learning experiences for all users.",
    avatar: "KH",
    color: "#e85d04",
  },
];

const values = [
  {
    icon: "🎯",
    title: "Excellence",
    desc: "We vet every tutor to ensure only the most qualified educators join our platform.",
  },
  {
    icon: "🤝",
    title: "Trust",
    desc: "Transparent reviews, verified profiles, and secure payments build lasting trust.",
  },
  {
    icon: "🌍",
    title: "Accessibility",
    desc: "Quality tutoring shouldn't be a privilege. We make it available to all.",
  },
  {
    icon: "🚀",
    title: "Innovation",
    desc: "Continuous improvements to our platform keep the learning experience cutting-edge.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gray-950 text-white py-28 px-4">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#632ee3] opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#11998e] opacity-20 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase">
            Our Story
          </span>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
            Connecting Students with{" "}
            <span className="bg-gradient-to-r from-[#9f62f2] to-[#11998e] bg-clip-text text-transparent">
              Expert Tutors
            </span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            TutorHub was born from a simple belief — every student deserves
            access to a great teacher. We built the bridge.
          </p>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="text-3xl font-black text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Left: visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#632ee3] to-[#11998e] rounded-3xl p-1 shadow-2xl">
              <div className="bg-white rounded-[22px] p-8 space-y-4">
                {[
                  {
                    label: "Student posts tuition request",
                    step: "01",
                    color: "#632ee3",
                  },
                  {
                    label: "Tutors browse & apply",
                    step: "02",
                    color: "#11998e",
                  },
                  {
                    label: "Admin reviews & approves",
                    step: "03",
                    color: "#e85d04",
                  },
                  { label: "Learning begins!", step: "04", color: "#d4ac0d" },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-4">
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0"
                      style={{ background: item.color }}
                    >
                      {item.step}
                    </span>
                    <p className="font-semibold text-gray-800">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-[#632ee3] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              Trusted by 2000+ students ✓
            </div>
          </div>

          {/* Right: text */}
          <div>
            <span className="text-[#632ee3] font-bold text-sm uppercase tracking-widest">
              Our Mission
            </span>
            <h2 className="text-4xl font-black text-gray-900 mt-3 mb-6 leading-tight">
              Making Quality Education Accessible for All
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Finding a reliable tutor in Bangladesh has always been a
              word-of-mouth affair — risky, inconsistent, and unfair. TutorHub
              changes that by bringing students, tutors, and administrators onto
              one transparent, accountable platform.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Students post their tuition requirements; qualified tutors apply;
              payments are tracked digitally. Everyone wins — and education
              improves.
            </p>
            <Link
              to="/tuitions"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#632ee3] to-[#9f62f2] text-white font-bold rounded-xl hover:opacity-90 transition"
            >
              Browse Tuitions →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────── */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#632ee3] font-bold text-sm uppercase tracking-widest">
              What We Stand For
            </span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-5 hover:shadow-md transition"
              >
                <span className="text-3xl shrink-0">{v.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    {v.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#632ee3] font-bold text-sm uppercase tracking-widest">
              The People Behind TutorHub
            </span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">
              Meet the Team
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-lg transition group"
              >
                <div
                  className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-black group-hover:scale-105 transition-transform"
                  style={{ background: member.color }}
                >
                  {member.avatar}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {member.name}
                </h3>
                <p
                  className="text-sm font-semibold mb-3"
                  style={{ color: member.color }}
                >
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#632ee3] to-[#11998e]">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl font-black mb-4">Ready to Start Learning?</h2>
          <p className="text-white/80 text-lg mb-8">
            Join thousands of students who found their perfect tutor on
            TutorHub.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3.5 bg-white text-[#632ee3] font-bold rounded-xl hover:bg-gray-100 transition"
            >
              Get Started Free
            </Link>
            <Link
              to="/tutors"
              className="px-8 py-3.5 bg-white/10 border border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition"
            >
              Browse Tutors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
