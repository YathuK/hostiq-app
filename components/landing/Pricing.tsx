"use client";

const plans = [
  {
    name: "Solo Host",
    desc: "Perfect for hosts with 1-3 properties",
    price: "$39",
    unit: "/mo per property",
    features: [
      "Full autopilot workflow",
      "Automated cleaner dispatch via SMS",
      "AI-powered damage detection",
      "AirCover claim generator with PDF export",
      "Unlimited cleans per month",
      "Room-by-room photo documentation",
    ],
  },
  {
    name: "Property Manager",
    desc: "Built for teams managing 4+ listings",
    price: "$29",
    unit: "/mo per property",
    features: [
      "Everything in Solo Host",
      "Multi-property dashboard",
      "Volume discount pricing",
      "Priority support",
      "Team member access",
      "Custom cleaning checklists per property",
    ],
    popular: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 px-6 bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 reveal">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Pricing</p>
          <h2 className="text-3xl md:text-5xl font-bold text-dark">
            Simple pricing. No surprises.
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            Pay per property. Cancel anytime. First month free for early access hosts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto stagger">
          {plans.map((plan, i) => (
            <article
              key={i}
              className={`relative bg-white rounded-3xl p-8 md:p-10 border hover-lift ${
                plan.popular
                  ? "border-primary shadow-xl shadow-emerald-500/10"
                  : "border-slate-100"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-emerald-500/20">
                    Best Value
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-dark">{plan.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{plan.desc}</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold text-dark">{plan.price}</span>
                <span className="text-slate-400 ml-2">{plan.unit}</span>
              </div>
              <ul className="space-y-4 mb-10">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-slate-600 text-[15px]">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#waitlist"
                className={`block text-center py-4 rounded-2xl font-semibold text-lg transition-all ${
                  plan.popular
                    ? "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-emerald-500/20"
                    : "bg-slate-50 text-dark hover:bg-slate-100"
                }`}
              >
                Join Waitlist
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
