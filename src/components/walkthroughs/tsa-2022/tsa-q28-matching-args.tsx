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
  "definitely": "Without any doubt; certainly. In logic, this signals a guaranteed outcome rather than a probable one.",
  "fired": "Dismissed from a job, typically as a consequence of some action or failure.",
  "parallels": "Closely resembles or mirrors. In logic, it means sharing the same abstract reasoning structure.",
  "punctuality": "The quality of being on time; not being late.",
  "disciplinary action": "A formal process taken against someone who has broken rules, such as a warning or punishment.",
};

const structureQs = [
  {
    id: "q1",
    prompt: "What does the passage say will definitely happen if you arrive late for work?",
    options: [
      { id: "a", text: "You will lose your job (Y)", correct: true, fb: "" },
      { id: "b", text: "You will get a warning", correct: false, fb: "The passage says something more severe than a warning. Re-read the first sentence." },
      { id: "c", text: "You will arrive on time next day", correct: false, fb: "The passage doesn't mention what happens afterwards. Focus on the stated consequence." },
    ],
  },
  {
    id: "q2",
    prompt: "What does the passage observe about you and your last job?",
    options: [
      { id: "a", text: "You arrived late for work (X)", correct: false, fb: "Careful. This is what the passage concludes, not what it observes. The observation is about the outcome." },
      { id: "b", text: "You were given a warning", correct: false, fb: "The passage doesn't mention warnings. It states a specific outcome about your last job." },
      { id: "c", text: "You lost your last job (Y)", correct: true, fb: "" },
    ],
  },
  {
    id: "q3",
    prompt: "What does the passage conclude from the fact that you lost your job?",
    options: [
      { id: "a", text: "You should find a new job", correct: false, fb: "The passage doesn't make recommendations. It draws a conclusion about the cause of losing the job." },
      { id: "b", text: "You must have arrived late for work (X)", correct: true, fb: "" },
      { id: "c", text: "Getting fired is unfair", correct: false, fb: "The passage makes no judgment about fairness. It reasons backwards from the outcome to the cause." },
    ],
  },
];

const opts = [
  {
    letter: "A",
    text: "If you turn up the volume, the music gets louder. The music is very loud now which means that you turned up the volume.",
    ok: true,
    structure: "X implies Y; Y; therefore X",
    xLabel: "Turn up volume",
    yLabel: "Music gets louder",
    notXLabel: "Didn't turn up volume",
    notYLabel: "Music not louder",
    validity: "Invalid (affirming the consequent)",
    expl: "Turning up the volume (X) implies music gets louder (Y). Music is loud (Y). Therefore you turned up the volume (X). This is the exact same structure as the passage: it observes the consequence (Y) and works backwards to assume the specific cause (X). Both commit the fallacy of affirming the consequent, since there could be other explanations for Y.",
  },
  {
    letter: "B",
    text: "If a company wants to be successful, it needs to insist on the punctuality of its employees. This company does not take the punctuality of its employees seriously, so it will not be successful.",
    ok: false,
    structure: "X is necessary for Y; not X; therefore not Y",
    xLabel: "Insist on punctuality",
    yLabel: "Successful company",
    notXLabel: "Doesn't insist on punctuality",
    notYLabel: "Not successful",
    validity: "Valid (denying a necessary condition)",
    expl: "Insisting on punctuality (X) is necessary for success (Y). Not insisting (not X). Therefore not successful (not Y). This denies a necessary condition, which is valid reasoning. The passage, however, affirms the consequent: it sees Y happened and assumes X caused it. Different structure entirely.",
  },
  {
    letter: "C",
    text: "Disciplinary action is initiated against all workers who do not wear a helmet on the building site. No disciplinary action has been initiated against Mike, so he must have always worn a helmet on the site.",
    ok: false,
    structure: "not X implies Y; not Y; therefore X",
    xLabel: "Wears helmet",
    yLabel: "Disciplinary action",
    notXLabel: "No helmet",
    notYLabel: "No disciplinary action",
    validity: "Valid (modus tollens / contrapositive)",
    expl: "Not wearing a helmet (not X) implies disciplinary action (Y). No disciplinary action against Mike (not Y). Therefore Mike wore his helmet (X). This is modus tollens: it denies the consequent to deny the antecedent, which is valid. The passage affirms the consequent to affirm the antecedent, which is invalid. Different logical form.",
  },
  {
    letter: "D",
    text: "You need a membership card to use the services of the gym. You do not have a membership card, so you cannot use the gym.",
    ok: false,
    structure: "X is necessary for Y; not X; therefore not Y",
    xLabel: "Membership card",
    yLabel: "Use the gym",
    notXLabel: "No membership card",
    notYLabel: "Cannot use gym",
    validity: "Valid (denying a necessary condition)",
    expl: "A membership card (X) is necessary for using the gym (Y). No card (not X). Therefore can't use the gym (not Y). This denies a necessary condition, which is valid. The passage, by contrast, sees the consequence (getting fired) and assumes one specific cause. The direction of reasoning is reversed.",
  },
  {
    letter: "E",
    text: "In order to anger a hippo, it is enough to drive close to it with a boat. They are driving close to this one, thus it will become angry.",
    ok: false,
    structure: "X implies Y; X; therefore Y",
    xLabel: "Drive close with boat",
    yLabel: "Hippo becomes angry",
    notXLabel: "Don't drive close",
    notYLabel: "Hippo not angry",
    validity: "Valid (modus ponens)",
    expl: "Driving close (X) is sufficient for angering a hippo (Y). They are driving close (X). Therefore the hippo will be angry (Y). This is modus ponens: X is present, so Y follows. The passage observes Y (got fired) and concludes X (arrived late). This option has X present and concludes Y. Completely different direction of reasoning.",
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
        If you arrive late for work, you will <Vocab term="definitely">definitely</Vocab> get <Vocab term="fired">fired</Vocab>. You lost your last job so you must have arrived late for work.
      </p>
    </div>
  );
}

