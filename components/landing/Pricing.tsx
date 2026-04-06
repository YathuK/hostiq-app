"use client";

const plans = [
  {
    name: "Solo Host",
    price: "$39",
    unit: "/month per property",
    features: [
      "Full autopilot",
      "Damage documentation",
      "AirCover claim generator",
      "Unlimited cleans",
    ],
  },
  {
    name: "Property Manager",
    price: "$29",
    unit: "/month per property",
    features: [
      "Everything in Solo",
      "Multi-property dashboard",
      "Volume discount",
      "Priority support",
    ],
    popular: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-dark text-center">
          Simple pricing. No surprises.
        </h2>
        <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`bg-white rounded-xl p-8 shadow-sm border ${
                plan.popular ? "border-primary ring-2 ring-primary/20" : "border-slate-100"
              }`}
            >
              {plan.popular && (
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Best Value
                </span>
              )}
              <h3 className="text-xl font-bold text-dark mt-2">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-dark">{plan.price}</span>
                <span className="text-slate-500 ml-1">{plan.unit}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-slate-600">
                    <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#waitlist"
                className={`mt-8 block text-center py-3 rounded-xl font-semibold transition-colors ${
                  plan.popular
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "border-2 border-slate-200 text-dark hover:border-slate-300"
                }`}
              >
                Join Waitlist
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
