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
  { id: 1, label: "Identify", title: "Identify the Key Facts" },
  { id: 2, label: "Summary", title: "The Facts Together" },
  { id: 3, label: "Direction", title: "What Do the Facts Suggest?" },
  { id: 4, label: "Options", title: "Evaluate Each Option" },
];

const vocabDefs = {
  "reciprocity": "The practice of exchanging things with others for mutual benefit. Doing something for someone because they did something for you.",
  "correlation": "A statistical relationship between two things, where one tends to change alongside the other. Does not necessarily mean one causes the other.",
  "factor": "A circumstance or element that contributes to a result or outcome.",
  "consistently": "In a way that does not change or vary. Always behaving or performing in the same way.",
  "regardless": "Without being affected or influenced by something. No matter what the circumstances are.",
};

const sentenceFacts = [
  {
    id: "f1",
    sentence: "It is no surprise to hear that we are more likely to help someone we like than someone we don't.",
    prompt: "What does this establish?",
    options: [
      { id: "a", text: "People tend to help those they like more than those they don't", correct: true, fb: "" },
      { id: "b", text: "People only ever help those they like", correct: false, fb: "The passage says 'more likely,' not 'only.' It describes a tendency, not an absolute rule." },
      { id: "c", text: "Liking someone is the only reason people help each other", correct: false, fb: "The passage introduces liking as one factor, not the only one. The very next sentence introduces another factor." },
    ],
    factLabel: "We are more likely to help people we like",
    factQuote: "It is no surprise to hear that we are more likely to help someone we like than someone we don't.",
  },
  {
    id: "f2",
    sentence: "But another factor that influences our behaviour towards others is a sense of reciprocity – the sense that you ought to do something good for someone if they have done something good for you.",
    prompt: "What additional factor is introduced here?",
    options: [
      { id: "a", text: "Reciprocity replaces liking as the main reason for helping", correct: false, fb: "The passage says reciprocity is 'another factor,' not a replacement. Both factors exist." },
      { id: "b", text: "Reciprocity, feeling you should help someone who helped you, also influences helping behaviour", correct: true, fb: "" },
      { id: "c", text: "People always repay favours they receive", correct: false, fb: "The passage describes reciprocity as a 'sense' or feeling, not a guaranteed behaviour. It says people feel they 'ought to,' not that they always do." },
    ],
    factLabel: "Reciprocity (returning favours) also influences helping behaviour",
    factQuote: "But another factor that influences our behaviour towards others is a sense of reciprocity – the sense that you ought to do something good for someone if they have done something good for you.",
  },
  {
    id: "f3",
    sentence: "Psychologists have measured the effect of how much someone (Person 1) likes another person (Person 2) on the extent to which Person 1 will help Person 2 out. While there is a clear correlation here, it fades away in situations where Person 2 had previously done Person 1 a favour.",
    prompt: "What did psychologists find about liking and helping?",
    options: [
      { id: "a", text: "Liking always determines how much you help someone", correct: false, fb: "The passage says the correlation 'fades away' in certain situations. It does not always determine helping." },
      { id: "b", text: "There is no real link between liking someone and helping them", correct: false, fb: "There is a 'clear correlation.' It just disappears when reciprocity is involved." },
      { id: "c", text: "Liking correlates with helping, but this link disappears when a prior favour exists", correct: true, fb: "" },
    ],
    factLabel: "The liking-helping link disappears when a prior favour exists",
    factQuote: "While there is a clear correlation here, it fades away in situations where Person 2 had previously done Person 1 a favour.",
  },
  {
    id: "f4",
    sentence: "In these cases, Person 1 consistently helps Person 2 out equally, regardless of how much they like them.",
    prompt: "What happens when a prior favour exists?",
    options: [
      { id: "a", text: "Person 1 helps Person 2 the same amount no matter how much they like them", correct: true, fb: "" },
      { id: "b", text: "Person 1 helps Person 2 more than usual because of the favour", correct: false, fb: "The passage doesn't say they help more. It says they help equally, regardless of liking. The key point is that liking no longer matters." },
      { id: "c", text: "Person 1 stops caring about Person 2 entirely", correct: false, fb: "Person 1 still helps. The point is that their level of helping becomes consistent regardless of liking, not that they stop caring." },
    ],
    factLabel: "When a favour exists, people help equally regardless of liking",
    factQuote: "In these cases, Person 1 consistently helps Person 2 out equally, regardless of how much they like them.",
  },
];

