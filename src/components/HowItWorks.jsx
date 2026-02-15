import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      id: "01",
      title: "Create Account",
      desc: "Register as a Student or Tutor to get started.",
      icon: "👤",
      color: "#3b82f6",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "02",
      title: "Post or Search",
      desc: "Post a tuition requirement or search for verified tutors.",
      icon: "🔍",
      color: "#8b5cf6",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "03",
      title: "Start Learning",
      desc: "Connect, schedule sessions, and begin your journey.",
      icon: "🚀",
      color: "#10b981",
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const numberVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  return (
    <section className="relative bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-24 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-200 rounded-full blur-3xl"
        />
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 bg-linear-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full mb-4"
          >
            SIMPLE PROCESS
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            How The Platform{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600">
              Works
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three simple steps to connect students with expert tutors and start
            your learning journey today
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {/* Connection Lines (Desktop) */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-linear-to-r from-blue-300 via-purple-300 to-emerald-300 origin-left"
            />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={itemVariants}
              className="relative group"
            >
              {/* Card */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow border border-gray-100"
              >
                {/* Number Badge */}
                <motion.div
                  variants={numberVariants}
                  className="absolute -top-6 -right-6 w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                  }}
                >
                  {step.id}
                </motion.div>

                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: 0.3 + index * 0.2,
                  }}
                  className={`w-20 h-20 rounded-2xl bg-linear-to-br ${step.gradient} flex items-center justify-center text-4xl mb-6 shadow-lg`}
                >
                  {step.icon}
                </motion.div>

                {/* Content */}
                <h3 className="font-black text-2xl mb-3 text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>

                {/* Hover Arrow */}
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                  className="mt-4 text-blue-600 font-semibold flex items-center gap-2"
                >
                  Learn more
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    →
                  </motion.span>
                </motion.div>

                {/* Decorative Corner */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 opacity-5 rounded-br-3xl"
                  style={{
                    background: `linear-gradient(135deg, transparent 50%, ${step.color} 50%)`,
                  }}
                />
              </motion.div>

              {/* Connection Dot (Desktop) */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{
                    type: "spring",
                    delay: 0.8 + index * 0.2,
                  }}
                  className="hidden md:block absolute top-24 -right-4 w-8 h-8 rounded-full border-4 border-white shadow-lg z-10"
                  style={{ background: step.color }}
                />
              )}

              {/* Mobile Arrow */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 + index * 0.2 }}
                  className="md:hidden flex justify-center my-6"
                >
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-4xl"
                    style={{ color: step.color }}
                  >
                    ↓
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Get Started Today →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
