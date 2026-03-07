import { useState, useEffect } from "react";

const C = {
  bg: "#0f1117", card: "#1a1d27", border: "#2a2d3a",
  accent: "#6c5ce7", accentLight: "#a29bfe",
  concl: "#55efc4", conclBg: "rgba(85,239,196,0.10)",
  prem: "#74b9ff", premBg: "rgba(116,185,255,0.10)",
  inter: "#a29bfe", interBg: "rgba(162,155,254,0.10)",
  assum: "#fdcb6e", assumBg: "rgba(253,203,110,0.12)",
  ok: "#55efc4", fail: "#ff7675", failBg: "rgba(255,118,117,0.10)",
  flaw: "#fd79a8", flawBg: "rgba(253,121,168,0.10)",
  x: "#fd79a8", xBg: "rgba(253,121,168,0.12)",
  y: "#a29bfe", yBg: "rgba(162,155,254,0.12)",
  weaken: "#fd79a8", weakenBg: "rgba(253,121,168,0.10)",
  strengthen: "#55efc4", strengthenBg: "rgba(85,239,196,0.10)",
  neutral: "#636e72", neutralBg: "rgba(99,110,114,0.10)",
  prin: "#a29bfe", prinBg: "rgba(162,155,254,0.10)",
  tooFar: "#fd79a8", tooFarBg: "rgba(253,121,168,0.10)",
  offTopic: "#e17055", offTopicBg: "rgba(225,112,85,0.10)",
  ctx: "#c09875", ctxBg: "rgba(192,152,117,0.10)",
  vocab: "#ffeaa7", text: "#e2e2e8", muted: "#8b8d9a", white: "#fff",
};

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Passage" },
  { id: 1, label: "Structure", title: "Extract the Logical Structure" },
  { id: 2, label: "Options", title: "Evaluate Each Option" },
];

const vocabDefs = {
  "majority": "More than half of the total number. In elections, this means receiving more than 50% of votes cast.",
  "election": "A formal process in which people vote to choose a person or group to hold an official position.",
  "gain": "To obtain or achieve something, especially something desired or beneficial.",
};

const structureQs = [
  {
    id: "q1",
    prompt: "What does the passage say is necessary for winning an election?",
    options: [
      { id: "a", text: "Being named the winner", correct: false, fb: "Being named the winner is the outcome, not the requirement. Look at the 'only if' clause." },
      { id: "b", text: "Gaining a majority of votes (X)", correct: true, fb: "" },
      { id: "c", text: "Running a good campaign", correct: false, fb: "The passage doesn't mention campaigns. Focus on what comes after 'only if'." },
    ],
  },
  {
    id: "q2",
    prompt: "What does the passage observe has happened?",
    options: [
      { id: "a", text: "You gained a majority of votes", correct: false, fb: "That's what the passage concludes, not what it observes directly. What fact does it start from?" },
      { id: "b", text: "You lost the election", correct: false, fb: "The passage says the opposite. You were named the winner." },
      { id: "c", text: "You were named the winner (Y)", correct: true, fb: "" },
    ],
  },
  {
    id: "q3",
    prompt: "What does the passage conclude from this?",
    options: [
      { id: "a", text: "You must have gained a majority of votes (X)", correct: true, fb: "" },
      { id: "b", text: "You did not gain a majority of votes", correct: false, fb: "The passage concludes the opposite. Since you won, you must have gained the necessary votes." },
      { id: "c", text: "Elections are fair", correct: false, fb: "The passage doesn't comment on fairness. It draws a specific conclusion about your votes." },
    ],
  },
];