const keyFacts = sentenceFacts.map((sf, i) => ({
  id: sf.id,
  label: sf.factLabel,
  quote: sf.factQuote,
}));

const directionOptions = [
  { id: "d1", text: "Helping others is always beneficial because it creates a cycle of mutual assistance", isCorrect: false, feedback: "The passage describes how reciprocity works, but it doesn't make a value judgement about whether helping is 'beneficial.' This introduces a claim the facts don't support." },
  { id: "d2", text: "Doing someone a favour can ensure you receive help from them later, even if they don't particularly like you", isCorrect: true, feedback: "Exactly. The facts tell us that when a prior favour exists, people help equally regardless of liking. So doing someone a favour effectively guarantees help in return, bypassing the liking factor. This is a cautious inference that stays within what the evidence supports." },
  { id: "d3", text: "Reciprocity is more important than any other factor in determining human behaviour", isCorrect: false, feedback: "The passage only compares reciprocity with liking, and only in the context of helping behaviour. Calling it 'more important than any other factor' in all 'human behaviour' goes far beyond what the evidence shows." },
  { id: "d4", text: "People who don't receive favours will never help anyone", isCorrect: false, feedback: "The passage says liking still drives helping when no favour exists. People do help without reciprocity. They're just more selective about who they help based on liking." },
];

const questionOptions = [
  { letter: "A", text: "It is always a good idea to help other people out if you possibly can.", verdict: "incorrect", tag: "GOES TOO FAR", tagColor: C.tooFar, tagBg: C.tooFarBg, explanation: "The passage describes how reciprocity works as a psychological mechanism. It never makes a value judgement that helping is 'always a good idea.' This is a moral recommendation that the facts don't support. The passage tells us what happens, not what we should do." },
  { letter: "B", text: "How much a person likes another person is less of a motivating factor in human behaviour than psychologists had supposed.", verdict: "incorrect", tag: "NOT SUPPORTED", tagColor: C.offTopic, tagBg: C.offTopicBg, explanation: "The passage never mentions what psychologists had previously supposed. It describes their findings, but doesn't compare those findings against prior expectations. This introduces an unsupported claim about the history of psychological research." },
  { letter: "C", text: "Reciprocity is the most important motivation behind human behaviour.", verdict: "incorrect", tag: "GOES TOO FAR", tagColor: C.tooFar, tagBg: C.tooFarBg, explanation: "The passage shows reciprocity can override liking in one specific context: helping behaviour. Calling it 'the most important motivation behind human behaviour' extrapolates wildly from a narrow finding. The passage only discusses two factors, and only in one domain." },
  { letter: "D", text: "People who help others out are more likely to end up better rewarded than people who don't.", verdict: "correct", tag: "FOLLOWS FROM THE FACTS", tagColor: C.concl, tagBg: C.conclBg, explanation: "This is the most cautious inference. The facts tell us that doing someone a favour ensures they will help you back, regardless of whether they like you. So people who help others effectively unlock an additional source of return help (reciprocity) on top of whatever help they get from being liked. They end up 'better rewarded' because they activate both mechanisms. Crucially, this uses 'more likely' rather than making an absolute claim." },
  { letter: "E", text: "A person who does not receive help from someone will feel no obligation to offer help in return.", verdict: "incorrect", tag: "NOT SUPPORTED", tagColor: C.offTopic, tagBg: C.offTopicBg, explanation: "The passage tells us what happens when a favour does exist, but says nothing definitive about the absence of obligation when no favour exists. People might still feel obligation from other sources. The passage simply doesn't address this scenario in enough detail to draw this conclusion." },
];

