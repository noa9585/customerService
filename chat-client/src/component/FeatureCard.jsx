import React from "react";

export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="text-4xl mb-5">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}import React from "react";

export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="text-4xl mb-5">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}