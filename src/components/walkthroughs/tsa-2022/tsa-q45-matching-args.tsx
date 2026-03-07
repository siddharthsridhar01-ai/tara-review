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
  "incident": "A particular event or occurrence, especially one that is notable or unusual.",
  "nervous": "Easily agitated or apprehensive; showing anxiety or unease.",
  "suggests": "Indicates or implies something without stating it directly as certain fact.",
  "parallels": "Closely resembles or mirrors in form, structure, or reasoning.",
};

const structureQs = [
  {
    id: "q1",
    prompt: "What does the passage say we would expect if he was telling the truth?",
    options: [
      { id: "a", text: "He would look nervous (X)", correct: false, fb: "The passage says the opposite. If telling the truth, we would NOT expect nervousness." },
      { id: "b", text: "He would not look nervous (not X)", correct: true, fb: "" },
      { id: "c", text: "He would confess to the police", correct: false, fb: "The passage doesn't mention confessing. It's about how he appears when talking to the police." },
    ],
  },
  {
    id: "q2",
    prompt: "What do we actually observe?",
    options: [
      { id: "a", text: "He does not look nervous (not X)", correct: false, fb: "The passage says the opposite. He does look nervous." },
      { id: "b", text: "He looks nervous (X)", correct: true, fb: "" },
      { id: "c", text: "He refused to talk to police", correct: false, fb: "The passage doesn't say he refused. It describes how he looks while talking to them." },
    ],
  },
  {
    id: "q3",
    prompt: "What does the passage conclude from this observation?",
    options: [
      { id: "a", text: "He is definitely lying", correct: false, fb: "The passage uses 'probably,' not 'definitely.' But more importantly, think about what the conclusion says about the truth-telling claim." },
      { id: "b", text: "He is probably not telling the truth (not Y)", correct: true, fb: "" },
      { id: "c", text: "The police should arrest him", correct: false, fb: "The passage doesn't discuss what the police should do. It draws a conclusion about whether he is telling the truth." },
    ],
  },
];

const opts = [
  {
    letter: "A",
    text: "If everyone who found themselves in the same position as Zach behaved the same way that he did, then we would be in an absolutely terrible situation. Fortunately for us, not everyone does behave in that way.",
    ok: false,
    structure: "If X then Y; not X; no conclusion about Y",
    xLabel: "Everyone behaves like Zach",
    yLabel: "Terrible situation",
    notXLabel: "Not everyone behaves that way",
    notYLabel: "(no conclusion drawn)",
    validity: "Incomplete (no conclusion about Y)",
    expl: "This argument sets up a conditional (if everyone behaved like Zach, terrible situation) and then notes the condition doesn't hold (not everyone does). But it never draws a conclusion about whether the situation is terrible or not. It just says 'fortunately.' The passage observes the consequent and concludes about the antecedent. This option doesn't complete the reasoning.",
  },
  {
    letter: "B",
    text: "The volume of waste they generate shows that most coffee companies do not care about the environmental impact of their businesses. If they did, they wouldn't serve coffee in disposable cups.",
    ok: true,
    structure: "If Y then not X; X; therefore not Y",
    xLabel: "Serve in disposable cups",
    yLabel: "Care about environment",
    notXLabel: "Would not serve in disposable cups",
    notYLabel: "Do not care about environment",
    validity: "Affirming the consequent (same as passage)",
    expl: "If they cared (Y), they wouldn't use disposable cups (not X). They do use disposable cups (X). Therefore they don't care (not Y). This mirrors the passage exactly: if Y were true, we'd expect not X. We observe X. Therefore probably not Y. Both arguments observe something that contradicts what we'd expect if Y were true, and conclude Y is probably false.",
  },
  {
    letter: "C",
    text: "If Bella really wanted to come to the party, then she would have told Anne. Unfortunately, since we are unable to contact Anne, we can't know if Bella really wanted to come.",
    ok: false,
    structure: "If Y then X; can't check X; therefore can't know Y",
    xLabel: "Told Anne",
    yLabel: "Bella wants to come",
    notXLabel: "Can't contact Anne",
    notYLabel: "Can't know if Bella wants to come",
    validity: "Inconclusive (no observation made)",
    expl: "This sets up the same conditional as the passage (if Y, then X) but then says we can't check whether X happened because we can't reach Anne. It draws no conclusion about Y, just says we can't know. The passage actually observes the opposite of what's expected and draws a conclusion. This option gives up without concluding anything.",
  },
  {
    letter: "D",
    text: "If Einstein's theory of relativity is correct, then we would expect light rays from distant stars to bend as they pass our own star. The fact that we are able to observe this suggests Einstein's theory is correct.",
    ok: false,
    structure: "If Y then X; X; therefore Y",
    xLabel: "Light bends near stars",
    yLabel: "Einstein's theory is correct",
    notXLabel: "Light doesn't bend",
    notYLabel: "Theory is incorrect",
    validity: "Affirming the consequent (reverse direction)",
    expl: "If Einstein is right (Y), light bends (X). We observe light bending (X). Therefore Einstein is right (Y). This looks very similar to the passage but goes in the opposite direction. The passage observes the presence of something unexpected (nervousness) and concludes the hypothesis is false. Option D observes the presence of something expected and concludes the hypothesis is true. The passage: expected not-X if Y, got X, so not Y. Option D: expected X if Y, got X, so Y.",
  },
  {
    letter: "E",
    text: "No one who saw the game on Saturday would have thought it was between two sides at the very bottom of the league. If you'd seen the game, you would have agreed that the standard of football was impressively high.",
    ok: false,
    structure: "If X then not Y; if X then Z; no conditional conclusion",
    xLabel: "Saw the game",
    yLabel: "Think bottom of league",
    notXLabel: "Didn't see the game",
    notYLabel: "Wouldn't think bottom",
    validity: "No parallel structure (just two conditionals)",
    expl: "This simply states two things about anyone who saw the game: they wouldn't think it was bottom-of-league teams, and they'd agree the standard was high. There's no observation that leads to a conclusion. It doesn't follow the pattern of 'if Y then expect X, we see not-X/X, therefore not-Y/Y.' It's just describing what seeing the game would make you think.",
  },
];