function Vocab({ term, children }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline" }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ borderBottom: "2px dashed #ffeaa7", cursor: "help", color: "#ffeaa7" }}>{children || term}</span>
      {show && (<span style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "#2d3047", border: "1px solid #ffeaa7", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#ffeaa7", width: 260, zIndex: 100, lineHeight: 1.5, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", pointerEvents: "none" }}><span style={{ fontWeight: 700, display: "block", marginBottom: 4 }}>Definition</span>{vocabDefs[term]}</span>)}
    </span>
  );
}

function PassageRaw() {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>It is no surprise to hear that we are more likely to help someone we like than someone we don't. But another <Vocab term="factor">factor</Vocab> that influences our behaviour towards others is a sense of <Vocab term="reciprocity">reciprocity</Vocab> – the sense that you ought to do something good for someone if they have done something good for you. Psychologists have measured the effect of how much someone (Person 1) likes another person (Person 2) on the extent to which Person 1 will help Person 2 out. While there is a clear <Vocab term="correlation">correlation</Vocab> here, it fades away in situations where Person 2 had previously done Person 1 a favour. In these cases, Person 1 <Vocab term="consistently">consistently</Vocab> helps Person 2 out equally, <Vocab term="regardless">regardless</Vocab> of how much they like them.</p>
    </div>
  );
}

function PassageWithHover({ hoveredFact }) {
  const sentences = [
    { id: "f1", text: "It is no surprise to hear that we are more likely to help someone we like than someone we don't." },
    { id: "f2", text: " But another factor that influences our behaviour towards others is a sense of reciprocity – the sense that you ought to do something good for someone if they have done something good for you." },
    { id: "f3", text: " Psychologists have measured the effect of how much someone (Person 1) likes another person (Person 2) on the extent to which Person 1 will help Person 2 out. While there is a clear correlation here, it fades away in situations where Person 2 had previously done Person 1 a favour." },
    { id: "f4", text: " In these cases, Person 1 consistently helps Person 2 out equally, regardless of how much they like them." },
  ];
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>{sentences.map(s => {
        const hl = hoveredFact === s.id;
        return <span key={s.id} style={{ color: hl ? C.prem : "inherit", backgroundColor: hl ? C.premBg : "transparent", padding: hl ? "2px 4px" : 0, borderRadius: 3, borderBottom: hl ? `2px solid ${C.prem}` : "none", transition: "all 0.3s" }}>{s.text}</span>;
      })}</p>
    </div>
  );
}