const opts = [
  {
    letter: "A",
    text: "You are only promoted to be head teacher if you have taught for many years. You have taught for many years, so you are sure to be promoted to be head teacher.",
    ok: false,
    structure: "X is necessary for Y; X; therefore Y",
    xLabel: "Taught many years",
    yLabel: "Promoted to head teacher",
    notXLabel: "Not taught many years",
    notYLabel: "Not promoted",
    validity: "Invalid (affirming a necessary condition)",
    expl: "Teaching many years (X) is necessary for promotion (Y). You have X. Therefore Y. This affirms the necessary condition and concludes the result must follow. But having a necessary condition does not guarantee the outcome. Many things beyond experience may be required. The passage works the other way: it observes Y and concludes X.",
  },
  {
    letter: "B",
    text: "You can only go to the concert if you buy tickets or win them in the competition. You must have bought your tickets as someone else won the competition.",
    ok: false,
    structure: "X or Z necessary for Y; not Z; therefore X",
    xLabel: "Buy tickets",
    yLabel: "Go to concert",
    notXLabel: "Not buy tickets",
    notYLabel: "Not go to concert",
    validity: "Valid (but different structure: elimination from disjunction)",
    expl: "This introduces two possible ways to satisfy the necessary condition (buy or win), then eliminates one. The passage has a single necessary condition and works from observing the outcome. The disjunctive elimination ('or') makes this a fundamentally different logical form.",
  },
  {
    letter: "C",
    text: "You only get a high-paying job if you study hard in school. You are certain to get a high-paying job because you studied hard in school.",
    ok: false,
    structure: "X is necessary for Y; X; therefore Y",
    xLabel: "Study hard",
    yLabel: "High-paying job",
    notXLabel: "Not study hard",
    notYLabel: "No high-paying job",
    validity: "Invalid (affirming a necessary condition)",
    expl: "Studying hard (X) is necessary for a high-paying job (Y). You have X. Therefore Y. This is the same mistake as option A: it starts with the necessary condition being met and assumes the result must follow. The passage starts with the result (Y) and concludes the necessary condition (X) must have been met. Different direction entirely.",
  },
  {
    letter: "D",
    text: "You can only apply for a loan from the bank or the credit union. You missed the bank's deadline for submitting forms, so you will have to apply to the credit union.",
    ok: false,
    structure: "X or Z; not X; therefore Z",
    xLabel: "Apply to bank",
    yLabel: "Apply to credit union",
    notXLabel: "Missed bank deadline",
    notYLabel: "Not apply to credit union",
    validity: "Valid (disjunctive syllogism)",
    expl: "You can apply to the bank (X) or credit union (Z). Not bank (not X). Therefore credit union (Z). This is a straightforward 'either/or' elimination. The passage does not present two alternatives. It states a single necessary condition and works from the outcome being observed. Different logical form.",
  },
  {
    letter: "E",
    text: "You are only eligible for the scholarship if you can prove financial need. You have been declared eligible for the scholarship so you must have proved financial need.",
    ok: true,
    structure: "X is necessary for Y; Y; therefore X",
    xLabel: "Prove financial need",
    yLabel: "Eligible for scholarship",
    notXLabel: "Not proved need",
    notYLabel: "Not eligible",
    validity: "Valid (affirming the consequent of a necessary condition)",
    expl: "Proving financial need (X) is necessary for scholarship eligibility (Y). You have Y (declared eligible). Therefore X (you must have proved financial need). This is the exact same structure as the passage. 'Only if' establishes X as necessary for Y. The outcome Y is observed. Therefore X must have been the case. Both arguments reason backwards from the result to the necessary condition.",
  },
];