function Vocab({ term, children }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline" }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ borderBottom: "2px dashed #ffeaa7", cursor: "help", color: "#ffeaa7" }}>{children || term}</span>
      {show && (
        <span style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "#2d3047", border: "1px solid #ffeaa7", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#ffeaa7", width: 260, zIndex: 100, lineHeight: 1.5, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", pointerEvents: "none" }}>
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
        If he was telling the truth about the <Vocab term="incident">incident</Vocab>, then we would not expect him to look so <Vocab term="nervous">nervous</Vocab> talking to the police. The fact that he looks so nervous <Vocab term="suggests">suggests</Vocab> he is probably lying.
      </p>
    </div>
  );
}

function MiniChain({ xLabel, notXLabel, yLabel, notYLabel, structure, color }) {
  const isObserveX = structure.includes("X; therefore not Y") || structure.includes("If Y then not X; X");
  const isObserveExpected = structure.includes("X; therefore Y") && !structure.includes("not");
  const isIncomplete = structure.includes("no conclusion about Y") || structure.includes("no conditional conclusion");
  const isInconclusive = structure.includes("can't check");
  const isAffirmCons = structure === "If Y then X; X; therefore Y";

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 10, flexWrap: "wrap" }}>
        <div style={{ background: C.yBg, border: `1px solid ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
          <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{yLabel}</p>
          <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(Y)</p>
        </div>
        <div style={{ padding: "0 8px" }}><span style={{ fontSize: 16, color: C.prem }}>→</span></div>
        <div style={{ background: C.xBg, border: `1px solid ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
          <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{isObserveX || isAffirmCons ? notXLabel : xLabel}</p>
          <p style={{ margin: 0, fontSize: 10, color: C.muted }}>{isObserveX ? "(not X)" : "(X)"}</p>
        </div>
        <span style={{ marginLeft: 10, background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "2px 6px", fontSize: 9, color: C.prem, fontWeight: 700 }}>
          {isObserveX ? "If Y then not X" : "If Y then X"}
        </span>
      </div>
      <div style={{ borderTop: `1px dashed ${C.border}`, paddingTop: 10 }}>
        <span style={{ fontSize: 10, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>
          {isIncomplete || isInconclusive ? "Observation..." : "Therefore..."}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
          {isIncomplete ? (
            <div style={{ background: C.xBg, border: `1px dashed ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{notXLabel}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(not X / no conclusion)</p>
            </div>
          ) : isInconclusive ? (
            <>
              <div style={{ background: "#1e2030", border: `1px dashed ${C.border}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.muted }}>Can't check X</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(unknown)</p>
              </div>
              <div style={{ padding: "0 8px" }}><span style={{ fontSize: 16, color }}>→</span></div>
              <div style={{ background: "#1e2030", border: `1px dashed ${C.border}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.muted }}>Can't know Y</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(inconclusive)</p>
              </div>
            </>
          ) : isAffirmCons ? (
            <>
              <div style={{ background: C.xBg, border: `1px dashed ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{xLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(X observed)</p>
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
                <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{xLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(X observed)</p>
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
        <div style={{ background: C.yBg, border: `1.5px solid ${C.y}`, borderRadius: 8, padding: "10px 16px", opacity: stage >= 1 ? 1 : 0.2, transition: "opacity 0.5s" }}>
          <p style={{ margin: 0, fontSize: 14, color: C.y, fontWeight: 600 }}>Telling the truth</p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>(Y)</p>
        </div>
        <div style={{ padding: "0 10px", opacity: stage >= 1 ? 1 : 0.2, transition: "opacity 0.5s" }}>
          <span style={{ fontSize: 18, color: C.prem }}>→</span>
        </div>
        <div style={{ background: C.xBg, border: `1.5px solid ${C.x}`, borderRadius: 8, padding: "10px 16px", opacity: stage >= 1 ? 1 : 0.2, transition: "opacity 0.5s" }}>
          <p style={{ margin: 0, fontSize: 14, color: C.x, fontWeight: 600 }}>Would not look nervous</p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>(not X)</p>
        </div>
        <div style={{ marginLeft: 12, opacity: stage >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
          <span style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "3px 8px", fontSize: 10, color: C.prem, fontWeight: 700 }}>If Y then not X</span>
        </div>
      </div>
      {stage >= 2 && (
        <div style={{ borderTop: `1px dashed ${C.border}`, margin: "0 0 14px", paddingTop: 14 }}>
          <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>But we observe...</span>
        </div>
      )}
      {stage >= 2 && (
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: stage >= 3 ? 14 : 0, flexWrap: "wrap" }}>
          <div style={{ background: C.xBg, border: `1.5px dashed ${C.x}`, borderRadius: 8, padding: "10px 16px" }}>
            <p style={{ margin: 0, fontSize: 14, color: C.x, fontWeight: 600 }}>Looks nervous</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>(X)</p>
          </div>
          <div style={{ padding: "0 10px" }}>
            <span style={{ fontSize: 18, color: stage >= 3 ? C.ok : C.muted }}>→</span>
          </div>
          {stage >= 3 ? (
            <div style={{ background: C.yBg, border: `1.5px dashed ${C.y}`, borderRadius: 8, padding: "10px 16px" }}>
              <p style={{ margin: 0, fontSize: 14, color: C.y, fontWeight: 600 }}>Probably lying</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>(not Y)</p>
            </div>
          ) : (
            <div style={{ background: "#1e2030", border: `1.5px dashed ${C.border}`, borderRadius: 8, padding: "10px 16px" }}>
              <p style={{ margin: 0, fontSize: 14, color: C.muted }}>?</p>
            </div>
          )}
          {stage >= 3 && (
            <div style={{ marginLeft: 12 }}>
              <span style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "3px 8px", fontSize: 10, color: C.concl, fontWeight: 700 }}>X observed → not Y</span>
            </div>
          )}
        </div>
      )}
      {stage >= 3 && (
        <div style={{ marginTop: 14, background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 8, padding: "10px 14px" }}>
          <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>THE PATTERN</span>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
            The structure is: if <strong style={{ color: C.y }}>Y</strong> were true, we would expect <strong style={{ color: C.x }}>not X</strong>. We observe <strong style={{ color: C.x }}>X</strong>. Therefore <strong style={{ color: C.y }}>probably not Y</strong>. The argument sees something that contradicts what we would expect if Y were true, and concludes Y is probably false. Now find the option with the same pattern.
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
            Break the argument into its <strong style={{ color: C.prem }}>logical structure</strong>. The passage sets up a conditional: if something were true, we would expect a certain observation. Then it notes what we actually observe.
          </p>
        </div>
        <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
          For this argument, let <strong style={{ color: C.x }}>X</strong> = looking nervous and <strong style={{ color: C.y }}>Y</strong> = telling the truth about the incident.
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
              Watch for the direction of reasoning. The passage says: if Y were true, we'd expect not-X. We observe X. Therefore not Y. The trickiest distractor will be <strong style={{ color: C.accent }}>Option D</strong>, which has the same "if Y then X" setup but observes the <em>expected</em> outcome and concludes Y is true. That is the reverse direction. The correct match must observe something that <em>contradicts</em> the expectation and conclude the hypothesis is false.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function PassageChain() {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 24px", marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ background: `${C.accent}22`, border: `1px solid ${C.accent}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.accent, fontWeight: 700 }}>PASSAGE STRUCTURE (from Step 1)</span>
        <span style={{ fontSize: 10, color: C.muted, fontStyle: "italic" }}>Observes contradiction, concludes hypothesis false</span>
      </div>
      <div style={{ marginTop: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 10, flexWrap: "wrap" }}>
          <div style={{ background: C.yBg, border: `1px solid ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
            <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>Telling the truth</p>
            <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(Y)</p>
          </div>
          <div style={{ padding: "0 8px" }}><span style={{ fontSize: 16, color: C.prem }}>→</span></div>
          <div style={{ background: C.xBg, border: `1px solid ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
            <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>Would not look nervous</p>
            <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(not X)</p>
          </div>
          <span style={{ marginLeft: 10, background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "2px 6px", fontSize: 9, color: C.prem, fontWeight: 700 }}>If Y then not X</span>
        </div>
        <div style={{ borderTop: `1px dashed ${C.border}`, paddingTop: 10 }}>
          <span style={{ fontSize: 10, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Therefore...</span>
          <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
            <div style={{ background: C.xBg, border: `1px dashed ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>Looks nervous</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(X observed)</p>
            </div>
            <div style={{ padding: "0 8px" }}><span style={{ fontSize: 16, color: C.accent }}>→</span></div>
            <div style={{ background: C.yBg, border: `1px dashed ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>Probably lying</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(not Y)</p>
            </div>
          </div>
        </div>
      </div>
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
              {o.letter === "D" && !o.ok && (
                <div style={{ marginTop: 8, padding: "8px 12px", background: C.assumBg, border: `1px solid ${C.assum}44`, borderRadius: 8 }}>
                  <span style={{ fontSize: 10, color: C.assum, fontWeight: 700 }}>TRICKIEST DISTRACTOR</span>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: C.assum, lineHeight: 1.5 }}>
                    This is the closest wrong answer. It has the same "if Y then expect X" conditional setup. But it observes what was <strong style={{ color: C.fail, fontWeight: 700 }}>expected</strong> and concludes Y is true, while the passage observes what was <strong style={{ color: C.prem, fontWeight: 700 }}>unexpected</strong> and concludes Y is false. Opposite directions.
                  </p>
                </div>
              )}
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
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 1</p>
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
                <em>"Which one of the following most closely <Vocab term="parallels">parallels</Vocab> the reasoning used in the above argument?"</em>
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
            <PassageChain />
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
            flex: 1, padding: "13px 20px", borderRadius: 10,
            border: `1px solid ${C.border}`,
            background: step === 0 ? C.card : "#1e2030",
            color: step === 0 ? C.muted : C.text,
            fontSize: 14, fontWeight: 600,
            cursor: step === 0 ? "not-allowed" : "pointer",
            opacity: step === 0 ? 0.4 : 1,
            fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif",
          }}>← Previous</button>
          <button onClick={() => setStep(Math.min(2, step + 1))} disabled={step === 2} style={{
            flex: 1, padding: "13px 20px", borderRadius: 10,
            border: "none",
            background: step === 2 ? "#1e2030" : `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
            color: step === 2 ? C.muted : C.white,
            fontSize: 14, fontWeight: 600,
            cursor: step === 2 ? "not-allowed" : "pointer",
            opacity: step === 2 ? 0.4 : 1,
            fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif",
          }}>Next →</button>
        </div>
      </div>
    </div>
  );
}
