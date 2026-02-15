import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Floating animation variants
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          transition={{ type: "spring", stiffness: 50 }}
          className="absolute top-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: -mousePosition.x,
            y: -mousePosition.y,
          }}
          transition={{ type: "spring", stiffness: 50 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl"
        />

        {/* Floating Geometric Shapes */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-purple-400/20 rounded-3xl rotate-12"
          style={{ animationDelay: "0s" }}
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute bottom-1/3 left-1/4 w-24 h-24 border-2 border-cyan-400/20 rounded-full"
          style={{ animationDelay: "1s" }}
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-1/2 left-1/3 w-16 h-16 bg-linear-to-br from-purple-400/10 to-cyan-400/10 rounded-2xl -rotate-12"
          style={{ animationDelay: "2s" }}
        />

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative z-10 container mx-auto px-6 py-24 lg:py-32 flex flex-col items-center justify-center min-h-screen"
      >
        {/* Badge */}
        <motion.div variants={fadeInUp}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-sm font-medium text-white/90">
              Trusted by 10,000+ Students
            </span>
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeInUp}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-center mb-6 max-w-5xl"
        >
          <span className="bg-clip-text text-transparent bg-linear-to-r from-white via-purple-200 to-cyan-200">
            Find Your Perfect
          </span>
          <br />
          <span className="relative inline-block mt-2">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400">
              Tutor Today
            </span>
            {/* Underline Animation */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="absolute -bottom-2 left-0 h-1 bg-linear-to-r from-purple-400 to-cyan-400 rounded-full"
            />
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={fadeInUp}
          className="text-lg md:text-xl text-white/70 text-center max-w-2xl mb-12 leading-relaxed"
        >
          Bridging the gap between students and expert educators.{" "}
          <span className="text-white/90 font-semibold">
            Quality education is just a click away.
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/signup">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-linear-to-r from-purple-500 to-cyan-500 text-white font-bold rounded-full overflow-hidden shadow-2xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-cyan-500 to-purple-500"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>

          <Link to="/tutors">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all"
            >
              Browse Tutors
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-3 gap-8 md:gap-16 mt-20"
        >
          {[
            { number: "10K+", label: "Active Students" },
            { number: "500+", label: "Expert Tutors" },
            { number: "98%", label: "Success Rate" },
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2 + i * 0.1, type: "spring" }}
                className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-cyan-400"
              >
                {stat.number}
              </motion.div>
              <div className="text-sm md:text-base text-white/60 mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-white/60 rounded-full"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-gray-50 to-transparent" />
    </section>
  );
};

export default Hero;
