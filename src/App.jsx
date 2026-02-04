import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * LinkMoney Investor Pitch Website (React)
 *
 * HOW TO RUN (Vite):
 * 1) npm install
 * 2) npm run dev
 *
 * NOTES:
 * - No external UI/icon libraries (so no lucide-react dependency issues)
 * - Pure React + CSS, with IntersectionObserver reveals, counters, micro-interactions
 * - Adds:
 *   1) Product matching simulator (score → recommended products)
 *   2) Agent dashboard mock (Eligibility / Next action / Lender match)
 *   3) Animated rejection → conversion graph (SVG, animated paths + markers)
 */

const CONFIG = {
  brand: {
    name: "LinkMoney",
    tagline: "Fix credit first. Build trust for life.",
    subtagline: "India’s agent-led credit builder and fixer platform for DSAs.",
    primaryCta: { label: "Partner as DSA", href: "#contact" },
    secondaryCta: { label: "Talk to Us", href: "#contact" },
  },

  stats: [
    {
      key: "dsa_credit_share",
      value: 90,
      suffix: "%",
      label: "of India’s credit moves through DSA agents",
    },
    {
      key: "rejection_rate",
      value: 95,
      suffix: "%",
      label: "applications rejected in typical agent workflows",
    },
    {
      key: "cibil_damage",
      value: null,
      suffix: "",
      label: "CIBIL damage from blind applications",
      display: "∞",
    },
  ],

  funnel: {
    title: "Applications vs Reality",
    subtitle: "The devastating rejection funnel",
    stages: [
      { key: "applications", label: "Applications Submitted", value: 10000, tone: "base", widthPct: 100 },
      { key: "rejected", label: "Rejected", value: 9500, tone: "rejected", widthPct: 95 },
      { key: "approved", label: "Approved", value: 500, tone: "approved", widthPct: 5 },
    ],
  },

  competitors: {
    title: "Why DIY Fails",
    subtitle: "Self-serve credit fixing doesn’t work in India",
    cards: [
      {
        name: "Oolka",
        model: "DIY Model",
        issues: ["Self-serve only", "No accountability", "Users abandon after 2 weeks", "No one initiates the journey"],
      },
      {
        name: "GoodScore",
        model: "DIY Model",
        issues: ["Zero tracking", "No human guidance", "High drop-off rate", "Lacks Tier-2/3 trust model"],
      },
    ],
    differentiationTitle: "Our Differentiation",
    differentiationLine: "Agent-led trust + Structured journey + Multi-product under one roof",
    inspirationLine: "Inspired by Turtlemint: trusted agents at scale work in India",
  },

  solution: {
    title: "Our Solution",
    subtitle: "Intelligence + Right Match + Credit Building",
    flow: [
      { title: "Eligibility Intelligence", desc: "Judge across 150+ products" },
      { title: "Right Match", desc: "Prevent rejections" },
      { title: "If Rejected", desc: "Credit Builder Program" },
      { title: "Convert", desc: "In 4–6 months" },
    ],
  },

  creditBuilder: {
    title: "Credit Builder Program",
    subtitle: "Gamified journey to qualification",
    journey: [
      {
        month: "Month 0",
        headline: "Initial Assessment",
        score: 580,
        progressPct: 20,
        badge: { label: "Journey Started", variant: "mintLight" },
        bullets: ["Credit report diagnosis", "Issue identification", "Personalized action plan"],
      },
      {
        month: "Month 2",
        headline: "Behaviour & Utilization",
        score: 620,
        progressPct: 40,
        badge: { label: "Utilization Milestone", variant: "mintLight" },
        bullets: ["Reduce utilization to <30%", "Repayment discipline tracking", "Remove avoidable hard pulls"],
      },
      {
        month: "Month 4",
        headline: "DPD Resolution & History",
        score: 670,
        progressPct: 70,
        badge: { label: "Payment Milestone", variant: "mintLight" },
        bullets: ["DPD resolution steps", "Payment history improvement", "Credit hygiene enforcement"],
      },
      {
        month: "Month 6",
        headline: "Qualification Ready",
        score: 720,
        progressPct: 100,
        badge: { label: "Goal Achieved!", variant: "mintSolid" },
        bullets: ["Credit mix optimization", "Eligibility unlock", "Loan qualification readiness"],
      },
    ],
  },

  oneRoof: {
    title: "One Roof for All Financial Products",
    subtitle: "Once trust is built, customers return for everything",
    hubLabel: "Trusted\nAgent",
    spokes: ["Loans", "Credit Cards", "Insurance", "Savings", "Investments", "Financial Planning"],
    quote: "“The agent becomes a lifelong financial partner, not a one-time transactor.”",
  },

  market: {
    title: "Market Opportunity",
    subtitle: "TAM / SAM / SOM",
    cards: [
      { label: "TAM", value: 450, suffix: "M", desc: "India’s credit-eligible population" },
      { label: "SAM", value: 180, suffix: "M", desc: "Sub-prime / thin-file segment" },
      { label: "SOM", value: 25, suffix: "M", desc: "Agent-addressable in 5 years" },
    ],
  },

  pilot: {
    title: "Pilot Results",
    subtitle: "Early validation from controlled rollout",
    kpis: [
      { label: "Credit profiles fixed / improved", value: 350 },
      { label: "Agents onboarded", value: 45 },
      { label: "Fintech / NBFC / Bank partnerships", value: 12 },
      { label: "Products listed", value: 150, suffix: "+", static: true },
      { label: "Products sold", value: 580 },
    ],
    note:
      "Note: Pilot data shown is from early controlled rollout. Numbers are placeholders and can be edited in the CONFIG object.",
  },

  gtm: {
    title: "Go-To-Market Strategy",
    subtitle: "Systematic, scalable agent onboarding",
    steps: [
      { title: "Cluster Onboarding", desc: "Onboard DSAs in geographic and community clusters for peer learning and support." },
      { title: "Tools + SOP + Support", desc: "Provide eligibility intelligence, structured processes, and ongoing training." },
      { title: "Convert Rejected Cases", desc: "Activate Credit Builder Program for customers who don’t qualify initially." },
      { title: "Lender Partnerships", desc: "Partner with lenders seeking high-conversion, credit-improved pools." },
      { title: "Multi-Product Expansion", desc: "Expand to insurance, savings, and investments per household through trusted agents." },
    ],
  },

  founders: {
    title: "About Us",
    subtitle: "Built by those who’ve seen the problem firsthand",
    people: [
      { name: "Saurav Roy", oneLiner: "ex-Tech Lead at AWS, Open Source contributor at OpenSearch, VIT Vellore ", img: "dhiraj.jpeg" },
      { name: "Dhiraj Kumar Jain", oneLiner: "ex-Tech Lead Razorpay, Acko | Ex- CTO Fridayy.ai, VIT Vellore", img: "saurav.png" },
    ],
    story:
      "We saw DSAs losing customers due to blind selling and repeated rejections. We built LinkMoney to give agents the intelligence and systems to guide customers, fix credit, and build lifelong trust.",
  },

  closing: {
    headline: "Rebuilding India’s credit outcomes\nthrough trusted agents.",
    primaryCta: { label: "Join the Pilot", href: "#contact" },
    secondaryCta: { label: "Partner With Us", href: "#contact" },
  },

  footer: {
    copyright: "© 2026 LinkMoney. All rights reserved.",
    links: [
      { label: "About", href: "#about" },
      { label: "Privacy", href: "#privacy" },
      { label: "Terms", href: "#terms" },
      { label: "Contact", href: "#contact" },
    ],
  },
};

/* ----------------------------- Utilities ----------------------------- */

function formatNumber(n) {
  if (typeof n !== "number") return n;
  return n.toLocaleString("en-IN");
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function useIntersectionVisible({ rootMargin = "0px 0px -80px 0px", threshold = 0.12 } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin, threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin, threshold]);

  return { ref, visible };
}

function useCountUp(target, startWhen, durationMs = 1600) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!startWhen) return;
    if (typeof target !== "number") return;

    const start = performance.now();
    const from = 0;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const next = Math.round(from + (target - from) * eased);
      setVal(next);
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target, startWhen, durationMs]);

  return val;
}

/* ----------------------------- Components ----------------------------- */

function Section({ id, variant = "default", children }) {
  return (
    <section id={id} className={`lm-section lm-section--${variant}`}>
      <div className="lm-container">{children}</div>
    </section>
  );
}

function SectionHeader({ title, subtitle, align = "center" }) {
  return (
    <div className={`lm-sectionHeader lm-sectionHeader--${align}`}>
      <h2 className="lm-h2">{title}</h2>
      {subtitle ? <p className="lm-subtitle">{subtitle}</p> : null}
    </div>
  );
}

function Button({ href, variant = "primary", children }) {
  return (
    <a className={`lm-btn lm-btn--${variant}`} href={href}>
      {children}
    </a>
  );
}

