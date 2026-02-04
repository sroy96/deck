import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Card = ({ active, children }) => (
  <div
    className={[
      "rounded-xl border p-4 shadow-sm bg-white transition",
      active ? "border-black" : "border-gray-200 opacity-70",
    ].join(" ")}
  >
    {children}
  </div>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-700">
    {children}
  </span>
);

const SectionTitle = ({ children }) => (
  <div className="text-sm font-semibold text-gray-900">{children}</div>
);

const Sub = ({ children }) => (
  <div className="mt-1 text-xs text-gray-600 leading-relaxed">{children}</div>
);

const Divider = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="flex justify-center"
      >
        <div className="my-2 text-gray-300">↓</div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ChoiceButton = ({ selected, tone, onClick, children }) => {
  const toneClass =
    tone === "yes"
      ? "border-green-600 text-green-700"
      : "border-red-600 text-red-700";
  const selectedClass = selected ? "bg-gray-50" : "bg-white";
  return (
    <button
      onClick={onClick}
      className={[
        "w-full rounded-xl border px-4 py-3 text-sm font-semibold transition hover:shadow-sm",
        toneClass,
        selectedClass,
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
};

export default function CreditBuilderInteractiveFlow() {
  /**
   * decision:
   *  - null => not chosen yet
   *  - "yes" => CIBIL >= 700 -> normal loan flow
   *  - "no"  => CIBIL < 700  -> credit builder flow
   */
  const [decision, setDecision] = useState(null);

  const metrics = useMemo(
    () => ({
      leadReality: "95% customers not loan-eligible today",
      graduation: "Track & re-offer loans in 4–6 months",
      agentBenefit: "Earn now + earn again on graduation",
    }),
    []
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
      {/* Header / GTM framing */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-lg font-bold text-gray-900">
              Agent Execution Flow — Loans + Credit Builder Rescue Funnel
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Agents sell all financial products. If a customer is not eligible for a loan,
              move them into Credit Builder and track them to convert in 4–6 months.
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>Reality: {metrics.leadReality}</Badge>
            <Badge>{metrics.graduation}</Badge>
            <Badge>{metrics.agentBenefit}</Badge>
          </div>
        </div>
      </div>

      {/* Flow */}
      <Card active>
        <SectionTitle>1) Customer asks for Loan / Product</SectionTitle>
        <Sub>Start with credit check to avoid rejections and pick the right product.</Sub>
      </Card>

      <Divider show />

      <Card active>
        <SectionTitle>2) Collect details (minimum)</SectionTitle>
        <Sub>PAN • Mobile • Last name • Consent</Sub>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge>Data-minimised</Badge>
          <Badge>No report sharing</Badge>
          <Badge>Consent-first</Badge>
        </div>
      </Card>

      <Divider show />

      <Card active>
        <SectionTitle>3) Send for Credit Summary</SectionTitle>
        <Sub>
          WhatsApp to <strong>9585386951</strong>: Name, PAN, Mobile, Last Name, Loan required.
        </Sub>
        <div className="mt-3 text-xs text-gray-600">
          You will receive: Credit score • DPD (Y/N) • Active loan count • Active loan NBFC
        </div>
      </Card>

      <Divider show />

      <Card active>
        <SectionTitle>4) Decision</SectionTitle>
        <Sub>Is CIBIL ≥ 700?</Sub>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <ChoiceButton
            tone="yes"
            selected={decision === "yes"}
            onClick={() => setDecision("yes")}
          >
            YES — CIBIL ≥ 700
          </ChoiceButton>

          <ChoiceButton
            tone="no"
            selected={decision === "no"}
            onClick={() => setDecision("no")}
          >
            NO — CIBIL &lt; 700 / DPD / Negative
          </ChoiceButton>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            className="text-xs underline text-gray-600"
            onClick={() => setDecision(null)}
          >
            Reset decision
          </button>
          <span className="text-xs text-gray-500">
            (Use this in training demos)
          </span>
        </div>
      </Card>

      {/* Animated branches */}
      <AnimatePresence mode="wait">
        {decision === "yes" && (
          <motion.div
            key="yes-branch"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <Divider show />
            <Card active>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <SectionTitle>✅ Normal Loan Flow</SectionTitle>
                  <Sub>
                    Proceed with eligible loan products as per lender rules.
                  </Sub>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge>Commission: Loan payout</Badge>
                  <span className="text-[11px] text-gray-500">
                    (as per product slab)
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
                <div className="rounded-lg border border-gray-200 p-3">
                  Suggest: Personal Loan / Credit Card / LAMF (as eligible)
                </div>
                <div className="rounded-lg border border-gray-200 p-3">
                  Reduce rejections: Only pitch eligible products
                </div>
                <div className="rounded-lg border border-gray-200 p-3">
                  Track: status, docs, lender submissions
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {decision === "no" && (
          <motion.div
            key="no-branch"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <Divider show />

            <Card active>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <SectionTitle>⚠️ Move to Credit Builder Program (Rescue Funnel)</SectionTitle>
                  <Sub>
                    This is the default outcome for ~95% of agents’ leads. Don’t lose the customer—convert them into a tracked pipeline.
                  </Sub>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge>Commission: Builder enrollment</Badge>
                  <Badge>+ Graduation bonus later</Badge>
                </div>
              </div>
            </Card>

            <Card active>
              <SectionTitle>5) Segment & Suggest Product</SectionTitle>
              <Sub>Offer only what the system allows.</Sub>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">Segment A: No / Thin CIBIL</div>
                    <Badge>Low risk entry</Badge>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    Suggest: Secured card / secured line (small usage, autopay)
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">Segment B: 550–650</div>
                    <Badge>Discipline required</Badge>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    Suggest: Secured + micro EMI (autopay mandatory, utilization &lt;30%)
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">Segment C: 650–699</div>
                    <Badge>Fast track</Badge>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    Suggest: Builder combo to cross 700 with 3–6 months consistency
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">Segment D: DPD / Defaulter</div>
                    <Badge>No unsecured</Badge>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    Suggest: Secured-only entry when stable; focus on stabilization first
                  </div>
                </div>
              </div>
            </Card>

            <Card active>
              <SectionTitle>6) Tracking & Graduation (4–6 Months)</SectionTitle>
              <Sub>
                Every enrolled customer is tracked monthly. When they hit stability + positive reporting milestones,
                they get re-offered eligible loans.
              </Sub>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
                <div className="rounded-lg border border-gray-200 p-3">
                  Month 0–1: Stabilize (stop damage)
                </div>
                <div className="rounded-lg border border-gray-200 p-3">
                  Month 1–3: Build (positive reporting)
                </div>
                <div className="rounded-lg border border-gray-200 p-3">
                  Month 4–6: Graduate (loan-ready)
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge>Commission: enrollment</Badge>
                <Badge>Commission: loan conversion on graduation</Badge>
                <Badge>Higher LTV per customer</Badge>
              </div>
            </Card>

            <Card active>
              <SectionTitle>Agent Script (Mandatory)</SectionTitle>
              <Sub>
                “Based on your credit profile, instant loans may be limited right now.  
                This program improves your eligibility step-by-step and we will re-check and offer you a loan in 4–6 months.”
              </Sub>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
