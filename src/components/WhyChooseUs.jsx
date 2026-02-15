import React from "react";

const WhyChooseUs = () => {
  return (
    <section className="bg-indigo-900 text-white py-24">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-8">Why Choose TutorHub?</h2>
          <div className="space-y-6">
            {[
              "Verified Tutor Profiles",
              "Secure Payment Management",
              "Real-time Chat Support",
              "Easy Application Tracking",
            ].map((item) => (
              <div key={item} className="flex items-center gap-4">
                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs">
                  ✓
                </div>
                <span className="text-lg opacity-90">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/5 p-10 rounded-4xl border border-white/10 backdrop-blur-sm">
          <p className="italic text-xl leading-relaxed opacity-90">
            "This platform helped me find a Calculus tutor in under 24 hours.
            The dashboard is incredibly intuitive and made tracking my child's
            progress a breeze."
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-full" />
            <div>
              <p className="font-bold text-lg">Sarah J.</p>
              <p className="text-sm opacity-50">Parent of 10th Grader</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