function Vocab({ term, children }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline" }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ borderBottom: `2px dashed ${C.vocab}`, cursor: "help", color: C.vocab }}>{children || term}</span>
      {show && (
        <span style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "#2d3047", border: `1px solid ${C.vocab}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.vocab, width: 260, zIndex: 100, lineHeight: 1.5, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", pointerEvents: "none" }}>
          <span style={{ fontWeight: 700, display: "block", marginBottom: 4 }}>Definition</span>
          {vocabDefs[term]}
        </span>
      )}
    </span>
  );
}

function PassageRaw() {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>
        You only win an <Vocab term="election">election</Vocab> if you <Vocab term="gain">gain</Vocab> a <Vocab term="majority">majority</Vocab> of votes. You must have gained a majority of votes because you were named the winner in the election.
      </p>
    </div>
  );
}

function MiniChain({ xLabel, notXLabel, yLabel, notYLabel, structure, color }) {
  const isNecessary = structure.includes("necessary");
  const isDisjunctive = structure.includes(" or ");
  const hasZ = structure.includes("Z");

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 10, flexWrap: "wrap" }}>
        {isNecessary && !isDisjunctive ? (
          <>
            <div style={{ background: C.yBg, border: `1px solid ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{yLabel}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(Y)</p>
            </div>
            <div style={{ padding: "0 8px" }}><span style={{ fontSize: 16, color: C.prem }}>→</span></div>
            <div style={{ background: C.xBg, border: `1px solid ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{xLabel}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(X)</p>
            </div>
            <span style={{ marginLeft: 10, background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "2px 6px", fontSize: 9, color: C.prem, fontWeight: 700 }}>Y implies X</span>
          </>
        ) : isDisjunctive ? (
          <>
            <div style={{ background: C.xBg, border: `1px solid ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{xLabel}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(X)</p>
            </div>
            <div style={{ padding: "0 8px" }}><span style={{ fontSize: 14, color: C.prem }}>OR</span></div>
            <div style={{ background: C.yBg, border: `1px solid ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{notYLabel || yLabel}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>{hasZ ? "(Z)" : "(Y)"}</p>
            </div>
            <span style={{ marginLeft: 10, background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "2px 6px", fontSize: 9, color: C.prem, fontWeight: 700 }}>X or {hasZ ? "Z" : "Y"}</span>
          </>
        ) : (
          <>
            <div style={{ background: C.xBg, border: `1px solid ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{xLabel}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(X)</p>
            </div>
            <div style={{ padding: "0 8px" }}><span style={{ fontSize: 16, color: C.prem }}>→</span></div>
            <div style={{ background: C.yBg, border: `1px solid ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{yLabel}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(Y)</p>
            </div>
            <span style={{ marginLeft: 10, background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "2px 6px", fontSize: 9, color: C.prem, fontWeight: 700 }}>X implies Y</span>
          </>
        )}
      </div>
      <div style={{ borderTop: `1px dashed ${C.border}`, paddingTop: 10 }}>
        <span style={{ fontSize: 10, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Therefore...</span>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {structure.includes("Y; therefore X") && isNecessary ? (
            <>
              <div style={{ background: C.yBg, border: `1px dashed ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{yLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(Y observed)</p>
              </div>
              <div style={{ padding: "0 8px" }}><span style={{ fontSize: 16, color }}>→</span></div>
              <div style={{ background: C.xBg, border: `1px dashed ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{xLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(therefore X)</p>
              </div>
            </>
          ) : structure.includes("X; therefore Y") && isNecessary ? (
            <>
              <div style={{ background: C.xBg, border: `1px dashed ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{xLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(X observed)</p>
              </div>
              <div style={{ padding: "0 8px" }}><span style={{ fontSize: 16, color }}>→</span></div>
              <div style={{ background: C.yBg, border: `1px dashed ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{yLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(therefore Y)</p>
              </div>
            </>
          ) : structure.includes("not Z; therefore X") || (isDisjunctive && structure.includes("not")) ? (
            <>
              <div style={{ background: C.yBg, border: `1px dashed ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{notYLabel || "Not " + yLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(not {hasZ ? "Z" : "Y"})</p>
              </div>
              <div style={{ padding: "0 8px" }}><span style={{ fontSize: 16, color }}>→</span></div>
              <div style={{ background: C.xBg, border: `1px dashed ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{xLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(therefore X)</p>
              </div>
            </>
          ) : structure.includes("Y; therefore X") ? (
            <>
              <div style={{ background: C.yBg, border: `1px dashed ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{yLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(Y)</p>
              </div>
              <div style={{ padding: "0 8px" }}><span style={{ fontSize: 16, color }}>→</span></div>
              <div style={{ background: C.xBg, border: `1px dashed ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{xLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(X)</p>
              </div>
            </>
          ) : (
            <>
              <div style={{ background: C.xBg, border: `1px dashed ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{notXLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(not X)</p>
              </div>
              <div style={{ padding: "0 8px" }}><span style={{ fontSize: 16, color }}>→</span></div>
              <div style={{ background: C.yBg, border: `1px dashed ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{notYLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(not Y)</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LogicChain({ stage }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 24px", marginBottom: 18 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Logical structure</span>
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: stage >= 2 ? 14 : 0 }}>
        <div style={{ background: C.yBg, border: `1.5px solid ${C.y}`, borderRadius: 8, padding: "10px 16px", opacity: stage >= 1 ? 1 : 0.2, transition: "opacity 0.5s" }}>
          <p style={{ margin: 0, fontSize: 14, color: C.y, fontWeight: 600 }}>Win Election</p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>(Y)</p>
        </div>
        <div style={{ padding: "0 10px", opacity: stage >= 1 ? 1 : 0.2, transition: "opacity 0.5s" }}>
          <span style={{ fontSize: 18, color: C.prem }}>→</span>
        </div>
        <div style={{ background: C.xBg, border: `1.5px solid ${C.x}`, borderRadius: 8, padding: "10px 16px", opacity: stage >= 1 ? 1 : 0.2, transition: "opacity 0.5s" }}>
          <p style={{ margin: 0, fontSize: 14, color: C.x, fontWeight: 600 }}>Majority of Votes</p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>(X)</p>
        </div>
        <div style={{ marginLeft: 12, opacity: stage >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
          <span style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "3px 8px", fontSize: 10, color: C.prem, fontWeight: 700 }}>Y implies X</span>
        </div>
      </div>
      {stage >= 2 && (
        <div style={{ borderTop: `1px dashed ${C.border}`, margin: "0 0 14px", paddingTop: 14 }}>
          <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Observed...</span>
        </div>
      )}
      {stage >= 2 && (
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <div style={{ background: C.yBg, border: `1.5px dashed ${C.y}`, borderRadius: 8, padding: "10px 16px" }}>
            <p style={{ margin: 0, fontSize: 14, color: C.y, fontWeight: 600 }}>Named the winner</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>(Y observed)</p>
          </div>
          <div style={{ padding: "0 10px" }}>
            <span style={{ fontSize: 18, color: stage >= 3 ? C.ok : C.muted }}>→</span>
          </div>
          {stage >= 3 ? (
            <div style={{ background: C.xBg, border: `1.5px dashed ${C.x}`, borderRadius: 8, padding: "10px 16px" }}>
              <p style={{ margin: 0, fontSize: 14, color: C.x, fontWeight: 600 }}>Must have gained majority</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>(therefore X)</p>
            </div>
          ) : (
            <div style={{ background: "#1e2030", border: `1.5px dashed ${C.border}`, borderRadius: 8, padding: "10px 16px" }}>
              <p style={{ margin: 0, fontSize: 14, color: C.muted }}>?</p>
            </div>
          )}
          {stage >= 3 && (
            <div style={{ marginLeft: 12 }}>
              <span style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "3px 8px", fontSize: 10, color: C.concl, fontWeight: 700 }}>Y observed → therefore X</span>
            </div>
          )}
        </div>
      )}
      {stage >= 3 && (
        <div style={{ marginTop: 14, background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 8, padding: "10px 14px" }}>
          <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>THE PATTERN</span>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
            The structure is: <strong style={{ color: C.x }}>X</strong> is necessary for <strong style={{ color: C.y }}>Y</strong> (signalled by "only if"). <strong style={{ color: C.y }}>Y</strong> is observed. Therefore <strong style={{ color: C.x }}>X</strong> must be the case. The argument reasons backwards from the outcome to the necessary condition. Now find the option with the same pattern.
          </p>
        </div>
      )}
    </div>
  );
}

function StructureExtractor() {
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const stage = (feedback.q1 === "correct" ? 1 : 0) + (feedback.q2 === "correct" ? 1 : 0) + (feedback.q3 === "correct" ? 1 : 0);

  const handleClick = (qId, optId) => {
    if (feedback[qId] === "correct") return;
    const q = structureQs.find(s => s.id === qId);
    const opt = q.options.find(o => o.id === optId);
    setAnswers(p => ({ ...p, [qId]: optId }));
    setFeedback(p => ({ ...p, [qId]: opt.correct ? "correct" : "wrong" }));
  };

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
          <span style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.prem, fontWeight: 700, whiteSpace: "nowrap" }}>STEP 1</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Break the argument into its <strong style={{ color: C.prem }}>logical structure</strong>. The keyword here is <strong style={{ color: C.assum }}>"only if"</strong>, which tells you X is a <em>necessary condition</em> for Y.
          </p>
        </div>
        <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
          For this argument, let <strong style={{ color: C.x }}>X</strong> = gaining a majority of votes and <strong style={{ color: C.y }}>Y</strong> = winning the election.
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span>
        <PassageRaw />
      </div>

      <LogicChain stage={stage} />

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 }}>
        {structureQs.map((q, idx) => {
          const fb = feedback[q.id];
          const isC = fb === "correct";
          const prevDone = idx === 0 || feedback[structureQs[idx - 1].id] === "correct";
          if (!prevDone) return null;
          return (
            <div key={q.id} style={{ background: C.card, border: `1px solid ${isC ? C.concl + "44" : C.border}`, borderRadius: 14, padding: "16px 20px", transition: "all 0.3s" }}>
              <p style={{ margin: "0 0 10px", fontSize: 14, color: C.text, lineHeight: 1.6 }}>
                <span style={{ color: C.muted, fontSize: 12, marginRight: 8 }}>{idx + 1}.</span>{q.prompt}
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {q.options.map(o => {
                  const sel = answers[q.id] === o.id;
                  const thisC = isC && o.correct;
                  const thisW = sel && !o.correct && fb === "wrong";
                  return (
                    <button key={o.id} onClick={() => handleClick(q.id, o.id)} style={{
                      padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                      border: `1.5px solid ${thisC ? C.concl : thisW ? C.fail : C.border}`,
                      background: thisC ? C.conclBg : thisW ? C.failBg : "transparent",
                      color: thisC ? C.concl : thisW ? C.fail : C.muted,
                      cursor: isC ? "default" : "pointer", opacity: isC && !thisC ? 0.3 : 1,
                      fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif",
                    }}>{o.text}</button>
                  );
                })}
              </div>
              {fb === "wrong" && (
                <div style={{ marginTop: 8, padding: "8px 12px", background: C.failBg, border: `1px solid ${C.fail}44`, borderRadius: 8 }}>
                  <p style={{ margin: 0, fontSize: 13, color: C.fail, lineHeight: 1.5 }}>
                    <strong>Try again.</strong> {structureQs.find(s => s.id === q.id)?.options.find(o => answers[q.id] === o.id)?.fb}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {stage === 3 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
          <div style={{ background: C.assumBg, border: `1px solid ${C.assum}44`, borderRadius: 10, padding: "12px 16px" }}>
            <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>KEY SKILL</span>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
              Watch for the difference between <strong style={{ color: C.accent }}>"X is necessary for Y, and X is present"</strong> versus <strong style={{ color: C.accent }}>"X is necessary for Y, and Y is observed"</strong>. The passage observes the outcome (Y) and reasons that the necessary condition (X) must have been met. Options A and C flip the direction: they start with X and conclude Y must follow, which is a different (and invalid) pattern. The trickiest distractors will have the same "only if" language but reason in the wrong direction.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function OptionCard({ o, expanded, onClick, animate }) {
  const bc = expanded ? (o.ok ? C.ok : C.fail) : C.border;
  return (
    <div style={{ background: expanded ? (o.ok ? C.conclBg : C.failBg) : "#1e2030", border: `1.5px solid ${bc}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", transition: "all 0.3s", opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(12px)" }} onClick={onClick}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ background: expanded ? (o.ok ? C.ok : C.fail) : C.accent, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.white, flexShrink: 0 }}>{expanded ? (o.ok ? "✓" : "✗") : o.letter}</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.6 }}>{o.text}</p>
          {expanded && (
            <div style={{ marginTop: 10 }}>
              <div style={{ background: "#151722", borderRadius: 10, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ background: `${o.ok ? C.concl : C.fail}22`, border: `1px solid ${o.ok ? C.concl : C.fail}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: o.ok ? C.concl : C.fail, fontWeight: 700 }}>OPTION {o.letter}</span>
                  <span style={{ fontSize: 10, color: C.muted, fontStyle: "italic" }}>{o.validity}</span>
                </div>
                <MiniChain xLabel={o.xLabel} yLabel={o.yLabel} notXLabel={o.notXLabel} notYLabel={o.notYLabel} structure={o.structure} color={o.ok ? C.concl : C.fail} />
              </div>
              <div style={{ marginTop: 10, padding: "10px 14px", background: o.ok ? C.conclBg : C.failBg, borderRadius: 8, fontSize: 13, color: o.ok ? C.concl : C.fail, lineHeight: 1.6, borderLeft: `3px solid ${o.ok ? C.ok : C.fail}` }}>
                {o.ok ? <span style={{ fontWeight: 700 }}>CORRECT: </span> : <span style={{ fontWeight: 700 }}>DOES NOT MATCH: </span>}
                {o.expl}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [optAnim, setOptAnim] = useState([false, false, false, false, false]);

  useEffect(() => {
    if (step === 2) {
      [0, 1, 2, 3, 4].forEach(i => {
        setTimeout(() => setOptAnim(p => { const n = [...p]; n[i] = true; return n; }), i * 100);
      });
    } else {
      setOptAnim([false, false, false, false, false]);
      setExpanded(null);
    }
  }, [step]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif", letterSpacing: 0.2, padding: "24px 16px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: 1 }}>TARA</span>
            <span style={{ fontSize: 12, color: C.muted }}>Critical Thinking</span>
            <span style={{ fontSize: 12, color: C.muted }}>·</span>
            <span style={{ fontSize: 12, color: C.accentLight }}>Matching Arguments</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022</p>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {stepsMeta.map(s => (
            <button key={s.id} onClick={() => setStep(s.id)} style={{
              flex: 1, minWidth: 0,
              background: step === s.id ? C.accent : step > s.id ? "rgba(108,92,231,0.15)" : "#1e2030",
              border: `1px solid ${step === s.id ? C.accent : step > s.id ? C.accent + "44" : C.border}`,
              borderRadius: 10, padding: "10px 6px", cursor: "pointer", transition: "all 0.3s",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif",
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, lineHeight: 1 }}>{s.id + 1}</span>
              <span style={{ fontSize: 11, fontWeight: step === s.id ? 700 : 500, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, whiteSpace: "nowrap" }}>{s.label}</span>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ background: C.accent, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.white }}>{step + 1}</span>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.white, margin: 0 }}>{stepsMeta[step].title}</h2>
        </div>

        {step === 0 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span>
              <PassageRaw />
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>
                Read the passage carefully. <span style={{ color: C.vocab }}>Hover yellow terms</span> for definitions. This is a <strong style={{ color: C.white }}>Matching Arguments</strong> question:
              </p>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}>
                <em>"Which one of the following most closely parallels the reasoning used in the above argument?"</em>
              </div>
              <div style={{ marginTop: 12, background: "rgba(162,155,254,0.10)", border: `1px solid ${C.accentLight}44`, borderRadius: 10, padding: "12px 16px" }}>
                <p style={{ margin: 0, fontSize: 13, color: C.accentLight, lineHeight: 1.6 }}>
                  <strong>Matching Arguments questions</strong> ask you to find an option with the same logical structure as the passage. Ignore the topic completely. Break the passage down into its abstract pattern first, then find the option that matches that exact structure.
                </p>
              </div>
            </div>
          </>
        )}

        {step === 1 && <StructureExtractor />}

        {step === 2 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}>
                <em>"Which one of the following most closely parallels the reasoning used in the above argument?"</em>
              </div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span>
              <PassageRaw />
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ background: `${C.accent}22`, border: `1px solid ${C.accent}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.accent, fontWeight: 700 }}>PASSAGE STRUCTURE (from Step 1)</span>
                <span style={{ fontSize: 10, color: C.muted, fontStyle: "italic" }}>Valid (affirming the consequent of a necessary condition)</span>
              </div>
              <MiniChain xLabel="Majority of Votes" yLabel="Win Election" notXLabel="No majority" notYLabel="Don't win" structure="X is necessary for Y; Y; therefore X" color={C.accent} />
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 14 }}>
              <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>
                <strong style={{ color: C.assum }}>Click each option</strong> to see its structure and compare against the passage:
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {opts.map((o, i) => (
                <OptionCard key={o.letter} o={o} expanded={expanded === o.letter} animate={optAnim[i]} onClick={() => setExpanded(p => p === o.letter ? null : o.letter)} />
              ))}
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 12, paddingBottom: 32 }}>
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{
            flex: 1, padding: "13px 20px", borderRadius: 10, border: `1px solid ${C.border}`,
            background: step === 0 ? C.card : "#1e2030", color: step === 0 ? C.muted : C.text,
            fontSize: 14, fontWeight: 600, cursor: step === 0 ? "not-allowed" : "pointer",
            opacity: step === 0 ? 0.4 : 1,
            fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif",
          }}>← Previous</button>
          <button onClick={() => setStep(Math.min(2, step + 1))} disabled={step === 2} style={{
            flex: 1, padding: "13px 20px", borderRadius: 10, border: "none",
            background: step === 2 ? "#1e2030" : `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
            color: step === 2 ? C.muted : C.white,
            fontSize: 14, fontWeight: 600, cursor: step === 2 ? "not-allowed" : "pointer",
            opacity: step === 2 ? 0.4 : 1,
            fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif",
          }}>Next →</button>
        </div>
      </div>
    </div>
  );
}
