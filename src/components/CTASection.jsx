import { Link } from "react-router";
import { motion } from "framer-motion";

const CTASection = () => {
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay },
  });

  return (
    <section className="relative py-28 px-4 overflow-hidden">
      {/* Dark gradient background */}
      <div
        className="absolute inset-0 -z-0"
        style={{
          background: "linear-gradient(135deg, #120820 0%, #081e1c 100%)",
        }}
      />
      {/* Blobs */}
      <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-purple-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Live badge */}
        <motion.div {...fadeUp(0)} className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white/75 text-sm font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
            </span>
            Trusted by 10,000+ learners across Bangladesh
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          {...fadeUp(0.1)}
          className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-6"
        >
          Your Perfect Tutor is{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(90deg, #c084fc, #34d399)",
            }}
          >
            One Click Away
          </span>
        </motion.h2>

        <motion.p
          {...fadeUp(0.2)}
          className="text-white/55 text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Post your tuition request for free and let verified tutors come to
          you. Or browse our experts and start learning today — no commitment
          needed.
        </motion.p>

        {/* Buttons */}
        <motion.div
          {...fadeUp(0.3)}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/signup">
            <motion.button
              whileHover={{
                scale: 1.04,
                boxShadow: "0 20px 50px rgba(107,70,193,0.45)",
              }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-9 py-4 font-bold text-white text-base rounded-2xl shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #6b46c1, #11998e)",
              }}
            >
              Get Started — It's Free ✨
            </motion.button>
          </Link>
          <Link to="/tutors">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-9 py-4 font-bold text-white text-base rounded-2xl border-2 border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-md transition"
            >
              Browse Tutors →
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust row */}
        <motion.div
          {...fadeUp(0.45)}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2"
        >
          {[
            "✓ No hidden fees",
            "✓ Verified tutors only",
            "✓ Secure payments",
            "✓ Cancel anytime",
          ].map((t) => (
            <span key={t} className="text-white/35 text-xs font-semibold">
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
