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
  stamina: "The physical or mental ability to sustain prolonged effort or activity without tiring easily.",
  marathon: "A long-distance running race of 42.195 kilometres (26.2 miles), requiring significant endurance.",
  preparation: "The process of getting ready for something, often involving planning, practice, or training beforehand.",
  natural: "Existing as an inborn quality rather than something learned or acquired through effort.",
};

const structureQs = [
  {
    id: "q1",
    prompt: "What does the first sentence establish about running a marathon without training?",
    options: [
      { id: "a", text: "Everyone can run a marathon without training", correct: false, fb: "The passage says 'some people,' not everyone. It establishes a possibility, not a universal rule." },
      { id: "b", text: "It is possible to run a marathon without training (because of good natural stamina)", correct: true, fb: "" },
      { id: "c", text: "Training is required to run a marathon", correct: false, fb: "The passage says the opposite: some people can do it without training." },
    ],
  },
  {
    id: "q2",
    prompt: "What do we learn about John?",
    options: [
      { id: "a", text: "John has good natural stamina", correct: false, fb: "We don't know that. The passage only says he ran a marathon, not why he could." },
      { id: "b", text: "John ran a marathon (the outcome Y occurred)", correct: true, fb: "" },
      { id: "c", text: "John did no training", correct: false, fb: "That's the conclusion, not what we observe about John. We only know the result." },
    ],
  },
  {
    id: "q3",
    prompt: "What does the argument conclude?",
    options: [
      { id: "a", text: "John definitely did no training", correct: false, fb: "The conclusion is more cautious than that. Look at the hedging language." },
      { id: "b", text: "John has good natural stamina", correct: false, fb: "The passage doesn't conclude anything about John's stamina. It concludes something about his training." },
      { id: "c", text: "It is possible John did no training (maybe not X)", correct: true, fb: "" },
    ],
  },
];

const opts = [
  {
    letter: "A",
    text: "Some experts believe that putting bath salts in the bath increases the likelihood of someone getting eczema. Charlie has eczema. It is likely he puts bath salts in his bath.",
    ok: false,
    structure: "X can cause Y; Y observed; therefore probably X",
    xLabel: "Bath salts",
    yLabel: "Eczema",
    notXLabel: "No bath salts",
    notYLabel: "No eczema",
    validity: "Invalid (affirming the consequent)",
    expl: "This reasons backwards from the effect (eczema) to the cause (bath salts), claiming it is 'likely.' The passage reasons from a possibility (can do Y without X) plus the outcome (Y happened) to conclude X may not have occurred. Option A reverses the direction: it sees Y and assumes X probably happened. The passage sees Y and says X possibly didn't happen.",
  },
  {
    letter: "B",
    text: "Most superheroes have super powers which help them fight villains. Batman doesn't have any super powers. Therefore he is not a superhero.",
    ok: false,
    structure: "Most X have property P; B lacks P; therefore B is not X",
    xLabel: "Superheroes",
    yLabel: "Super powers",
    notXLabel: "Batman",
    notYLabel: "Not a superhero",
    validity: "Invalid (denying a non-universal property)",
    expl: "This says most superheroes have super powers, then denies the property to conclude Batman is not a superhero. The passage establishes a possibility (some can do Y without X), observes Y, and concludes X may not have happened. Option B uses 'most' as a near-universal rule and draws a definitive conclusion ('therefore he is not'), while the passage uses 'some' and draws a hedged conclusion ('it is possible').",
  },
  {
    letter: "C",
    text: "Frogs do not survive in ponds with duck weed. Mustafa has a pond in his garden with frogs living in it. It is possible that Mustafa's pond has frogs and no duck weed.",
    ok: false,
    structure: "X prevents Y; Y observed; therefore possibly not X",
    xLabel: "Duck weed",
    yLabel: "Frogs survive",
    notXLabel: "No duck weed",
    notYLabel: "Frogs don't survive",
    validity: "Valid but different structure (incompatibility, not possibility without)",
    expl: "This looks tempting because of the hedged conclusion ('it is possible'). But the first premise is fundamentally different. The passage says 'it is possible to achieve Y without X' (possibility). Option C says 'X prevents Y entirely' (incompatibility). The passage establishes that X is not always needed for Y. Option C establishes that X and Y cannot coexist. The logical foundations are different even though the surface language is similar.",
  },
  {
    letter: "D",
    text: "It is possible to get lung cancer without ever being a smoker. Jill has got lung cancer. Therefore, she may not be a smoker.",
    ok: true,
    structure: "Possible Y without X; Y observed; therefore maybe not X",
    xLabel: "Being a smoker",
    yLabel: "Lung cancer",
    notXLabel: "Not a smoker",
    notYLabel: "No lung cancer",
    validity: "Matches passage structure exactly",
    expl: "This is the exact same pattern. Premise 1: it is possible to get Y (lung cancer) without X (being a smoker). Premise 2: Y has occurred (Jill has lung cancer). Conclusion: therefore, she may not have X (may not be a smoker). Every element maps directly: the possibility premise, the observed outcome, and the hedged conclusion about the absence of the supposed cause.",
  },
  {
    letter: "E",
    text: "Some trees can be killed by hammering iron nails into them. Oswald's tree died. Therefore, he must have hammered an iron nail into it.",
    ok: false,
    structure: "X can cause Y; Y observed; therefore X must have happened",
    xLabel: "Hammering nails",
    yLabel: "Tree dying",
    notXLabel: "No nails",
    notYLabel: "Tree alive",
    validity: "Invalid (affirming the consequent, strong claim)",
    expl: "This reasons from 'X can cause Y' and 'Y occurred' to conclude 'X must have happened.' The passage reasons from 'Y can happen without X' and 'Y occurred' to conclude 'X may not have happened.' Option E goes in the opposite direction with a much stronger conclusion ('must have' vs. 'may not'). The premise structure is also inverted: the passage says Y is possible without X, while this says X can cause Y.",
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
        Some people have such good <Vocab term="natural">natural</Vocab> <Vocab term="stamina">stamina</Vocab> that they can run a <Vocab term="marathon">marathon</Vocab> with no training. John was able to run a marathon on Saturday. It is possible he did no training in <Vocab term="preparation">preparation</Vocab>.
      </p>
    </div>
  );
}

