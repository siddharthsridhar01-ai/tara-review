"use client";

import { useRouter } from "next/navigation";
import { papers } from "@/lib/papers";
import { C, typeColors } from "@/lib/tara";

const font = "'Trebuchet MS', 'Gill Sans', Calibri, sans-serif";
const headingFont =
  "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif";

export default function Home() {
  const router = useRouter();
  const paperEntries = Object.entries(papers);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: font,
        letterSpacing: 0.2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          background: C.card,
          borderBottom: `1px solid ${C.border}`,
          padding: "16px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
              borderRadius: 8,
              padding: "5px 12px",
              fontSize: 11,
              fontWeight: 700,
              color: C.white,
              letterSpacing: 1,
            }}
          >
            TARA
          </span>
          <span style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>
            Interactive Review
          </span>
        </div>
      </div>

      {/* Hero */}
      <div
        style={{
          maxWidth: 900,
          width: "100%",
          padding: "48px 16px 0",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
                borderRadius: 10,
                padding: "6px 16px",
                fontSize: 12,
                fontWeight: 700,
                color: C.white,
                letterSpacing: 1.5,
              }}
            >
              TARA
            </span>
            <span style={{ fontSize: 13, color: C.muted }}>
              Think · Analyse · Reason · Answer
            </span>
          </div>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: C.white,
              margin: "0 0 12px",
              fontFamily: headingFont,
              fontStyle: "italic",
              lineHeight: 1.3,
            }}
          >
            Interactive Walkthrough Review
          </h1>
          <p
            style={{
              fontSize: 15,
              color: C.muted,
              margin: "0 auto",
              maxWidth: 520,
              lineHeight: 1.7,
            }}
          >
            Step-by-step guided walkthroughs for TSA critical thinking and problem solving questions.
            Select a paper below to review your answers.
          </p>
        </div>

        {/* Paper Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginBottom: 48,
          }}
        >
          {paperEntries.map(([id, paper]) => {
            const total = paper.questions.length;
            const types = [...new Set(paper.questions.map((q) => q.type))];

            return (
              <div
                key={id}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: "28px 32px",
                  textAlign: "left" as const,
                  fontFamily: font,
                  position: "relative" as const,
                  overflow: "hidden" as const,
                }}
              >
                {/* Accent bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, ${C.accent}, ${C.accentLight})`,
                    borderRadius: "16px 16px 0 0",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: C.white,
                        margin: "0 0 4px",
                        fontFamily: headingFont,
                        fontStyle: "italic",
                      }}
                    >
                      {paper.title}
                    </h2>
                    <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
                      {paper.source} · {total} Questions
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => router.push(`/practice/${id}/exam`)}
                      style={{
                        background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
                        borderRadius: 10,
                        padding: "10px 20px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: C.white,
                        border: "none",
                        cursor: "pointer",
                        fontFamily: font,
                      }}
                    >
                      Take Exam
                    </button>
                    <button
                      onClick={() => router.push(`/practice/${id}/review`)}
                      style={{
                        background: "transparent",
                        borderRadius: 10,
                        padding: "10px 20px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: C.muted,
                        border: `1px solid ${C.border}`,
                        cursor: "pointer",
                        fontFamily: font,
                      }}
                    >
                      Review
                    </button>
                  </div>
                </div>

                {/* Question type pills */}
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                  {types.map((type) => {
                    const count = paper.questions.filter(
                      (q) => q.type === type
                    ).length;
                    const color = typeColors[type] || C.muted;
                    return (
                      <span
                        key={type}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 600,
                          color,
                          background: `${color}15`,
                          border: `1px solid ${color}30`,
                        }}
                      >
                        {type} ({count})
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            paddingBottom: 32,
            borderTop: `1px solid ${C.border}`,
            paddingTop: 24,
          }}
        >
          <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
            AceAdmissions · Precision Preparation for UK Admissions Tests
          </p>
        </div>
      </div>
    </div>
  );
}