function MiniChain({ xLabel, notXLabel, yLabel, notYLabel, structure, color }) {
  const isAffirmConsequent = structure.includes("Y; therefore X");
  const isModusTollens = structure.includes("not Y; therefore X") || structure.includes("not Y; therefore not X");
  const isNecessaryDenied = structure.includes("necessary") && structure.includes("not X; therefore not Y");
  const isModusPonens = structure.includes("X implies Y; X; therefore Y") || (structure.includes("X; therefore Y") && !structure.includes("not"));

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 10, flexWrap: "wrap" }}>
        <div style={{ background: C.xBg, border: `1px solid ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
          <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{xLabel}</p>
          <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(X)</p>
        </div>
        <div style={{ padding: "0 8px" }}><span style={{ fontSize: 16, color: C.prem }}>→</span></div>
        <div style={{ background: C.yBg, border: `1px solid ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
          <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{yLabel}</p>
          <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(Y)</p>
        </div>
        <span style={{ marginLeft: 10, background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "2px 6px", fontSize: 9, color: C.prem, fontWeight: 700 }}>
          {isNecessaryDenied ? "X necessary for Y" : "X implies Y"}
        </span>
      </div>
      <div style={{ borderTop: `1px dashed ${C.border}`, paddingTop: 10 }}>
        <span style={{ fontSize: 10, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Therefore...</span>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {isAffirmConsequent ? (
            <>
              <div style={{ background: C.yBg, border: `1px dashed ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{yLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(Y observed)</p>
              </div>
              <div style={{ padding: "0 8px" }}><span style={{ fontSize: 16, color }}>→</span></div>
              <div style={{ background: C.xBg, border: `1px dashed ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{xLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(assumes X)</p>
              </div>
            </>
          ) : isNecessaryDenied ? (
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
          ) : isModusTollens ? (
            <>
              <div style={{ background: C.yBg, border: `1px dashed ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{notYLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(not Y)</p>
              </div>
              <div style={{ padding: "0 8px" }}><span style={{ fontSize: 16, color }}>→</span></div>
              <div style={{ background: C.xBg, border: `1px dashed ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{xLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(X)</p>
              </div>
            </>
          ) : isModusPonens ? (
            <>
              <div style={{ background: C.xBg, border: `1px dashed ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{xLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(X)</p>
              </div>
              <div style={{ padding: "0 8px" }}><span style={{ fontSize: 16, color }}>→</span></div>
              <div style={{ background: C.yBg, border: `1px dashed ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{yLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(Y)</p>
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
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: stage >= 2 ? 14 : 0, flexWrap: "wrap" }}>
        <div style={{ background: C.xBg, border: `1.5px solid ${C.x}`, borderRadius: 8, padding: "10px 16px", opacity: stage >= 1 ? 1 : 0.2, transition: "opacity 0.5s" }}>
          <p style={{ margin: 0, fontSize: 14, color: C.x, fontWeight: 600 }}>Arrive Late</p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>(X)</p>
        </div>
        <div style={{ padding: "0 10px", opacity: stage >= 1 ? 1 : 0.2, transition: "opacity 0.5s" }}>
          <span style={{ fontSize: 18, color: C.prem }}>→</span>
        </div>
        <div style={{ background: C.yBg, border: `1.5px solid ${C.y}`, borderRadius: 8, padding: "10px 16px", opacity: stage >= 1 ? 1 : 0.2, transition: "opacity 0.5s" }}>
          <p style={{ margin: 0, fontSize: 14, color: C.y, fontWeight: 600 }}>Get Fired</p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>(Y)</p>
        </div>
        <div style={{ marginLeft: 12, opacity: stage >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
          <span style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "3px 8px", fontSize: 10, color: C.prem, fontWeight: 700 }}>X implies Y</span>
        </div>
      </div>
      {stage >= 2 && (
        <div style={{ borderTop: `1px dashed ${C.border}`, margin: "0 0 14px", paddingTop: 14 }}>
          <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Observed...</span>
        </div>
      )}
      {stage >= 2 && (
        <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
          <div style={{ background: C.yBg, border: `1.5px dashed ${C.y}`, borderRadius: 8, padding: "10px 16px" }}>
            <p style={{ margin: 0, fontSize: 14, color: C.y, fontWeight: 600 }}>Lost your job</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>(Y observed)</p>
          </div>
          <div style={{ padding: "0 10px" }}>
            <span style={{ fontSize: 18, color: stage >= 3 ? C.fail : C.muted }}>→</span>
          </div>
          {stage >= 3 ? (
            <div style={{ background: C.xBg, border: `1.5px dashed ${C.x}`, borderRadius: 8, padding: "10px 16px" }}>
              <p style={{ margin: 0, fontSize: 14, color: C.x, fontWeight: 600 }}>Must have arrived late</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>(assumes X)</p>
            </div>
          ) : (
            <div style={{ background: "#1e2030", border: `1.5px dashed ${C.border}`, borderRadius: 8, padding: "10px 16px" }}>
              <p style={{ margin: 0, fontSize: 14, color: C.muted }}>?</p>
            </div>
          )}
          {stage >= 3 && (
            <div style={{ marginLeft: 12 }}>
              <span style={{ background: C.failBg, border: `1px solid ${C.fail}`, borderRadius: 6, padding: "3px 8px", fontSize: 10, color: C.fail, fontWeight: 700 }}>Y observed → assumes X (affirming the consequent)</span>
            </div>
          )}
        </div>
      )}
      {stage >= 3 && (
        <div style={{ marginTop: 14, background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 8, padding: "10px 14px" }}>
          <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>THE PATTERN</span>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
            The structure is: <strong style={{ color: C.x }}>X</strong> implies <strong style={{ color: C.y }}>Y</strong>; <strong style={{ color: C.y }}>Y</strong> is observed; therefore <strong style={{ color: C.x }}>X</strong> must have happened. This is called <em>affirming the consequent</em>. It assumes that because the result happened, one specific cause must be responsible. But other causes could explain Y. Now find the option with the same pattern.
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
            Break the argument into its <strong style={{ color: C.prem }}>logical structure</strong>. Pay attention to the direction of reasoning: does it go from cause to effect, or from effect back to cause?
          </p>
        </div>
        <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
          For this argument, let <strong style={{ color: C.x }}>X</strong> = arriving late for work and <strong style={{ color: C.y }}>Y</strong> = getting fired.
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
              This argument commits the fallacy of <strong style={{ color: C.accent }}>affirming the consequent</strong>. It says: X implies Y. Y happened. Therefore X happened. But that does not follow. Just because arriving late leads to getting fired doesn't mean that getting fired proves you arrived late. There could be many other reasons for losing a job. The trickiest distractors will use valid reasoning (like modus tollens or denying a necessary condition) that looks superficially similar but points in the wrong logical direction.
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
    <div
      style={{
        background: expanded ? (o.ok ? C.conclBg : C.failBg) : "#1e2030",
        border: `1.5px solid ${bc}`,
        borderRadius: 12,
        padding: "14px 18px",
        cursor: "pointer",
        transition: "all 0.3s",
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(12px)",
      }}
      onClick={onClick}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{
          background: expanded ? (o.ok ? C.ok : C.fail) : C.accent,
          borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: C.white, flexShrink: 0,
        }}>
          {expanded ? (o.ok ? "✓" : "✗") : o.letter}
        </span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.6 }}>{o.text}</p>
          {expanded && (
            <div style={{ marginTop: 10 }}>
              <div style={{ background: "#151722", borderRadius: 10, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{
                    background: `${o.ok ? C.concl : C.fail}22`,
                    border: `1px solid ${o.ok ? C.concl : C.fail}`,
                    borderRadius: 6, padding: "2px 8px", fontSize: 10,
                    color: o.ok ? C.concl : C.fail, fontWeight: 700,
                  }}>OPTION {o.letter}</span>
                  <span style={{ fontSize: 10, color: C.muted, fontStyle: "italic" }}>{o.validity}</span>
                </div>
                <MiniChain
                  xLabel={o.xLabel}
                  yLabel={o.yLabel}
                  notXLabel={o.notXLabel}
                  notYLabel={o.notYLabel}
                  structure={o.structure}
                  color={o.ok ? C.concl : C.fail}
                />
              </div>
              <div style={{
                marginTop: 10, padding: "10px 14px",
                background: o.ok ? C.conclBg : C.failBg,
                borderRadius: 8, fontSize: 13,
                color: o.ok ? C.concl : C.fail,
                lineHeight: 1.6,
                borderLeft: `3px solid ${o.ok ? C.ok : C.fail}`,
              }}>
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
    <div style={{
      minHeight: "100vh", background: C.bg,
      fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif",
      letterSpacing: 0.2, padding: "24px 16px",
    }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
              borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700,
              color: C.white, letterSpacing: 1,
            }}>TARA</span>
            <span style={{ fontSize: 12, color: C.muted }}>Critical Thinking</span>
            <span style={{ fontSize: 12, color: C.muted }}>·</span>
            <span style={{ fontSize: 12, color: C.accentLight }}>Matching Arguments</span>
          </div>
          <h1 style={{
            fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px",
            fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
            fontStyle: "italic", letterSpacing: 0.5,
          }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 28</p>
        </div>

        {/* Step Nav */}
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

        {/* Step Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{
            background: C.accent, borderRadius: 6, width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: C.white,
          }}>{step + 1}</span>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.white, margin: 0 }}>{stepsMeta[step].title}</h2>
        </div>

        {/* Step 0: Read */}
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

        {/* Step 1: Structure */}
        {step === 1 && <StructureExtractor />}

        {/* Step 2: Options */}
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
                <span style={{
                  background: `${C.accent}22`, border: `1px solid ${C.accent}`,
                  borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.accent, fontWeight: 700,
                }}>PASSAGE STRUCTURE (from Step 1)</span>
                <span style={{ fontSize: 10, color: C.muted, fontStyle: "italic" }}>Invalid (affirming the consequent)</span>
              </div>
              <MiniChain
                xLabel="Arrive Late"
                yLabel="Get Fired"
                notXLabel="Didn't arrive late"
                notYLabel="Didn't get fired"
                structure="X implies Y; Y; therefore X"
                color={C.accent}
              />
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 14 }}>
              <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>
                <strong style={{ color: C.assum }}>Click each option</strong> to see its structure and compare against the passage:
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {opts.map((o, i) => (
                <OptionCard
                  key={o.letter}
                  o={o}
                  expanded={expanded === o.letter}
                  animate={optAnim[i]}
                  onClick={() => setExpanded(p => p === o.letter ? null : o.letter)}
                />
              ))}
            </div>
          </>
        )}

        {/* Nav Buttons */}
        <div style={{ display: "flex", gap: 12, paddingBottom: 32 }}>
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            style={{
              flex: 1, padding: "13px 20px", borderRadius: 10,
              border: `1px solid ${C.border}`,
              background: step === 0 ? C.card : "#1e2030",
              color: step === 0 ? C.muted : C.text,
              fontSize: 14, fontWeight: 600,
              cursor: step === 0 ? "not-allowed" : "pointer",
              opacity: step === 0 ? 0.4 : 1,
              fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif",
            }}
          >← Previous</button>
          <button
            onClick={() => setStep(Math.min(2, step + 1))}
            disabled={step === 2}
            style={{
              flex: 1, padding: "13px 20px", borderRadius: 10, border: "none",
              background: step === 2 ? "#1e2030" : `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
              color: step === 2 ? C.muted : C.white,
              fontSize: 14, fontWeight: 600,
              cursor: step === 2 ? "not-allowed" : "pointer",
              opacity: step === 2 ? 0.4 : 1,
              fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif",
            }}
          >Next →</button>
        </div>
      </div>
    </div>
  );
}