function MiniChain({ xLabel, notXLabel, yLabel, notYLabel, structure, color }) {
  const isPossibility = structure.includes("Possible Y without X") || structure.includes("possible Y without X");
  const isIncompatibility = structure.includes("X prevents Y");
  const isXCausesY = structure.includes("X can cause Y");
  const isMostX = structure.includes("Most X");

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 10, flexWrap: "wrap" }}>
        {isPossibility ? (
          <>
            <div style={{ background: C.yBg, border: `1px solid ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{yLabel}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(Y)</p>
            </div>
            <div style={{ padding: "0 8px" }}>
              <span style={{ fontSize: 12, color: C.prem }}>possible without</span>
            </div>
            <div style={{ background: C.xBg, border: `1px solid ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{xLabel}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(X)</p>
            </div>
            <span style={{ marginLeft: 10, background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "2px 6px", fontSize: 9, color: C.prem, fontWeight: 700 }}>Y possible without X</span>
          </>
        ) : isIncompatibility ? (
          <>
            <div style={{ background: C.xBg, border: `1px solid ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{xLabel}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(X)</p>
            </div>
            <div style={{ padding: "0 8px" }}>
              <span style={{ fontSize: 12, color: C.fail }}>prevents</span>
            </div>
            <div style={{ background: C.yBg, border: `1px solid ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{yLabel}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(Y)</p>
            </div>
            <span style={{ marginLeft: 10, background: C.failBg, border: `1px solid ${C.fail}`, borderRadius: 6, padding: "2px 6px", fontSize: 9, color: C.fail, fontWeight: 700 }}>X and Y incompatible</span>
          </>
        ) : isXCausesY ? (
          <>
            <div style={{ background: C.xBg, border: `1px solid ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{xLabel}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(X)</p>
            </div>
            <div style={{ padding: "0 8px" }}>
              <span style={{ fontSize: 12, color: C.prem }}>can cause</span>
            </div>
            <div style={{ background: C.yBg, border: `1px solid ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{yLabel}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(Y)</p>
            </div>
            <span style={{ marginLeft: 10, background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "2px 6px", fontSize: 9, color: C.prem, fontWeight: 700 }}>X can cause Y</span>
          </>
        ) : isMostX ? (
          <>
            <div style={{ background: C.xBg, border: `1px solid ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>Most {xLabel}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(most X)</p>
            </div>
            <div style={{ padding: "0 8px" }}>
              <span style={{ fontSize: 16, color: C.prem }}>→</span>
            </div>
            <div style={{ background: C.yBg, border: `1px solid ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{yLabel}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(P)</p>
            </div>
            <span style={{ marginLeft: 10, background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "2px 6px", fontSize: 9, color: C.prem, fontWeight: 700 }}>Most X have P</span>
          </>
        ) : (
          <>
            <div style={{ background: C.xBg, border: `1px solid ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{xLabel}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(X)</p>
            </div>
            <div style={{ padding: "0 8px" }}>
              <span style={{ fontSize: 16, color: C.prem }}>→</span>
            </div>
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
        <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
          {isPossibility ? (
            <>
              <div style={{ background: C.yBg, border: `1px dashed ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{yLabel} observed</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(Y occurred)</p>
              </div>
              <div style={{ padding: "0 8px" }}>
                <span style={{ fontSize: 16, color }}>→</span>
              </div>
              <div style={{ background: C.xBg, border: `1px dashed ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>Maybe {notXLabel.toLowerCase()}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(maybe not X)</p>
              </div>
            </>
          ) : isIncompatibility ? (
            <>
              <div style={{ background: C.yBg, border: `1px dashed ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{yLabel} observed</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(Y present)</p>
              </div>
              <div style={{ padding: "0 8px" }}>
                <span style={{ fontSize: 16, color }}>→</span>
              </div>
              <div style={{ background: C.xBg, border: `1px dashed ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>Possibly {notXLabel.toLowerCase()}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(possibly not X)</p>
              </div>
            </>
          ) : isMostX ? (
            <>
              <div style={{ background: C.yBg, border: `1px dashed ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>Lacks {yLabel.toLowerCase()}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(not P)</p>
              </div>
              <div style={{ padding: "0 8px" }}>
                <span style={{ fontSize: 16, color }}>→</span>
              </div>
              <div style={{ background: C.xBg, border: `1px dashed ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{notYLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(not X)</p>
              </div>
            </>
          ) : structure.includes("Y observed; therefore probably X") || structure.includes("Y observed; therefore X must have happened") ? (
            <>
              <div style={{ background: C.yBg, border: `1px dashed ${C.y}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.y, fontWeight: 600 }}>{yLabel} observed</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(Y occurred)</p>
              </div>
              <div style={{ padding: "0 8px" }}>
                <span style={{ fontSize: 16, color }}>→</span>
              </div>
              <div style={{ background: C.xBg, border: `1px dashed ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{structure.includes("must") ? "Must be" : "Probably"} {xLabel.toLowerCase()}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>{structure.includes("must") ? "(therefore X)" : "(probably X)"}</p>
              </div>
            </>
          ) : (
            <>
              <div style={{ background: C.xBg, border: `1px dashed ${C.x}`, borderRadius: 6, padding: "6px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: C.x, fontWeight: 600 }}>{notXLabel}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>(not X)</p>
              </div>
              <div style={{ padding: "0 8px" }}>
                <span style={{ fontSize: 16, color }}>→</span>
              </div>
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
          <p style={{ margin: 0, fontSize: 14, color: C.y, fontWeight: 600 }}>Running a marathon</p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>(Y)</p>
        </div>
        <div style={{ padding: "0 10px", opacity: stage >= 1 ? 1 : 0.2, transition: "opacity 0.5s" }}>
          <span style={{ fontSize: 12, color: C.prem }}>possible without</span>
        </div>
        <div style={{ background: C.xBg, border: `1.5px solid ${C.x}`, borderRadius: 8, padding: "10px 16px", opacity: stage >= 1 ? 1 : 0.2, transition: "opacity 0.5s" }}>
          <p style={{ margin: 0, fontSize: 14, color: C.x, fontWeight: 600 }}>Training</p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>(X)</p>
        </div>
        <div style={{ marginLeft: 12, opacity: stage >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
          <span style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "3px 8px", fontSize: 10, color: C.prem, fontWeight: 700 }}>Y possible without X</span>
        </div>
      </div>
      {stage >= 2 && (
        <div style={{ borderTop: `1px dashed ${C.border}`, margin: "0 0 14px", paddingTop: 14 }}>
          <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Observed + Therefore...</span>
        </div>
      )}
      {stage >= 2 && (
        <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
          <div style={{ background: C.yBg, border: `1.5px dashed ${C.y}`, borderRadius: 8, padding: "10px 16px" }}>
            <p style={{ margin: 0, fontSize: 14, color: C.y, fontWeight: 600 }}>John ran a marathon</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>(Y occurred)</p>
          </div>
          <div style={{ padding: "0 10px" }}>
            <span style={{ fontSize: 18, color: stage >= 3 ? C.ok : C.muted }}>→</span>
          </div>
          {stage >= 3 ? (
            <div style={{ background: C.xBg, border: `1.5px dashed ${C.x}`, borderRadius: 8, padding: "10px 16px" }}>
              <p style={{ margin: 0, fontSize: 14, color: C.x, fontWeight: 600 }}>Maybe no training</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>(maybe not X)</p>
            </div>
          ) : (
            <div style={{ background: "#1e2030", border: `1.5px dashed ${C.border}`, borderRadius: 8, padding: "10px 16px" }}>
              <p style={{ margin: 0, fontSize: 14, color: C.muted }}>?</p>
            </div>
          )}
          {stage >= 3 && (
            <div style={{ marginLeft: 12 }}>
              <span style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "3px 8px", fontSize: 10, color: C.concl, fontWeight: 700 }}>hedged conclusion</span>
            </div>
          )}
        </div>
      )}
      {stage >= 3 && (
        <div style={{ marginTop: 14, background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 8, padding: "10px 14px" }}>
          <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>THE PATTERN</span>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
            The structure is: it is possible to achieve <strong style={{ color: C.y }}>Y</strong> without <strong style={{ color: C.x }}>X</strong>. <strong style={{ color: C.y }}>Y</strong> has occurred. Therefore, <strong style={{ color: C.x }}>X</strong> may not have happened. The key feature is the <em>hedged, cautious</em> conclusion: "it is possible," "may not." The argument does not claim certainty. Now find the option with the same pattern.
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
            Break the argument into its <strong style={{ color: C.prem }}>logical structure</strong>. Pay close attention to the hedging language: <strong style={{ color: C.assum }}>"some," "possible"</strong>. These signal that the argument does not claim certainty.
          </p>
        </div>
        <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
          For this argument, let <strong style={{ color: C.x }}>X</strong> = training and <strong style={{ color: C.y }}>Y</strong> = running a marathon.
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
              Watch for three things when matching this pattern. First, the <strong style={{ color: C.accent }}>premise type</strong>: it establishes a <em>possibility</em> ("some can," "it is possible to"), not a universal rule or a causal claim. Second, the <strong style={{ color: C.accent }}>observation</strong>: the outcome Y has occurred for a specific case. Third, the <strong style={{ color: C.accent }}>conclusion strength</strong>: it is hedged ("may," "possible"), not definitive ("must," "therefore"). The trickiest distractors will match one or two of these features but not all three.
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
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
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
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 21</p>
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
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>Read the passage carefully. <span style={{ color: C.vocab }}>Hover yellow terms</span> for definitions. This is a <strong style={{ color: C.white }}>Matching Arguments</strong> question:</p>
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
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                <span style={{ background: `${C.accent}22`, border: `1px solid ${C.accent}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.accent, fontWeight: 700 }}>PASSAGE STRUCTURE (from Step 2)</span>
                <span style={{ fontSize: 10, color: C.muted, fontStyle: "italic" }}>Hedged possibility reasoning</span>
              </div>
              <MiniChain xLabel="Training" yLabel="Running a marathon" notXLabel="No training" notYLabel="Can't run marathon" structure="Possible Y without X; Y observed; therefore maybe not X" color={C.accent} />
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
          {step < 2 ? (<button onClick={() => setStep(step + 1)} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Next →</button>) : (<button onClick={() => window.dispatchEvent(new CustomEvent("walkthrough-complete"))} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.ok}, #2ecc71)`, color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>✓ Back to Question Review</button>)}
        </div>
      </div>
    </div>
  );
}