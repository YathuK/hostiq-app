"use client";

const plans = [
  {
    name: "Solo Host",
    desc: "Perfect for hosts with 1-3 properties",
    price: "39",
    unit: "/mo per property",
    features: [
      "Full autopilot workflow",
      "Automated cleaner dispatch via SMS",
      "AI-powered damage detection",
      "AirCover claim generator + PDF",
      "Unlimited cleans per month",
      "Room-by-room photo docs",
    ],
  },
  {
    name: "Property Manager",
    desc: "Built for teams managing 4+ listings",
    price: "29",
    unit: "/mo per property",
    features: [
      "Everything in Solo Host",
      "Multi-property dashboard",
      "Volume discount pricing",
      "Priority support",
      "Team member access",
      "Custom checklists per property",
    ],
    popular: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30" />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-20 reveal">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Pricing</p>
          <h2 className="text-3xl md:text-5xl font-bold text-dark">
            Simple pricing. No surprises.
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            Pay per property. Cancel anytime. First month free for early access.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <article
              key={i}
              className={`reveal-scale relative bg-white rounded-3xl p-8 md:p-10 border hover-lift ${
                plan.popular
                  ? "border-primary/30 shadow-xl shadow-emerald-500/10"
                  : "border-slate-100"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="btn-shine px-5 py-2 bg-gradient-to-r from-primary to-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-emerald-500/30">
                    Best Value
                  </span>
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-dark">{plan.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{plan.desc}</p>
              </div>
              <div className="mb-8 flex items-baseline">
                <span className="text-sm text-slate-400 mr-1">$</span>
                <span className="text-6xl font-bold text-dark tracking-tight">{plan.price}</span>
                <span className="text-slate-400 ml-2">{plan.unit}</span>
              </div>
              <ul className="space-y-4 mb-10">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span className="text-slate-600 text-[15px]">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#waitlist"
                className={`btn-shine block text-center py-4 rounded-2xl font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  plan.popular
                    ? "bg-gradient-to-r from-primary to-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                    : "bg-slate-50 text-dark hover:bg-slate-100 hover:shadow-lg"
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