function IdentifyFactsStep() {
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const completedCount = Object.values(feedback).filter(v => v === "correct").length;
  const allDone = completedCount === sentenceFacts.length;

  const handleAnswer = (factId, optId) => {
    if (feedback[factId] === "correct") return;
    const fact = sentenceFacts.find(f => f.id === factId);
    const opt = fact.options.find(o => o.id === optId);
    setAnswers(p => ({ ...p, [factId]: optId }));
    setFeedback(p => ({ ...p, [factId]: opt.correct ? "correct" : "wrong" }));
  };

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.prem, fontWeight: 700, whiteSpace: "nowrap" }}>STEP 1</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            This passage has <strong style={{ color: C.white }}>no conclusion</strong>. It presents a series of facts about helping behaviour and reciprocity. For each sentence below, identify what key fact it establishes.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
        {sentenceFacts.map((sf, idx) => {
          const fb = feedback[sf.id];
          const isCorrect = fb === "correct";
          const isWrong = fb === "wrong";
          return (
            <div key={sf.id} style={{ background: C.card, border: `1px solid ${isCorrect ? C.prem + "44" : C.border}`, borderRadius: 14, padding: "16px 20px", transition: "all 0.3s" }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ background: `${C.prem}22`, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "2px 6px", fontSize: 9, color: C.prem, fontWeight: 700 }}>SENTENCE {idx + 1}</span>
              </div>
              <p style={{ margin: "0 0 10px", fontSize: 14, color: isCorrect ? C.prem : C.text, lineHeight: 1.7, fontStyle: "italic", transition: "color 0.3s" }}>
                "{sf.sentence}"
              </p>
              <p style={{ margin: "0 0 8px", fontSize: 13, color: C.muted, fontWeight: 600 }}>{sf.prompt}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {sf.options.map(o => {
                  const sel = answers[sf.id] === o.id;
                  const thisCorrect = isCorrect && o.correct;
                  const thisWrong = sel && !o.correct && isWrong;
                  return (
                    <button key={o.id} onClick={() => handleAnswer(sf.id, o.id)} style={{
                      padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                      border: `1.5px solid ${thisCorrect ? C.prem : thisWrong ? C.fail : C.border}`,
                      background: thisCorrect ? C.premBg : thisWrong ? C.failBg : "transparent",
                      color: thisCorrect ? C.prem : thisWrong ? C.fail : C.muted,
                      cursor: isCorrect ? "default" : "pointer",
                      opacity: isCorrect && !thisCorrect ? 0.3 : 1,
                      transition: "all 0.3s",
                      fontFamily: "'Trebuchet MS', 'Gill Sans', Calibri, sans-serif",
                    }}>{o.text}</button>
                  );
                })}
              </div>
              {isWrong && (
                <div style={{ marginTop: 8, padding: "8px 12px", background: C.failBg, border: `1px solid ${C.fail}44`, borderRadius: 8 }}>
                  <p style={{ margin: 0, fontSize: 13, color: C.fail, lineHeight: 1.5 }}>
                    <strong>Try again.</strong> {sf.options.find(o => answers[sf.id] === o.id)?.fb}
                  </p>
                </div>
              )}
              {isCorrect && (
                <div style={{ marginTop: 8, padding: "8px 12px", background: `${C.prem}0a`, border: `1px solid ${C.prem}44`, borderRadius: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ background: `${C.prem}22`, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "2px 6px", fontSize: 9, color: C.prem, fontWeight: 700 }}>FACT {idx + 1}</span>
                    <span style={{ fontSize: 13, color: C.prem, fontWeight: 600 }}>{sf.factLabel}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 20px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 6, background: "#1e2030", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${(completedCount / sentenceFacts.length) * 100}%`, height: "100%", background: C.prem, borderRadius: 3, transition: "width 0.4s" }} />
          </div>
          <span style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap" }}>{completedCount}/{sentenceFacts.length} identified</span>
        </div>
      </div>

      {allDone && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
          <div style={{ background: C.assumBg, border: `1px solid ${C.assum}44`, borderRadius: 10, padding: "12px 16px" }}>
            <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>ALL FACTS IDENTIFIED</span>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
              You've identified all the key facts. Now let's see them together and look for the pattern they form. Click <strong style={{ color: C.assum }}>Next</strong> to continue.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function FactsSummaryStep() {
  const [hoveredFact, setHoveredFact] = useState(null);

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.prem, fontWeight: 700, whiteSpace: "nowrap" }}>STEP 2</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Here are the facts you identified. Hover over each one to see it highlighted in the passage. Notice the pattern they form together.
          </p>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span>
        <PassageWithHover hoveredFact={hoveredFact} />
        <div style={{ marginTop: 10, fontSize: 11, color: C.muted, fontStyle: "italic" }}>Hover over a fact below to highlight it in the passage.</div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px", marginBottom: 18 }}>
        <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>THE FACTS IN A NUTSHELL</span>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          {keyFacts.map((f, i) => (
            <div key={f.id}
              onMouseEnter={() => setHoveredFact(f.id)}
              onMouseLeave={() => setHoveredFact(null)}
              style={{ background: hoveredFact === f.id ? C.premBg : "#1e2030", border: `1px solid ${hoveredFact === f.id ? C.prem : C.border}`, borderRadius: 8, padding: "10px 14px", cursor: "pointer", transition: "all 0.3s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ background: `${C.prem}22`, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "2px 6px", fontSize: 9, color: C.prem, fontWeight: 700 }}>FACT {i + 1}</span>
                <span style={{ fontSize: 13, color: C.prem, fontWeight: 600 }}>{f.label}</span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.5, fontStyle: "italic" }}>"{f.quote}"</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 8, padding: "10px 14px" }}>
          <p style={{ margin: 0, fontSize: 13, color: C.assum, lineHeight: 1.6 }}>
            Notice the pattern: normally, liking determines helping. But when someone has done you a favour, you help them equally <strong>regardless of liking</strong>. This means doing favours for others creates a reliable pathway to receiving help back, one that doesn't depend on being liked.
          </p>
        </div>
      </div>
    </div>
  );
}

function DirectionStep() {
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);

  const handleClick = (d) => {
    if (locked) return;
    setSelected(d.id);
    if (d.isCorrect) setLocked(true);
  };

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
          <span style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.concl, fontWeight: 700, whiteSpace: "nowrap" }}>STEP 3</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Before seeing the real answer options, think about <strong style={{ color: C.concl }}>what direction</strong> the facts point in. What do these facts together suggest?
          </p>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 12 }}>Facts recap</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {keyFacts.map(f => (
            <span key={f.id} style={{ background: C.premBg, border: `1px solid ${C.prem}44`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.prem }}>{f.label}</span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {directionOptions.map(d => {
          const isSel = selected === d.id;
          const isCorrect = isSel && d.isCorrect;
          const isWrong = isSel && !d.isCorrect;
          const bc = isCorrect ? C.concl : isWrong ? C.fail : C.border;
          return (
            <div key={d.id} onClick={() => handleClick(d)} style={{
              background: isCorrect ? C.conclBg : isWrong ? C.failBg : "#1e2030",
              border: `1.5px solid ${bc}`, borderRadius: 12, padding: "14px 18px",
              cursor: locked ? "default" : "pointer", transition: "all 0.3s",
            }}>
              <p style={{ margin: 0, fontSize: 14, color: isCorrect ? C.concl : isWrong ? C.fail : C.text, lineHeight: 1.6 }}>{d.text}</p>
              {isSel && (
                <div style={{ marginTop: 10, padding: "10px 14px", background: isCorrect ? `${C.concl}0a` : C.failBg, borderRadius: 8, fontSize: 13, color: isCorrect ? C.concl : C.fail, lineHeight: 1.6, borderLeft: `3px solid ${isCorrect ? C.concl : C.fail}` }}>
                  {isCorrect && <strong style={{ color: C.ok }}>Correct! </strong>}
                  {isWrong && <strong>Try again. </strong>}
                  {d.feedback}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {locked && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
          <div style={{ background: C.assumBg, border: `1px solid ${C.assum}44`, borderRadius: 10, padding: "12px 16px" }}>
            <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>KEY SKILL</span>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
              In "Drawing a Conclusion" questions, the correct answer is always the <strong style={{ color: C.concl }}>most cautious inference</strong>. If an option uses strong language like "always," "the most important," or makes policy recommendations, it almost certainly goes too far. The right answer will be carefully worded to match what the evidence actually supports, nothing more.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function OptionCard({ opt, expanded, onClick, animate }) {
  const ok = opt.verdict === "correct";
  const bc = expanded ? (ok ? C.ok : C.fail) : C.border;
  return (
    <div style={{ background: expanded ? (ok ? C.conclBg : C.failBg) : "#1e2030", border: `1.5px solid ${bc}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", transition: "all 0.3s", opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(12px)" }} onClick={onClick}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ background: expanded ? (ok ? C.ok : C.fail) : C.accent, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.white, flexShrink: 0 }}>{expanded ? (ok ? "✓" : "✗") : opt.letter}</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.6 }}>{opt.text}</p>
          {expanded && (
            <div style={{ marginTop: 10 }}>
              <div style={{ marginBottom: 8 }}>
                <span style={{ background: `${opt.tagColor}22`, border: `1px solid ${opt.tagColor}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: opt.tagColor, fontWeight: 700 }}>{opt.tag}</span>
              </div>
              <div style={{ padding: "10px 14px", background: ok ? C.conclBg : C.failBg, borderRadius: 8, fontSize: 13, color: ok ? C.concl : C.fail, lineHeight: 1.6, borderLeft: `3px solid ${ok ? C.ok : C.fail}` }}>
                {ok && <span style={{ fontWeight: 700 }}>CORRECT: </span>}{opt.explanation}
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
    if (step === 4) {
      const timers = [0, 1, 2, 3, 4].map(i =>
        setTimeout(() => setOptAnim(p => { const n = [...p]; n[i] = true; return n; }), i * 100)
      );
      return () => timers.forEach(clearTimeout);
    } else {
      setOptAnim([false, false, false, false, false]);
      setExpanded(null);
    }
  }, [step]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Trebuchet MS', 'Gill Sans', Calibri, sans-serif", letterSpacing: 0.2, padding: "24px 16px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: 1 }}>TARA</span>
            <span style={{ fontSize: 12, color: C.muted }}>Critical Thinking</span>
            <span style={{ fontSize: 12, color: C.muted }}>·</span>
            <span style={{ fontSize: 12, color: C.prem }}>Drawing a Conclusion</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 35</p>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {stepsMeta.map(s => (
            <button key={s.id} onClick={() => setStep(s.id)} style={{
              flex: 1, minWidth: 0,
              background: step === s.id ? C.accent : step > s.id ? "rgba(108,92,231,0.15)" : "#1e2030",
              border: `1px solid ${step === s.id ? C.accent : step > s.id ? C.accent + "44" : C.border}`,
              borderRadius: 10, padding: "10px 6px", cursor: "pointer", transition: "all 0.3s",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              fontFamily: "'Trebuchet MS', 'Gill Sans', Calibri, sans-serif",
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, lineHeight: 1 }}>{s.id + 1}</span>
              <span style={{ fontSize: 10, fontWeight: step === s.id ? 700 : 500, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, whiteSpace: "nowrap" }}>{s.label}</span>
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
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>Read the passage carefully. <span style={{ color: C.vocab }}>Hover yellow terms</span> for definitions. This is a <strong style={{ color: C.white }}>Drawing a Conclusion</strong> question:</p>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}><em>"Which one of the following can be drawn as a conclusion from the above passage?"</em></div>
              <div style={{ marginTop: 12, background: C.premBg, border: `1px solid ${C.prem}44`, borderRadius: 10, padding: "12px 16px" }}>
                <p style={{ margin: 0, fontSize: 13, color: C.prem, lineHeight: 1.6 }}>
                  <strong>Drawing a Conclusion questions</strong> give you a passage with no conclusion at all, just a series of facts. Your job is to work out what logically follows from these facts, without going beyond what the evidence supports. The correct answer will always be the most cautious inference.
                </p>
              </div>
            </div>
          </>
        )}

        {step === 1 && <IdentifyFactsStep />}
        {step === 2 && <FactsSummaryStep />}
        {step === 3 && <DirectionStep />}

        {step === 4 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}><em>"Which one of the following can be drawn as a conclusion from the above passage?"</em></div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span>
              <PassageRaw />
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 14 }}>
              <p style={{ color: C.muted, fontSize: 14, margin: "0 0 8px" }}><strong style={{ color: C.assum }}>Click each option</strong> to see why it's right or wrong:</p>
              <p style={{ color: C.muted, fontSize: 12, margin: 0, fontStyle: "italic" }}>Remember: the correct answer will be the most cautious inference. Watch out for options that go too far or introduce unsupported claims.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {questionOptions.map((opt, i) => (
                <OptionCard key={opt.letter} opt={opt} expanded={expanded === opt.letter} animate={optAnim[i]} onClick={() => setExpanded(p => p === opt.letter ? null : opt.letter)} />
              ))}
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 12, paddingBottom: 32 }}>
          {step < 4 ? (<button onClick={() => setStep(step + 1)} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Next →</button>) : (<button onClick={() => window.dispatchEvent(new CustomEvent("walkthrough-complete"))} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.ok}, #2ecc71)`, color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>✓ Back to Question Review</button>)}
        </div>
      </div>
    </div>
  );
}