function Reveal({ className = "", children }) {
  const { ref, visible } = useIntersectionVisible();
  return (
    <div ref={ref} className={`lm-reveal ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

function StatCard({ value, suffix, label, display }) {
  const { ref, visible } = useIntersectionVisible();
  const number = useCountUp(typeof value === "number" ? value : 0, visible, 1700);

  return (
    <div ref={ref} className={`lm-card lm-statCard lm-reveal ${visible ? "is-visible" : ""}`}>
      <div className="lm-statNumber">
        {display ?? formatNumber(number)}
        {display ? "" : suffix ?? ""}
      </div>
      <div className="lm-statLabel">{label}</div>
    </div>
  );
}

/**
 * Funnel stage:
 * - Shell is full width so text always has space
 * - Inner fill shows proportion
 * - Content sits above fill and never clips
 * - Mobile stacks label/value so small green bar (5%) still shows readable text
 */
function FunnelStage({ stage, index }) {
  const { ref, visible } = useIntersectionVisible();
  const count = useCountUp(stage.value, visible, 1400 + index * 120);

  return (
    <div ref={ref} className={`lm-funnelStage lm-reveal ${visible ? "is-visible" : ""}`}>
      <div className={`lm-funnelBarShell lm-funnelBarShell--${stage.tone}`}>
        <div className="lm-funnelFill" style={{ width: visible ? `${stage.widthPct}%` : "0%" }} aria-hidden="true" />
        <div className="lm-funnelSheen" aria-hidden="true" />
        <div className="lm-funnelContent">
          <span className="lm-funnelLabel">{stage.label}</span>
          <span className="lm-funnelValue">{formatNumber(count)}</span>
        </div>
      </div>
    </div>
  );
}

function Flow() {
  return (
    <div className="lm-flow">
      {CONFIG.solution.flow.map((step, i) => (
        <React.Fragment key={step.title}>
          <Reveal>
            <div className="lm-flowStep">
              <div className="lm-flowNum">{i + 1}</div>
              <div className="lm-flowTitle">{step.title}</div>
              <div className="lm-flowDesc">{step.desc}</div>
            </div>
          </Reveal>
          {i < CONFIG.solution.flow.length - 1 ? <span className="lm-flowArrow">→</span> : null}
        </React.Fragment>
      ))}
    </div>
  );
}

/* -------------------- NEW: Product Matching Simulator -------------------- */

function getRecommendedProducts(score) {
  // You can replace these with real lender/product rules later.
  if (score < 600) {
    return {
      band: "Needs Credit Builder",
      tone: "warn",
      summary: "Start with secured / starter products and credit hygiene",
      products: [
        { name: "Secured Credit Card", reason: "Low risk entry, builds payment history" },
        { name: "FD-backed Limit", reason: "Improves utilization and score stability" },
        { name: "Credit Builder Journey (4–6 months)", reason: "DPD resolution + utilization discipline" },
      ],
      nextActions: ["Stop unnecessary applications", "Reduce utilization <30%", "Set auto-pay for minimum due"],
      lenderMatch: "Starter partners + secured products",
      confidence: 62,
      eligibility: "Low today, improving",
    };
  }
  if (score < 680) {
    return {
      band: "Near Prime",
      tone: "base",
      summary: "Eligible for select cards and small-ticket loans with guardrails",
      products: [
        { name: "Entry-level Unsecured Card", reason: "Begin unsecured track with controlled limits" },
        { name: "Small-ticket Personal Loan", reason: "Only if EMI fits; avoid over-leverage" },
        { name: "BNPL / Pay-later", reason: "If bureau reporting is strong and timely" },
      ],
      nextActions: ["Keep 2–3 tradelines max", "Never miss due date", "Avoid multiple hard pulls in 30 days"],
      lenderMatch: "Mid-tier NBFCs + select bank programs",
      confidence: 78,
      eligibility: "Moderate today",
    };
  }
  if (score < 740) {
    return {
      band: "Prime",
      tone: "good",
      summary: "Strong eligibility across mainstream products",
      products: [
        { name: "Mainstream Credit Cards", reason: "Higher approval odds and better limits" },
        { name: "Pre-approved Offers", reason: "Lower friction conversion" },
        { name: "Loan Against Assets", reason: "Cheaper credit, better acceptance" },
      ],
      nextActions: ["Optimize mix", "Maintain <25% utilization", "Use pre-approval routes first"],
      lenderMatch: "Top NBFCs + banks",
      confidence: 88,
      eligibility: "High today",
    };
  }
  return {
    band: "Super Prime",
    tone: "good",
    summary: "Best rates and premium products likely",
    products: [
      { name: "Premium Cards", reason: "High approval odds and premium benefits" },
      { name: "Low-rate Loans", reason: "Better pricing and faster sanction" },
      { name: "Wealth + Protection Bundle", reason: "Cross-sell with high trust retention" },
    ],
    nextActions: ["Use eligibility-first workflow", "Bundle protection + savings", "Maintain score with discipline"],
    lenderMatch: "Premium bank programs + preferred lenders",
    confidence: 94,
    eligibility: "Very high today",
  };
}

function ProductMatchingSimulator() {
  const { ref, visible } = useIntersectionVisible();
  const [score, setScore] = useState(650);

  const rec = useMemo(() => getRecommendedProducts(score), [score]);
  const indicatorLeft = useMemo(() => `${((score - 300) / (900 - 300)) * 100}%`, [score]);

  return (
    <div ref={ref} className={`lm-simWrap lm-reveal ${visible ? "is-visible" : ""}`}>
      <div className="lm-simHead">
        <div>
          <div className="lm-kicker">Agent OS Widget</div>
          <h3 className="lm-h3">Product Matching Simulator</h3>
          <p className="lm-text">
            Move the score slider. The Agent OS suggests the best-fit products and the next action to reduce rejections.
          </p>
        </div>

        <div className={`lm-simBadge lm-simBadge--${rec.tone}`}>
          <div className="lm-simBadgeTop">{rec.band}</div>
          <div className="lm-simBadgeBottom">Confidence: {rec.confidence}%</div>
        </div>
      </div>

      <div className="lm-simGrid">
        <div className="lm-simCard">
          <div className="lm-simRow">
            <div className="lm-simLabel">CIBIL Score</div>
            <div className="lm-simScore">{score}</div>
          </div>

          <div className="lm-slider">
            <div className="lm-sliderTrack" aria-hidden="true">
              <div className="lm-sliderFill" style={{ width: indicatorLeft }} />
              <div className="lm-sliderDot" style={{ left: indicatorLeft }} />
            </div>

            <input
              className="lm-range"
              type="range"
              min={300}
              max={900}
              value={score}
              onChange={(e) => setScore(parseInt(e.target.value, 10))}
              aria-label="CIBIL score"
            />

            <div className="lm-sliderMarks">
              <span>300</span>
              <span>600</span>
              <span>700</span>
              <span>900</span>
            </div>
          </div>

          <div className="lm-simSummary">
            <div className="lm-simSummaryTitle">Summary</div>
            <div className="lm-simSummaryText">{rec.summary}</div>
          </div>
        </div>

        <div className="lm-simCard">
          <div className="lm-simSummaryTitle">Recommended Products</div>
          <div className="lm-simList">
            {rec.products.map((p) => (
              <div key={p.name} className="lm-simItem">
                <div className="lm-simItemTop">
                  <div className="lm-simItemName">{p.name}</div>
                  <span className={`lm-chip lm-chip--${rec.tone}`}>{rec.band}</span>
                </div>
                <div className="lm-simItemReason">{p.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEW: Agent dashboard mock below simulator */}
      <AgentDashboardMock rec={rec} score={score} />
    </div>
  );
}

/* -------------------- NEW: Agent Dashboard Mock -------------------- */

function AgentDashboardMock({ rec, score }) {
  const eligibilityPct = useMemo(() => {
    // simple mapping for UI; you’ll replace with real eligibility later
    if (score < 600) return 28;
    if (score < 680) return 52;
    if (score < 740) return 78;
    return 92;
  }, [score]);

  const nextAction = rec.nextActions?.[0] ?? "Follow structured SOP";
  const lenderMatch = rec.lenderMatch ?? "Partner lenders";

  return (
    <div className="lm-dash">
      <div className="lm-dashTop">
        <div>
          <div className="lm-kicker">Agent OS</div>
          <h3 className="lm-h3">Agent Dashboard Mock</h3>
          <p className="lm-text">What agents see: eligibility, next best action, and the best-fit lender lane.</p>
        </div>
        <div className="lm-dashPill">
          Live score: <b>{score}</b>
        </div>
      </div>

      <div className="lm-grid lm-grid--3">
        <div className="lm-card lm-dashCard">
          <div className="lm-dashCardTitle">Eligibility</div>
          <div className="lm-dashBig">{eligibilityPct}%</div>
          <div className="lm-meter">
            <div className="lm-meterFill" style={{ width: `${eligibilityPct}%` }} />
          </div>
          <div className="lm-dashHint">{rec.eligibility}</div>
        </div>

        <div className="lm-card lm-dashCard">
          <div className="lm-dashCardTitle">Next action</div>
          <div className="lm-dashBigSm">{nextAction}</div>
          <div className="lm-dashList">
            {rec.nextActions.slice(0, 3).map((a) => (
              <div key={a} className="lm-dashLine">
                <span className="lm-dot" aria-hidden="true" />
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lm-card lm-dashCard">
          <div className="lm-dashCardTitle">Lender match</div>
          <div className="lm-dashBigSm">{lenderMatch}</div>
          <div className="lm-miniTags">
            <span className="lm-miniTag">Low pull strategy</span>
            <span className="lm-miniTag">High approval lane</span>
            <span className="lm-miniTag">SOP guided</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- NEW: Rejection → Conversion Graph -------------------- */

function RejectionToConversionGraph() {
  const { ref, visible } = useIntersectionVisible();

  // Simple illustrative series; replace later with real funnel improvements
  const data = useMemo(
    () => ({
      rejectionBefore: [92, 94, 95, 93, 95],
      rejectionAfter: [58, 52, 48, 45, 42],
      conversionAfter: [8, 12, 18, 24, 30],
    }),
    []
  );

  const width = 920;
  const height = 260;
  const padding = { left: 48, right: 24, top: 24, bottom: 36 };

  function x(i, n) {
    const span = width - padding.left - padding.right;
    return padding.left + (span * i) / (n - 1);
  }
  function yPct(p) {
    const span = height - padding.top - padding.bottom;
    // y=0 at top
    return padding.top + ((100 - p) * span) / 100;
  }

  function pathFrom(series) {
    const n = series.length;
    const pts = series.map((p, i) => [x(i, n), yPct(p)]);
    // smooth-ish: use quadratic between points
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x1, y1] = pts[i - 1];
      const [x2, y2] = pts[i];
      const cx = (x1 + x2) / 2;
      d += ` Q ${cx} ${y1} ${x2} ${y2}`;
    }
    return { d, pts };
  }

  const before = pathFrom(data.rejectionBefore);
  const after = pathFrom(data.rejectionAfter);
  const conv = pathFrom(data.conversionAfter);

  const months = ["M1", "M2", "M3", "M4", "M5"];

  return (
    <div ref={ref} className={`lm-graphWrap lm-reveal ${visible ? "is-visible" : ""}`}>
      <div className="lm-graphHead">
        <div>
          <div className="lm-kicker">Outcome</div>
          <h3 className="lm-h3">Rejection → Conversion Improvement</h3>
          <p className="lm-text">
            Agent-led eligibility + guided credit building reduces rejection and creates a measurable conversion curve.
          </p>
        </div>
        <div className="lm-legend">
          <span className="lm-legendItem">
            <span className="lm-legendDot lm-legendDot--red" /> Rejection (Before)
          </span>
          <span className="lm-legendItem">
            <span className="lm-legendDot lm-legendDot--blue" /> Rejection (With Agent OS)
          </span>
          <span className="lm-legendItem">
            <span className="lm-legendDot lm-legendDot--mint" /> Conversion (After)
          </span>
        </div>
      </div>

      <div className="lm-graphCard">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={`lm-graph ${visible ? "is-animate" : ""}`}
          role="img"
          aria-label="Rejection to conversion graph"
        >
          {/* Grid lines */}
          {[0, 20, 40, 60, 80, 100].map((p) => (
            <g key={p}>
              <line
                x1={padding.left}
                y1={yPct(p)}
                x2={width - padding.right}
                y2={yPct(p)}
                className="lm-gridLine"
              />
              <text x={12} y={yPct(p) + 4} className="lm-axisLabel">
                {p}%
              </text>
            </g>
          ))}

          {/* X labels */}
          {months.map((m, i) => (
            <text key={m} x={x(i, months.length)} y={height - 12} className="lm-axisLabel" textAnchor="middle">
              {m}
            </text>
          ))}

          {/* Paths */}
          <path d={before.d} className="lm-line lm-line--red" />
          <path d={after.d} className="lm-line lm-line--blue" />
          <path d={conv.d} className="lm-line lm-line--mint" />

          {/* Dots */}
          {before.pts.map((p, idx) => (
            <circle key={`b-${idx}`} cx={p[0]} cy={p[1]} r="4.2" className="lm-dot lm-dot--red" />
          ))}
          {after.pts.map((p, idx) => (
            <circle key={`a-${idx}`} cx={p[0]} cy={p[1]} r="4.2" className="lm-dot lm-dot--blue" />
          ))}
          {conv.pts.map((p, idx) => (
            <circle key={`c-${idx}`} cx={p[0]} cy={p[1]} r="4.2" className="lm-dot lm-dot--mint" />
          ))}

          {/* Callout */}
          <g className="lm-callout">
            <rect x={width - 285} y={22} width={260} height={64} rx={14} className="lm-calloutBox" />
            <text x={width - 270} y={48} className="lm-calloutTitle">
              Target effect
            </text>
            <text x={width - 270} y={70} className="lm-calloutText">
              Rejections ↓, Conversions ↑ via guided journey
            </text>
          </g>
        </svg>

        <div className="lm-graphFoot">
          <div className="lm-graphStat">
            <div className="lm-graphStatNum">95% → 42%</div>
            <div className="lm-graphStatLbl">Rejection reduction (illustrative)</div>
          </div>
          <div className="lm-graphStat">
            <div className="lm-graphStatNum">0% → 30%</div>
            <div className="lm-graphStatLbl">Conversion lift (illustrative)</div>
          </div>
          <div className="lm-graphStat">
            <div className="lm-graphStatNum">4–6 mo</div>
            <div className="lm-graphStatLbl">Credit-builder conversion window</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Timeline / Hub / etc ----------------------------- */

function Timeline() {
  return (
    <div className="lm-timeline">
      <div className="lm-timelineLine" />
      {CONFIG.creditBuilder.journey.map((item, idx) => (
        <TimelineItem key={item.month} item={item} idx={idx} />
      ))}
    </div>
  );
}

function TimelineItem({ item, idx }) {
  const { ref, visible } = useIntersectionVisible();
  const isEven = idx % 2 === 1;

  return (
    <div ref={ref} className={`lm-timelineItem ${isEven ? "is-even" : ""} lm-reveal ${visible ? "is-visible" : ""}`}>
      <div className="lm-timelineMarker" />
      <div className="lm-timelineCard">
        <div className="lm-timelineMonth">{item.month}</div>
        <div className="lm-timelineHeadline">{item.headline}</div>
        <ul className="lm-bullets">
          {item.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        <div className="lm-scoreBlock">
          <div className="lm-scoreTop">
            <span className="lm-scoreLabel">
              Score: <b className={item.progressPct === 100 ? "lm-mint" : "lm-blue"}>{item.score}</b>
            </span>
            <span className="lm-scoreLabel muted">Target: 720</span>
          </div>

          <div className="lm-scoreBar">
            <div className="lm-scoreFill" style={{ width: visible ? `${item.progressPct}%` : "0%" }} aria-hidden="true" />
          </div>
        </div>

        <span className={`lm-badge lm-badge--${item.badge.variant}`}>{item.badge.label}</span>
      </div>
    </div>
  );
}

function HubSpoke() {
  const { ref, visible } = useIntersectionVisible();
  const spokes = useMemo(() => {
    const positions = [
      { top: "0%", left: "50%", transform: "translate(-50%, 0)" },
      { top: "18%", right: "2%" },
      { bottom: "18%", right: "2%" },
      { bottom: "0%", left: "50%", transform: "translate(-50%, 0)" },
      { bottom: "18%", left: "2%" },
      { top: "18%", left: "2%" },
    ];
    return CONFIG.oneRoof.spokes.map((label, i) => ({ label, pos: positions[i] || {} }));
  }, []);

  return (
    <div ref={ref} className={`lm-hubSpoke lm-reveal ${visible ? "is-visible" : ""}`}>
      <div className="lm-hubCenter">
        {CONFIG.oneRoof.hubLabel.split("\n").map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>

      {spokes.map((s) => (
        <div key={s.label} className="lm-spoke" style={s.pos}>
          {s.label}
        </div>
      ))}
    </div>
  );
}

function MarketCards() {
  return (
    <div className="lm-grid lm-grid--3">
      {CONFIG.market.cards.map((c) => (
        <MarketCard key={c.label} card={c} />
      ))}
    </div>
  );
}

function MarketCard({ card }) {
  const { ref, visible } = useIntersectionVisible();
  const count = useCountUp(card.value, visible, 1500);

  return (
    <div ref={ref} className={`lm-card lm-marketCard lm-reveal ${visible ? "is-visible" : ""}`}>
      <div className="lm-marketLabel">{card.label}</div>
      <div className="lm-marketValue">
        {formatNumber(count)}
        {card.suffix}
      </div>
      <div className="lm-marketDesc">{card.desc}</div>
    </div>
  );
}

function PilotCards() {
  return (
    <div className="lm-grid lm-grid--5">
      {CONFIG.pilot.kpis.map((kpi) => (
        <PilotCard key={kpi.label} kpi={kpi} />
      ))}
    </div>
  );
}

function PilotCard({ kpi }) {
  const { ref, visible } = useIntersectionVisible();
  const count = useCountUp(kpi.value, visible, 1400);

  return (
    <div ref={ref} className={`lm-pilotCard lm-reveal ${visible ? "is-visible" : ""}`}>
      <div className="lm-pilotValue">
        {kpi.static ? (
          <>
            {kpi.value}
            {kpi.suffix ?? ""}
          </>
        ) : (
          <>
            {formatNumber(count)}
            {kpi.suffix ?? ""}
          </>
        )}
      </div>
      <div className="lm-pilotLabel">{kpi.label}</div>
    </div>
  );
}

function GTMSteps() {
  return (
    <div className="lm-gtm">
      {CONFIG.gtm.steps.map((s, idx) => (
        <GTMItem key={s.title} step={s} idx={idx} />
      ))}
    </div>
  );
}

function GTMItem({ step, idx }) {
  const { ref, visible } = useIntersectionVisible();
  return (
    <div ref={ref} className={`lm-gtmItem lm-reveal ${visible ? "is-visible" : ""}`}>
      <div className="lm-gtmIcon">{idx + 1}</div>
      <div className="lm-gtmBody">
        <h3 className="lm-h3">{step.title}</h3>
        <p className="lm-text">{step.desc}</p>
      </div>
    </div>
  );
}

function Founders() {
  return (
    <>
      <div className="lm-foundersGrid">
        {CONFIG.founders.people.map((p) => (
          <FounderCard key={p.name} person={p} />
        ))}
      </div>
      <Reveal>
        <div className="lm-founderStory">{CONFIG.founders.story}</div>
      </Reveal>
    </>
  );
}

function FounderCard({ person }) {
  const { ref, visible } = useIntersectionVisible();
  return (
    <div ref={ref} className={`lm-founderCard lm-reveal ${visible ? "is-visible" : ""}`}>
      <div className="lm-founderAvatar">
        {person.img ? <img src={person.img} alt={person.name} /> : <span aria-hidden="true">👤</span>}
      </div>
      <div className="lm-founderName">{person.name}</div>
      <div className="lm-founderOneLiner">{person.oneLiner}</div>
    </div>
  );
}

/* ------------------------------ App ------------------------------ */

export default function App() {
  // subtle network nodes in hero
  const nodes = useMemo(() => {
    const count = 18;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2.8}s`,
      dur: `${2.6 + Math.random() * 1.8}s`,
    }));
  }, []);

  return (
    <div className="lm-root">
      <style>{styles}</style>

      {/* HERO */}
      <section className="lm-hero">
        <div className="lm-heroBg" />
        <div className="lm-heroGridOverlay" />
        <div className="lm-heroGlow" aria-hidden="true" />
        <div className="lm-heroNetwork" aria-hidden="true">
          {nodes.map((n) => (
            <span
              key={n.id}
              className="lm-node"
              style={{ left: n.left, top: n.top, animationDelay: n.delay, animationDuration: n.dur }}
            />
          ))}
        </div>

        <div className="lm-container">
          <div className="lm-heroInner">
            <div className="lm-heroCopy">
              <div className="lm-kicker lm-kicker--hero">Agent-led Credit OS</div>
              <h1 className="lm-h1">{CONFIG.brand.tagline}</h1>
              <p className="lm-heroSub">{CONFIG.brand.subtagline}</p>
              <div className="lm-heroCtas">
                <Button href={CONFIG.brand.primaryCta.href} variant="primary">
                  {CONFIG.brand.primaryCta.label}
                </Button>
                <Button href={CONFIG.brand.secondaryCta.href} variant="secondary">
                  {CONFIG.brand.secondaryCta.label}
                </Button>
              </div>

              <div className="lm-heroMiniRow">
                <div className="lm-miniMetric">
                  <div className="lm-miniMetricTop">150+</div>
                  <div className="lm-miniMetricBot">Products</div>
                </div>
                <div className="lm-miniMetric">
                  <div className="lm-miniMetricTop">4–6 mo</div>
                  <div className="lm-miniMetricBot">Credit builder</div>
                </div>
                <div className="lm-miniMetric">
                  <div className="lm-miniMetricTop">AI + Human</div>
                  <div className="lm-miniMetricBot">Agent support</div>
                </div>
              </div>
            </div>

            <div className="lm-heroCard" aria-hidden="true">
              <div className="lm-heroCardTitle">Agent OS Preview</div>
              <div className="lm-heroCardRow">
                <div className="lm-heroChip">Eligibility</div>
                <div className="lm-heroChip">Next Action</div>
                <div className="lm-heroChip">Lender Match</div>
              </div>
              <div className="lm-heroPulseBar" />
              <div className="lm-heroCardHint">Reduce rejections by matching the right product first.</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <Section id="problem" variant="white">
        <Reveal>
          <SectionHeader
            title="The Broken System"
            subtitle="DSAs are selling blind. Customers are getting rejected. Trust is breaking."
          />
        </Reveal>
        <div className="lm-grid lm-grid--3">
          {CONFIG.stats.map((s) => (
            <StatCard key={s.key} value={s.value} suffix={s.suffix} label={s.label} display={s.display} />
          ))}
        </div>
      </Section>

      {/* FUNNEL */}
      <Section id="funnel" variant="slate">
        <Reveal>
          <SectionHeader title={CONFIG.funnel.title} subtitle={CONFIG.funnel.subtitle} />
        </Reveal>
        <div className="lm-funnel">
          {CONFIG.funnel.stages.map((stage, idx) => (
            <FunnelStage key={stage.key} stage={stage} index={idx} />
          ))}
        </div>
      </Section>

      {/* NEW: Graph right after funnel */}
      <Section id="outcomes" variant="white">
        <RejectionToConversionGraph />
      </Section>

      {/* NEW: Product matching simulator + dashboard */}
      <Section id="agent-os" variant="slate">
        <Reveal>
          <SectionHeader title="Agent OS" subtitle="Turn DSA distribution into predictable conversions with guided workflows." />
        </Reveal>
        <ProductMatchingSimulator />
      </Section>

      {/* COMPETITORS */}
      <Section id="competition" variant="white">
        <Reveal>
          <SectionHeader title={CONFIG.competitors.title} subtitle={CONFIG.competitors.subtitle} />
        </Reveal>

        <div className="lm-grid lm-grid--2">
          {CONFIG.competitors.cards.map((c) => (
            <Reveal key={c.name}>
              <div className="lm-card lm-competitorCard">
                <div className="lm-competitorTop">
                  <div className="lm-competitorName">{c.name}</div>
                  <span className="lm-pill">{c.model}</span>
                </div>
                <ul className="lm-xlist">
                  {c.issues.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="lm-diffCard">
            <div className="lm-diffTitle">{CONFIG.competitors.differentiationTitle}</div>
            <div className="lm-diffLine">{CONFIG.competitors.differentiationLine}</div>
            <div className="lm-diffHint">{CONFIG.competitors.inspirationLine}</div>
          </div>
        </Reveal>
      </Section>

      {/* SOLUTION */}
      <Section id="solution" variant="slate">
        <Reveal>
          <SectionHeader title={CONFIG.solution.title} subtitle={CONFIG.solution.subtitle} />
        </Reveal>
        <Flow />
      </Section>

      {/* CREDIT BUILDER */}
      <Section id="credit-builder" variant="white">
        <Reveal>
          <SectionHeader title={CONFIG.creditBuilder.title} subtitle={CONFIG.creditBuilder.subtitle} />
        </Reveal>
        <Timeline />
      </Section>

      {/* ONE ROOF */}
      <Section id="one-roof" variant="slate">
        <Reveal>
          <SectionHeader title={CONFIG.oneRoof.title} subtitle={CONFIG.oneRoof.subtitle} />
        </Reveal>
        <HubSpoke />
        <Reveal>
          <div className="lm-quote">{CONFIG.oneRoof.quote}</div>
        </Reveal>
      </Section>

      {/* MARKET */}
      <Section id="market" variant="white">
        <Reveal>
          <SectionHeader title={CONFIG.market.title} subtitle={CONFIG.market.subtitle} />
        </Reveal>
        <MarketCards />
      </Section>

      {/* PILOT */}
      <Section id="pilot" variant="slate">
        <Reveal>
          <SectionHeader title={CONFIG.pilot.title} subtitle={CONFIG.pilot.subtitle} />
        </Reveal>
        <PilotCards />
        <Reveal>
          <div className="lm-note">{CONFIG.pilot.note}</div>
        </Reveal>
      </Section>

      {/* GTM */}
      <Section id="gtm" variant="white">
        <Reveal>
          <SectionHeader title={CONFIG.gtm.title} subtitle={CONFIG.gtm.subtitle} />
        </Reveal>
        <GTMSteps />
      </Section>

      {/* ABOUT */}
      <Section id="about" variant="slate">
        <Reveal>
          <SectionHeader title={CONFIG.founders.title} subtitle={CONFIG.founders.subtitle} />
        </Reveal>
        <Founders />
      </Section>

      {/* CLOSING */}
      <section id="contact" className="lm-closing">
        <div className="lm-container">
          <Reveal>
            <h2 className="lm-h2 lm-closingTitle">
              {CONFIG.closing.headline.split("\n").map((l) => (
                <span key={l} className="lm-block">
                  {l}
                </span>
              ))}
            </h2>
          </Reveal>
          <Reveal>
            <div className="lm-closingCtas">
              <Button href={CONFIG.closing.primaryCta.href} variant="primary">
                {CONFIG.closing.primaryCta.label}
              </Button>
              <Button href={CONFIG.closing.secondaryCta.href} variant="secondary">
                {CONFIG.closing.secondaryCta.label}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lm-footer">
        <div className="lm-container">
          <div className="lm-footerTop">
            <div className="lm-footerCopy">{CONFIG.footer.copyright}</div>
            <nav className="lm-footerLinks">
              {CONFIG.footer.links.map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------ Styles ------------------------------ */

const styles = `
:root{
  --royal-blue:#1E3A8A;
  --royal-blue-dark:#0B1222;
  --royal-blue-ink:#0F1B35;
  --royal-blue-light:#3B82F6;
  --royal-blue-glow: rgba(59,130,246,0.35);

  --slate-50:#F8FAFC;
  --slate-100:#F1F5F9;
  --slate-200:#E2E8F0;
  --slate-300:#CBD5E1;
  --slate-600:#475569;
  --slate-700:#334155;
  --slate-900:#0F172A;

  --mint:#10B981;
  --mint-700:#059669;
  --mint-light:#D1FAE5;

  --red:#EF4444;

  --container:1280px;
  --radius:18px;
  --shadow:0 12px 24px rgba(15, 23, 42, 0.08);
  --shadowBlue:0 18px 44px rgba(30,58,138,0.22);
  --shadowDeep:0 22px 66px rgba(15,23,42,0.18);

  --ring: 0 0 0 6px rgba(59,130,246,0.18);
}

*{ box-sizing:border-box; }
html,body{ height:100%; }
body{
  margin:0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
  background: var(--slate-50);
  color: var(--slate-900);
  line-height:1.6;
}
a{ color:inherit; }
.lm-root{ width:100%; overflow-x:hidden; }
.lm-container{ max-width:var(--container); margin:0 auto; padding:0 24px; }

.lm-kicker{
  display:inline-flex;
  gap:8px;
  align-items:center;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(59,130,246,0.10);
  border: 1px solid rgba(59,130,246,0.20);
  color: var(--royal-blue);
  font-weight: 850;
  letter-spacing: .06em;
  text-transform: uppercase;
  font-size: .78rem;
}
.lm-kicker--hero{
  background: rgba(255,255,255,0.10);
  border-color: rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.92);
}

.lm-h1{
  font-size: clamp(2.45rem, 5vw, 4.6rem);
  letter-spacing: -0.03em;
  line-height:1.05;
  margin: 14px 0 18px;
  font-weight: 900;
}
.lm-h2{
  font-size: clamp(1.9rem, 4vw, 3.2rem);
  letter-spacing: -0.02em;
  line-height:1.12;
  margin:0 0 12px;
  font-weight: 900;
}
.lm-h3{
  font-size: clamp(1.18rem, 2.2vw, 1.55rem);
  margin:0 0 10px;
  font-weight: 900;
}
.lm-subtitle{
  margin:0;
  font-size: 1.1rem;
  color: var(--slate-600);
  font-weight: 520;
}
.lm-text{ margin:0; color: var(--slate-600); }
.lm-blue{ color: var(--royal-blue); }
.lm-mint{ color: var(--mint); }
.muted{ color: var(--slate-600); }
.lm-block{ display:block; }

.lm-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding: 14px 22px;
  border-radius: 14px;
  text-decoration:none;
  font-weight: 900;
  transition: transform .2s ease, box-shadow .2s ease, background .2s ease, color .2s ease, border-color .2s ease;
  border: 2px solid transparent;
  min-width: 180px;
  will-change: transform;
}
.lm-btn--primary{
  background: linear-gradient(135deg, var(--royal-blue-light), var(--royal-blue));
  color:white;
  box-shadow: 0 16px 30px rgba(30,58,138,0.25);
}
.lm-btn--primary:hover{ transform: translateY(-2px); box-shadow: 0 22px 52px rgba(30,58,138,0.33); }
.lm-btn--secondary{
  background: rgba(255,255,255,0.96);
  color: var(--royal-blue);
  border-color: rgba(255,255,255,0.38);
  box-shadow: 0 10px 20px rgba(0,0,0,0.10);
}
.lm-btn--secondary:hover{ transform: translateY(-2px); box-shadow: 0 16px 36px rgba(0,0,0,0.14); }

.lm-section{ padding: 110px 0; }
.lm-section--white{ background: white; }
.lm-section--slate{ background: linear-gradient(180deg, var(--slate-50), #ffffff); }

.lm-sectionHeader{ text-align:center; margin-bottom: 70px; }
.lm-sectionHeader--left{ text-align:left; }

.lm-grid{ display:grid; gap: 26px; }
.lm-grid--2{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
.lm-grid--3{ grid-template-columns: repeat(3, minmax(0, 1fr)); }
.lm-grid--5{ grid-template-columns: repeat(5, minmax(0, 1fr)); }

.lm-card{
  background: rgba(248,250,252,0.9);
  border: 1px solid rgba(203,213,225,0.8);
  border-radius: var(--radius);
  padding: 34px;
  box-shadow: none;
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}
.lm-card:hover{ transform: translateY(-3px); box-shadow: var(--shadow); border-color: rgba(59,130,246,0.22); }

.lm-reveal{ opacity:0; transform: translateY(22px); transition: opacity .75s ease, transform .75s ease; }
.lm-reveal.is-visible{ opacity:1; transform: translateY(0); }

/* HERO */
.lm-hero{
  position:relative;
  min-height: 92vh;
  display:flex;
  align-items:center;
  background:
    radial-gradient(1200px 700px at 15% 20%, rgba(59,130,246,0.22), transparent 65%),
    radial-gradient(900px 520px at 85% 35%, rgba(16,185,129,0.16), transparent 62%),
    linear-gradient(135deg, var(--royal-blue) 0%, var(--royal-blue-dark) 100%);
  color:white;
  overflow:hidden;
}
.lm-heroBg{
  position:absolute; inset:0;
  opacity:0.14;
  background-image:
    repeating-linear-gradient(45deg, transparent, transparent 38px, rgba(255,255,255,.06) 38px, rgba(255,255,255,.06) 76px);
}
.lm-heroGridOverlay{
  position:absolute; inset:0;
  opacity:0.10;
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,.22) 1px, transparent 0);
  background-size: 34px 34px;
}
.lm-heroGlow{
  position:absolute;
  inset:-200px;
  background: radial-gradient(circle at 40% 30%, rgba(59,130,246,0.18), transparent 60%);
  filter: blur(18px);
}
.lm-heroNetwork{
  position:absolute; inset:0;
  pointer-events:none;
  opacity:0.55;
}
.lm-node{
  position:absolute;
  width:8px; height:8px;
  border-radius:999px;
  background:white;
  opacity:0.55;
  animation: lm-pulse 3.2s ease-in-out infinite;
}
@keyframes lm-pulse{
  0%,100%{ transform: scale(1); opacity:0.18; }
  50%{ transform: scale(1.8); opacity:0.72; }
}
.lm-heroInner{
  position:relative;
  padding: 86px 0;
  display:grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 28px;
  align-items:center;
}
.lm-heroCopy{ max-width: 760px; }
.lm-heroSub{
  margin: 10px 0 28px;
  font-size: clamp(1.1rem, 2vw, 1.45rem);
  color: rgba(255,255,255,0.88);
  font-weight: 650;
}
.lm-heroCtas{ display:flex; gap: 14px; flex-wrap:wrap; }

.lm-heroMiniRow{
  display:flex;
  gap: 12px;
  margin-top: 26px;
  flex-wrap:wrap;
}
.lm-miniMetric{
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 14px;
  padding: 12px 14px;
  min-width: 150px;
  backdrop-filter: blur(10px);
}
.lm-miniMetricTop{
  font-weight: 950;
  letter-spacing: -0.02em;
  font-size: 1.1rem;
}
.lm-miniMetricBot{
  color: rgba(255,255,255,0.82);
  font-weight: 700;
  font-size: .92rem;
}

.lm-heroCard{
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 22px;
  padding: 22px;
  backdrop-filter: blur(14px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  position: relative;
  overflow:hidden;
}
.lm-heroCard::before{
  content:"";
  position:absolute; inset:-40%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.16), transparent 60%);
  transform: rotate(14deg);
}
.lm-heroCardTitle{
  position:relative;
  font-weight: 950;
  letter-spacing: -0.01em;
  font-size: 1.05rem;
  margin-bottom: 14px;
}
.lm-heroCardRow{
  position:relative;
  display:flex;
  gap: 10px;
  flex-wrap:wrap;
}
.lm-heroChip{
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 999px;
  padding: 10px 12px;
  font-weight: 850;
  font-size: .9rem;
}
.lm-heroPulseBar{
  position:relative;
  height: 10px;
  border-radius: 999px;
  margin-top: 18px;
  background: rgba(255,255,255,0.16);
  overflow:hidden;
}
.lm-heroPulseBar::after{
  content:"";
  position:absolute; inset:0;
  width: 45%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent);
  animation: lm-sheen 1.8s ease-in-out infinite;
}
@keyframes lm-sheen{
  0%{ transform: translateX(-120%); opacity:.2; }
  50%{ opacity:.9; }
  100%{ transform: translateX(220%); opacity:.2; }
}
.lm-heroCardHint{
  position:relative;
  margin-top: 14px;
  color: rgba(255,255,255,0.82);
  font-weight: 700;
}

/* STAT */
.lm-statCard{ text-align:center; }
.lm-statNumber{
  font-size: 3.1rem;
  font-weight: 950;
  letter-spacing: -0.03em;
  color: var(--royal-blue);
  margin-bottom: 8px;
}
.lm-statLabel{ color: var(--slate-700); font-weight: 800; }

/* Funnel: full width shell, inner fill controls % */
.lm-funnel {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.lm-funnelBarShell {
  position: relative;
  width: 100%;
  height: 82px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadowBlue);
  background: rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(59,130,246,0.14);
  transform-origin: center;
}
.lm-funnelBarShell:hover{ box-shadow: var(--shadowDeep); transform: translateY(-1px); transition: .2s ease; }

.lm-funnelBarShell--base .lm-funnelFill {
  background: linear-gradient(135deg, var(--royal-blue-light), var(--royal-blue));
}
.lm-funnelBarShell--rejected .lm-funnelFill {
  background: linear-gradient(135deg, var(--red), #dc2626);
}
.lm-funnelBarShell--approved .lm-funnelFill {
  background: linear-gradient(135deg, var(--mint), var(--mint-700));
}

.lm-funnelFill {
  position: absolute;
  inset: 0 auto 0 0;
  height: 100%;
  width: 0%;
  transition: width 1.1s cubic-bezier(.2,.9,.2,1);
}
.lm-funnelSheen{
  position:absolute;
  inset:0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  transform: translateX(-120%);
  animation: lm-sheen2 2.2s ease-in-out infinite;
  pointer-events:none;
}
@keyframes lm-sheen2{
  0%{ transform: translateX(-120%); opacity:.2; }
  50%{ opacity:.7; }
  100%{ transform: translateX(220%); opacity:.2; }
}

.lm-funnelContent {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 22px;
  color: white;
}

.lm-funnelLabel {
  font-weight: 950;
  font-size: 1.1rem;
  line-height: 1.1;
  max-width: 70%;
  white-space: normal;
}

.lm-funnelValue {
  font-weight: 950;
  font-size: 1.6rem;
  white-space: nowrap;
}

@media (max-width: 560px) {
  .lm-funnelBarShell { height: 98px; }
  .lm-funnelContent {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 14px 16px;
    gap: 6px;
  }
  .lm-funnelLabel { max-width: 100%; font-size: 1.05rem; }
  .lm-funnelValue { font-size: 1.4rem; }
}

/* COMPETITORS */
.lm-competitorCard{ background:white; border:2px solid rgba(203,213,225,0.9); }
.lm-competitorTop{ display:flex; align-items:center; justify-content:space-between; gap: 12px; margin-bottom: 14px; }
.lm-competitorName{ font-size: 1.35rem; font-weight: 950; color: var(--slate-700); }
.lm-pill{
  display:inline-flex;
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--slate-100);
  color: var(--slate-600);
  font-weight: 900;
  font-size: .9rem;
}
.lm-xlist{ list-style:none; padding:0; margin: 18px 0 0; }
.lm-xlist li{
  position:relative;
  padding-left: 28px;
  margin: 10px 0;
  color: var(--slate-600);
  font-weight: 800;
}
.lm-xlist li::before{
  content: "✕";
  position:absolute; left:0; top:0;
  color: var(--red);
  font-weight: 950;
}

.lm-diffCard{
  max-width: 820px;
  margin: 54px auto 0;
  background: linear-gradient(135deg, rgba(16,185,129,0.14), rgba(59,130,246,0.10));
  border: 1px solid rgba(59,130,246,0.18);
  border-radius: var(--radius);
  padding: 34px;
  text-align:center;
  box-shadow: var(--shadow);
}
.lm-diffTitle{ font-weight: 950; color: #047857; font-size: 1.2rem; margin-bottom: 10px; }
.lm-diffLine{ font-weight: 950; font-size: 1.15rem; color: var(--slate-900); }
.lm-diffHint{ margin-top: 10px; color: var(--slate-600); font-weight: 750; }

/* FLOW */
.lm-flow{
  display:flex; flex-wrap:wrap;
  align-items:center; justify-content:center;
  gap: 16px;
  margin-top: 24px;
}
.lm-flowStep{
  min-width: 220px;
  background: rgba(255,255,255,0.9);
  border: 1px solid rgba(59,130,246,0.22);
  border-radius: var(--radius);
  padding: 26px;
  text-align:center;
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}
.lm-flowStep:hover{ transform: translateY(-2px) scale(1.02); box-shadow: var(--shadowBlue); border-color: rgba(16,185,129,0.28); }
.lm-flowNum{
  width: 38px; height:38px;
  border-radius:999px;
  background: linear-gradient(135deg, var(--royal-blue-light), var(--royal-blue));
  color:white;
  font-weight: 950;
  display:flex; align-items:center; justify-content:center;
  margin: 0 auto 12px;
  box-shadow: 0 14px 30px rgba(30,58,138,0.22);
}
.lm-flowTitle{ font-weight: 950; color: var(--slate-900); }
.lm-flowDesc{ color: var(--slate-600); font-weight: 750; font-size: .95rem; }
.lm-flowArrow{ font-size: 2rem; color: var(--royal-blue); opacity:.7; }

/* TIMELINE */
.lm-timeline{
  position:relative;
  max-width: 980px;
  margin: 0 auto;
  padding: 10px 0;
}
.lm-timelineLine{
  position:absolute; top:0; bottom:0; left:50%;
  width: 4px;
  transform: translateX(-50%);
  background: var(--slate-200);
  border-radius:999px;
}
.lm-timelineItem{ position:relative; display:flex; margin: 0 0 54px; }
.lm-timelineItem.is-even{ flex-direction: row-reverse; }
.lm-timelineMarker{
  position:absolute;
  left:50%;
  top: 34px;
  transform: translateX(-50%);
  width: 22px; height:22px;
  border-radius:999px;
  background: linear-gradient(135deg, var(--royal-blue-light), var(--royal-blue));
  border: 4px solid white;
  box-shadow: 0 0 0 4px var(--slate-200);
}
.lm-timelineCard{
  width: 46%;
  background: white;
  border-radius: var(--radius);
  padding: 28px;
  box-shadow: var(--shadow);
  border: 1px solid rgba(203,213,225,0.75);
}
.lm-timelineMonth{ font-weight: 950; color: var(--royal-blue); font-size: 1.2rem; }
.lm-timelineHeadline{ margin-top: 6px; font-weight: 950; font-size: 1.05rem; color: var(--slate-900); }
.lm-bullets{ margin: 14px 0 0; padding-left: 18px; color: var(--slate-600); font-weight: 750; }
.lm-bullets li{ margin: 8px 0; }

.lm-scoreBlock{ margin-top: 18px; }
.lm-scoreTop{ display:flex; justify-content:space-between; gap: 12px; }
.lm-scoreLabel{ font-weight: 850; }
.lm-scoreBar{
  height: 10px;
  background: var(--slate-200);
  border-radius:999px;
  overflow:hidden;
  margin-top: 10px;
}
.lm-scoreFill{
  height:100%;
  border-radius:999px;
  background: linear-gradient(90deg, var(--royal-blue), var(--mint));
  transition: width 1.2s cubic-bezier(.2,.9,.2,1);
}
.lm-badge{
  display:inline-flex;
  padding: 8px 12px;
  border-radius:999px;
  font-weight: 900;
  font-size: .85rem;
  margin-top: 16px;
}
.lm-badge--mintLight{ background: var(--mint-light); color: #047857; }
.lm-badge--mintSolid{ background: var(--mint); color: white; }

/* HUB SPOKE */
.lm-hubSpoke{
  position:relative;
  max-width: 780px;
  height: 520px;
  margin: 18px auto 20px;
}
.lm-hubCenter{
  position:absolute;
  left:50%; top:50%;
  transform: translate(-50%,-50%);
  width: 190px; height:190px;
  border-radius:999px;
  background: linear-gradient(135deg, var(--royal-blue-light), var(--royal-blue));
  color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
  font-weight: 950;
  white-space:pre-line;
  box-shadow: 0 18px 38px rgba(30,58,138,0.30);
  z-index: 2;
}
.lm-spoke{
  position:absolute;
  width: 150px; height:150px;
  border-radius:999px;
  background: white;
  border: 2px solid rgba(59,130,246,0.25);
  display:flex; align-items:center; justify-content:center;
  text-align:center;
  font-weight: 900;
  color: var(--slate-700);
  padding: 18px;
  box-shadow: 0 10px 22px rgba(15,23,42,0.10);
  transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
}
.lm-spoke:hover{ transform: translateY(-2px) scale(1.05); border-color: rgba(16,185,129,0.45); box-shadow: var(--shadow); }
.lm-quote{
  max-width: 860px;
  margin: 0 auto;
  text-align:center;
  font-size: 1.15rem;
  color: var(--slate-700);
  font-weight: 850;
}

/* MARKET */
.lm-marketCard{ background:white; border:1px solid rgba(203,213,225,0.8); text-align:center; position:relative; overflow:hidden; }
.lm-marketCard::before{
  content:"";
  position:absolute;
  inset:0;
  background: radial-gradient(600px 240px at 20% 0%, rgba(59,130,246,0.08), transparent 55%);
  pointer-events:none;
}
.lm-marketLabel{
  position:relative;
  font-size:.95rem;
  letter-spacing: .12em;
  text-transform:uppercase;
  color: var(--slate-600);
  font-weight: 950;
  margin-bottom: 12px;
}
.lm-marketValue{
  position:relative;
  font-size: 2.8rem;
  font-weight: 950;
  color: var(--royal-blue);
  letter-spacing:-0.03em;
}
.lm-marketDesc{ position:relative; margin-top: 12px; color: var(--slate-600); font-weight: 750; }

/* PILOT */
.lm-pilotCard{
  background: linear-gradient(135deg, var(--royal-blue), var(--royal-blue-ink));
  border-radius: var(--radius);
  padding: 30px;
  color:white;
  text-align:center;
  box-shadow: var(--shadowBlue);
  border: 1px solid rgba(255,255,255,0.10);
  transition: transform .2s ease, box-shadow .2s ease;
}
.lm-pilotCard:hover{ transform: translateY(-3px); box-shadow: 0 22px 66px rgba(30,58,138,0.30); }
.lm-pilotValue{ font-size: 2.5rem; font-weight: 950; letter-spacing:-0.03em; margin-bottom: 10px; }
.lm-pilotLabel{ font-weight: 800; opacity: .95; }
.lm-note{
  margin: 34px auto 0;
  max-width: 980px;
  padding: 18px 18px;
  border-left: 4px solid var(--royal-blue);
  border-radius: 12px;
  background: var(--slate-100);
  color: var(--slate-700);
  font-weight: 750;
}

/* GTM */
.lm-gtm{ max-width: 920px; margin: 0 auto; display:flex; flex-direction:column; gap: 22px; }
.lm-gtmItem{ display:flex; gap: 18px; align-items:flex-start; }
.lm-gtmIcon{
  width: 54px; height:54px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--royal-blue-light), var(--royal-blue));
  color:white;
  display:flex; align-items:center; justify-content:center;
  font-weight: 950;
  box-shadow: 0 18px 44px rgba(30,58,138,0.22);
}
.lm-gtmBody{ padding-top: 2px; }

/* FOUNDERS */
.lm-foundersGrid{
  display:grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 34px;
  max-width: 980px;
  margin: 0 auto 34px;
}
.lm-founderCard{ text-align:center; }
.lm-founderAvatar{
  width: 190px; height: 190px;
  border-radius: 999px;
  background: var(--slate-200);
  margin: 0 auto 18px;
  border: 6px solid rgba(255,255,255,0.9);
  box-shadow: var(--shadow);
  overflow:hidden;
  display:flex; align-items:center; justify-content:center;
  font-size: 3.2rem;
  color: rgba(51,65,85,0.45);
}
.lm-founderAvatar img{ width:100%; height:100%; object-fit:cover; }
.lm-founderName{ font-size: 1.25rem; font-weight: 950; color: var(--royal-blue); }
.lm-founderOneLiner{ color: var(--slate-600); font-weight: 850; margin-top: 6px; }

.lm-founderStory{
  max-width: 980px;
  margin: 0 auto;
  padding: 30px;
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(59,130,246,0.15);
  border-left: 6px solid var(--royal-blue);
  border-radius: var(--radius);
  color: var(--slate-700);
  font-size: 1.1rem;
  font-weight: 800;
}

/* CLOSING */
.lm-closing{
  background:
    radial-gradient(900px 420px at 20% 20%, rgba(59,130,246,0.22), transparent 62%),
    radial-gradient(700px 380px at 85% 60%, rgba(16,185,129,0.16), transparent 60%),
    linear-gradient(135deg, var(--royal-blue-ink), var(--royal-blue));
  color:white;
  padding: 100px 0;
  text-align:center;
}
.lm-closingTitle{ color:white; margin:0 0 28px; }
.lm-closingCtas{ display:flex; gap: 14px; justify-content:center; flex-wrap:wrap; }

/* FOOTER */
.lm-footer{
  background: var(--slate-900);
  color: rgba(203,213,225,0.95);
  padding: 52px 0;
}
.lm-footerTop{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 18px;
  flex-wrap:wrap;
}
.lm-footerLinks{ display:flex; gap: 18px; flex-wrap:wrap; }
.lm-footerLinks a{ text-decoration:none; color: rgba(203,213,225,0.95); font-weight: 850; }
.lm-footerLinks a:hover{ color:white; }

/* ---------------- NEW: Graph ---------------- */
.lm-graphWrap{ }
.lm-graphHead{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap: 18px;
  flex-wrap:wrap;
  margin-bottom: 18px;
}
.lm-legend{ display:flex; gap: 14px; flex-wrap:wrap; }
.lm-legendItem{ display:flex; align-items:center; gap: 8px; color: var(--slate-700); font-weight: 850; }
.lm-legendDot{ width: 10px; height: 10px; border-radius: 999px; display:inline-block; }
.lm-legendDot--red{ background: var(--red); }
.lm-legendDot--blue{ background: var(--royal-blue); }
.lm-legendDot--mint{ background: var(--mint); }

.lm-graphCard{
  background: white;
  border: 1px solid rgba(203,213,225,0.8);
  border-radius: var(--radius);
  padding: 18px;
  box-shadow: var(--shadow);
  overflow:hidden;
}
.lm-graph{ width: 100%; height: auto; display:block; }
.lm-gridLine{ stroke: rgba(203,213,225,0.75); stroke-width: 1; }
.lm-axisLabel{ fill: rgba(71,85,105,0.9); font-size: 12px; font-weight: 800; }

.lm-line{
  fill: none;
  stroke-width: 4.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.10));
}
.lm-line--red{ stroke: rgba(239,68,68,0.92); }
.lm-line--blue{ stroke: rgba(30,58,138,0.95); }
.lm-line--mint{ stroke: rgba(16,185,129,0.95); }

.lm-dot{ opacity: 0; transform: scale(0.6); transform-origin: center; }
.lm-dot--red{ fill: rgba(239,68,68,0.95); }
.lm-dot--blue{ fill: rgba(30,58,138,0.95); }
.lm-dot--mint{ fill: rgba(16,185,129,0.95); }

.lm-calloutBox{
  fill: rgba(15,23,42,0.04);
  stroke: rgba(59,130,246,0.18);
  stroke-width: 1.2;
}
.lm-calloutTitle{ fill: rgba(15,23,42,0.88); font-weight: 950; font-size: 14px; }
.lm-calloutText{ fill: rgba(71,85,105,0.95); font-weight: 800; font-size: 12px; }

.lm-graph.is-animate .lm-line{
  animation: lm-draw 1.6s cubic-bezier(.2,.9,.2,1) forwards;
}
.lm-graph.is-animate .lm-line--blue{ animation-delay: .12s; }
.lm-graph.is-animate .lm-line--mint{ animation-delay: .22s; }
@keyframes lm-draw{
  to{ stroke-dashoffset: 0; }
}
.lm-graph.is-animate .lm-dot{
  animation: lm-pop .7s ease forwards;
}
.lm-graph.is-animate .lm-dot--red{ animation-delay: .55s; }
.lm-graph.is-animate .lm-dot--blue{ animation-delay: .65s; }
.lm-graph.is-animate .lm-dot--mint{ animation-delay: .75s; }
@keyframes lm-pop{
  to{ opacity: 1; transform: scale(1); }
}

.lm-graphFoot{
  display:grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 12px;
  margin-top: 14px;
}
.lm-graphStat{
  background: rgba(248,250,252,0.85);
  border: 1px solid rgba(203,213,225,0.75);
  border-radius: 14px;
  padding: 12px 14px;
}
.lm-graphStatNum{ font-weight: 950; color: var(--slate-900); letter-spacing:-0.02em; }
.lm-graphStatLbl{ color: var(--slate-600); font-weight: 800; font-size: .92rem; margin-top: 4px; }

/* ---------------- NEW: Simulator + Dashboard ---------------- */
.lm-simWrap{
  background: rgba(255,255,255,0.65);
  border: 1px solid rgba(59,130,246,0.14);
  border-radius: 22px;
  padding: 22px;
  box-shadow: var(--shadow);
}
.lm-simHead{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap: 14px;
  flex-wrap:wrap;
  margin-bottom: 16px;
}
.lm-simBadge{
  min-width: 220px;
  border-radius: 18px;
  padding: 14px 14px;
  border: 1px solid rgba(203,213,225,0.7);
  background: white;
  box-shadow: var(--shadow);
}
.lm-simBadge--warn{ border-color: rgba(239,68,68,0.22); box-shadow: 0 18px 44px rgba(239,68,68,0.10); }
.lm-simBadge--base{ border-color: rgba(59,130,246,0.20); box-shadow: 0 18px 44px rgba(59,130,246,0.10); }
.lm-simBadge--good{ border-color: rgba(16,185,129,0.22); box-shadow: 0 18px 44px rgba(16,185,129,0.10); }
.lm-simBadgeTop{ font-weight: 950; color: var(--slate-900); }
.lm-simBadgeBottom{ margin-top: 6px; font-weight: 850; color: var(--slate-600); }

.lm-simGrid{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.lm-simCard{
  background: white;
  border: 1px solid rgba(203,213,225,0.75);
  border-radius: 18px;
  padding: 16px;
  box-shadow: var(--shadow);
}
.lm-simRow{ display:flex; justify-content:space-between; gap: 10px; align-items:baseline; }
.lm-simLabel{ color: var(--slate-600); font-weight: 900; }
.lm-simScore{ font-weight: 950; font-size: 1.6rem; letter-spacing:-0.02em; color: var(--royal-blue); }

.lm-slider{ margin-top: 10px; }
.lm-sliderTrack{
  position: relative;
  height: 10px;
  border-radius: 999px;
  background: rgba(203,213,225,0.75);
  overflow:hidden;
}
.lm-sliderFill{
  position:absolute; left:0; top:0; bottom:0;
  width: 30%;
  background: linear-gradient(90deg, var(--red), var(--royal-blue-light), var(--mint));
  border-radius: 999px;
}
.lm-sliderDot{
  position:absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 18px; height: 18px;
  border-radius: 999px;
  background: white;
  border: 2px solid rgba(59,130,246,0.55);
  box-shadow: 0 12px 24px rgba(0,0,0,0.12);
}
.lm-range{
  width: 100%;
  margin-top: 10px;
  appearance: none;
  height: 28px;
  background: transparent;
}
.lm-range::-webkit-slider-thumb{
  appearance:none;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: white;
  border: 2px solid rgba(59,130,246,0.65);
  box-shadow: 0 14px 30px rgba(0,0,0,0.14);
  cursor: pointer;
}
.lm-range::-moz-range-thumb{
  width: 22px; height: 22px; border-radius: 999px;
  background: white; border: 2px solid rgba(59,130,246,0.65);
  box-shadow: 0 14px 30px rgba(0,0,0,0.14);
  cursor:pointer;
}
.lm-sliderMarks{
  display:flex; justify-content:space-between;
  font-weight: 850; color: var(--slate-600);
  font-size: .9rem;
  margin-top: 2px;
}
.lm-simSummary{ margin-top: 14px; }
.lm-simSummaryTitle{ font-weight: 950; color: var(--slate-900); margin-bottom: 6px; }
.lm-simSummaryText{ color: var(--slate-600); font-weight: 800; }

.lm-simList{ display:flex; flex-direction:column; gap: 10px; margin-top: 10px; }
.lm-simItem{
  background: rgba(248,250,252,0.9);
  border: 1px solid rgba(203,213,225,0.75);
  border-radius: 14px;
  padding: 12px;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.lm-simItem:hover{ transform: translateY(-2px); box-shadow: var(--shadow); border-color: rgba(59,130,246,0.22); }
.lm-simItemTop{ display:flex; justify-content:space-between; gap: 10px; align-items:center; }
.lm-simItemName{ font-weight: 950; color: var(--slate-900); }
.lm-simItemReason{ margin-top: 4px; color: var(--slate-600); font-weight: 800; font-size: .95rem; }

.lm-chip{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 950;
  font-size: .78rem;
  border: 1px solid rgba(203,213,225,0.75);
}
.lm-chip--warn{ background: rgba(239,68,68,0.10); color: #991B1B; border-color: rgba(239,68,68,0.22); }
.lm-chip--base{ background: rgba(59,130,246,0.10); color: #1D4ED8; border-color: rgba(59,130,246,0.22); }
.lm-chip--good{ background: rgba(16,185,129,0.12); color: #047857; border-color: rgba(16,185,129,0.22); }

/* Dashboard mock */
.lm-dash{ margin-top: 14px; }
.lm-dashTop{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap: 12px;
  flex-wrap:wrap;
  margin: 10px 0 14px;
}
.lm-dashPill{
  background: rgba(255,255,255,0.9);
  border: 1px solid rgba(203,213,225,0.75);
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 900;
  box-shadow: var(--shadow);
}
.lm-dashCard{ background: white; border: 1px solid rgba(203,213,225,0.75); }
.lm-dashCardTitle{ font-weight: 950; color: var(--slate-600); text-transform: uppercase; letter-spacing:.08em; font-size:.82rem; }
.lm-dashBig{ font-size: 2.6rem; font-weight: 950; letter-spacing:-0.03em; margin-top: 10px; color: var(--royal-blue); }
.lm-dashBigSm{ font-size: 1.15rem; font-weight: 950; letter-spacing:-0.01em; margin-top: 10px; color: var(--slate-900); }
.lm-meter{
  height: 10px;
  background: rgba(203,213,225,0.75);
  border-radius: 999px;
  overflow:hidden;
  margin-top: 12px;
}
.lm-meterFill{
  height:100%;
  background: linear-gradient(90deg, var(--royal-blue-light), var(--mint));
  border-radius: 999px;
  width: 20%;
  transition: width 450ms cubic-bezier(.2,.9,.2,1);
}
.lm-dashHint{ margin-top: 10px; color: var(--slate-600); font-weight: 850; }

.lm-dashList{ margin-top: 12px; display:flex; flex-direction:column; gap: 10px; }
.lm-dashLine{ display:flex; gap: 10px; align-items:flex-start; color: var(--slate-700); font-weight: 850; }
.lm-dot{
  width: 10px; height: 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--royal-blue-light), var(--royal-blue));
  margin-top: 6px;
  flex-shrink:0;
}
.lm-miniTags{ display:flex; flex-wrap:wrap; gap: 8px; margin-top: 12px; }
.lm-miniTag{
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(59,130,246,0.10);
  border: 1px solid rgba(59,130,246,0.18);
  color: var(--royal-blue);
  font-weight: 900;
  font-size: .82rem;
}

/* RESPONSIVE */
@media (max-width: 1100px){
  .lm-grid--5{ grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 980px){
  .lm-heroInner{ grid-template-columns: 1fr; }
  .lm-heroCard{ display:none; }
  .lm-simGrid{ grid-template-columns: 1fr; }
}
@media (max-width: 920px){
  .lm-grid--3{ grid-template-columns: 1fr; }
  .lm-grid--2{ grid-template-columns: 1fr; }
  .lm-foundersGrid{ grid-template-columns: 1fr; }
  .lm-graphFoot{ grid-template-columns: 1fr; }
  .lm-timelineLine{ left: 24px; transform:none; }
  .lm-timelineMarker{ left: 24px; transform:none; }
  .lm-timelineItem, .lm-timelineItem.is-even{ flex-direction: row; }
  .lm-timelineCard{ width: calc(100% - 64px); margin-left: 64px; }
  .lm-hubSpoke{ height: auto; padding: 20px 0; }
  .lm-hubCenter{ position:relative; left:auto; top:auto; transform:none; margin: 0 auto 18px; }
  .lm-spoke{ position:relative; left:auto; right:auto; top:auto; bottom:auto; transform:none; margin: 12px auto; width: 90%; max-width: 420px; height:auto; border-radius: 18px; }
}
@media (max-width: 560px){
  .lm-section{ padding: 78px 0; }
  .lm-hero{ min-height: 86vh; }
  .lm-heroCtas{ flex-direction: column; align-items: stretch; }
  .lm-btn{ width:100%; }
  .lm-grid--5{ grid-template-columns: 1fr; }
}
`;
