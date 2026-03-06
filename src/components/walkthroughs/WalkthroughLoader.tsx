"use client";

import dynamic from "next/dynamic";
import { C } from "@/lib/tara";

function LoadingState() {
  return (
    <div style={{
      background: C.card,
      border: "1px solid " + C.border,
      borderRadius: 16,
      padding: "60px 28px",
      textAlign: "center" as const,
    }}>
      <div style={{
        width: 32, height: 32,
        border: "3px solid " + C.border,
        borderTopColor: C.accent,
        borderRadius: "50%",
        margin: "0 auto 16px",
        animation: "spin 0.8s linear infinite",
      }} />
      <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>Loading walkthrough...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const L = () => <LoadingState />;

const walkthroughMap: Record<string, Record<number, any>> = {
  "tsa-2022": {
    1: dynamic(() => import("./tsa-2022/tsa-q1-main-conclusion"), { loading: L }),
    2: dynamic(() => import("./tsa-2022/tsa-q15-main-conclusion"), { loading: L }),
    3: dynamic(() => import("./tsa-2022/tsa-q29-main-conclusion"), { loading: L }),
    4: dynamic(() => import("./tsa-2022/tsa-q39-main-conclusion"), { loading: L }),
    5: dynamic(() => import("./tsa-2022/tsa-q47-main-conclusion"), { loading: L }),
    6: dynamic(() => import("./tsa-2022/tsa-q3-assumption"), { loading: L }),
    7: dynamic(() => import("./tsa-2022/tsa-q22-assumption"), { loading: L }),
    8: dynamic(() => import("./tsa-2022/tsa-q33-assumption"), { loading: L }),
    9: dynamic(() => import("./tsa-2022/tsa-q41-assumption"), { loading: L }),
    10: dynamic(() => import("./tsa-2022/tsa-q27-reasoning-error"), { loading: L }),
    11: dynamic(() => import("./tsa-2022/tsa-q40-reasoning-error"), { loading: L }),
    12: dynamic(() => import("./tsa-2022/tsa-q5-matching-args"), { loading: L }),
    13: dynamic(() => import("./tsa-2022/tsa-q21-matching-args"), { loading: L }),
    14: dynamic(() => import("./tsa-2022/tsa-q28-matching-args"), { loading: L }),
    15: dynamic(() => import("./tsa-2022/tsa-q45-matching-args"), { loading: L }),
    16: dynamic(() => import("./tsa-2022/tsa-q11-drawing-conclusion"), { loading: L }),
    17: dynamic(() => import("./tsa-2022/tsa-q35-drawing-conclusion"), { loading: L }),
    18: dynamic(() => import("./tsa-2022/tsa-q9-applying-principles"), { loading: L }),
    19: dynamic(() => import("./tsa-2022/tsa-q17-applying-principles"), { loading: L }),
    20: dynamic(() => import("./tsa-2022/tsa-q34-applying-principles"), { loading: L }),
    21: dynamic(() => import("./tsa-2022/tsa-q10-weaken"), { loading: L }),
    22: dynamic(() => import("./tsa-2022/tsa-q23-weaken"), { loading: L }),
    23: dynamic(() => import("./tsa-2022/tsa-q49-weaken"), { loading: L }),
  },
};

export default function WalkthroughLoader({ paperId, displayNum }: { paperId: string; displayNum: number }) {
  const paper = walkthroughMap[paperId];

  if (!paper) {
    return (
      <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 16, padding: "40px 28px", textAlign: "center" as const }}>
        <p style={{ fontSize: 14, color: C.fail, margin: 0 }}>Paper not found.</p>
      </div>
    );
  }

  const Component = paper[displayNum];

  if (!Component) {
    return (
      <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 16, padding: "40px 28px", textAlign: "center" as const }}>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>Walkthrough not yet available for this question.</p>
      </div>
    );
  }

  return <Component />;
}