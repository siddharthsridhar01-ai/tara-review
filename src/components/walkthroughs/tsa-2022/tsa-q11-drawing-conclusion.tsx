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
  "suburban spread": "The expansion of built-up residential areas beyond the existing boundaries of a city, into surrounding countryside or less developed land.",
  "urban centres": "The central, most densely populated parts of a city, typically where most businesses and services are concentrated.",
  "limiting factor": "The single constraint that most restricts or controls a process. If this constraint is removed, the process can continue further.",
  "congestion": "A situation where roads are so full of vehicles that traffic moves very slowly or stops. Often caused by stop-start driving patterns.",
  "driverless cars": "Vehicles that use technology to navigate and drive without human input. Also called autonomous or self-driving cars.",
};

const sentenceFacts = [
  {
    id: "f1",
    sentence: "People are attracted to cities because of the job opportunities that they bring.",
    prompt: "What does this tell us about why people move to cities?",
    options: [
      { id: "a", text: "Jobs pull people towards cities", correct: true, fb: "" },
      { id: "b", text: "Cities have better quality of life than rural areas", correct: false, fb: "The passage only mentions job opportunities as the reason people are attracted to cities, not quality of life more broadly." },
      { id: "c", text: "Everyone prefers living in cities", correct: false, fb: "The passage says people are attracted to cities for jobs, but it also mentions forces that push people away. Not everyone prefers city living." },
    ],
    factLabel: "Jobs attract people towards cities",
    factQuote: "People are attracted to cities because of the job opportunities that they bring.",
  },
  {
    id: "f2",
    sentence: "At the same time, house prices tend to push people away from urban centres. The draw of healthy living and green environments similarly pulls people towards less urban environments, further from city centres.",
    prompt: "What forces push people away from cities?",
    options: [
      { id: "a", text: "Crime and pollution make cities unpleasant", correct: false, fb: "The passage doesn't mention crime or pollution. It specifically cites house prices and the appeal of healthy living and green environments." },
      { id: "b", text: "High house prices and the appeal of green, healthy environments push people out of cities", correct: true, fb: "" },
      { id: "c", text: "People can no longer afford to live anywhere in cities", correct: false, fb: "The passage says house prices 'tend to push people away,' not that cities are completely unaffordable. This overstates the claim." },
    ],
    factLabel: "House prices and desire for green living push people away from cities",
    factQuote: "At the same time, house prices tend to push people away from urban centres. The draw of healthy living and green environments similarly pulls people towards less urban environments, further from city centres.",
  },
  {
    id: "f3",
    sentence: "The limiting factor in suburban spread – the expansion of cities beyond their existing boundaries – is often travel time, by either public or private means.",
    prompt: "What currently limits how far cities can expand?",
    options: [
      { id: "a", text: "Government regulations on building new homes", correct: false, fb: "The passage doesn't mention regulations. It specifically identifies travel time as the limiting factor in suburban spread." },
      { id: "b", text: "The cost of building new houses on the city outskirts", correct: false, fb: "Building costs aren't mentioned. The passage says travel time is the key constraint on how far cities expand." },
      { id: "c", text: "Travel time is the main constraint on how far cities can spread", correct: true, fb: "" },
    ],
    factLabel: "Travel time is the main limit on suburban spread",
    factQuote: "The limiting factor in suburban spread – the expansion of cities beyond their existing boundaries – is often travel time, by either public or private means.",
  },
  {
    id: "f4",
    sentence: "One of the appeals of driverless cars is that they are set to cut delays by up to 40 per cent because they switch lanes more efficiently, drive closer to the vehicle in front, and travel at a constant speed without repeatedly braking and accelerating, which is the main cause of congestion.",
    prompt: "What impact could driverless cars have on travel?",
    options: [
      { id: "a", text: "Driverless cars will eliminate all traffic congestion", correct: false, fb: "The passage says delays could be cut 'by up to 40 per cent,' not eliminated entirely. Watch for absolute claims that go beyond the evidence." },
      { id: "b", text: "Driverless cars could reduce travel delays by up to 40%", correct: true, fb: "" },
      { id: "c", text: "Driverless cars are dangerous because they drive too close together", correct: false, fb: "The passage presents driving closer together as an advantage that reduces congestion, not as a danger." },
    ],
    factLabel: "Driverless cars could cut travel delays by up to 40%",
    factQuote: "One of the appeals of driverless cars is that they are set to cut delays by up to 40 per cent because they switch lanes more efficiently, drive closer to the vehicle in front, and travel at a constant speed without repeatedly braking and accelerating, which is the main cause of congestion.",
  },
];

const keyFacts = sentenceFacts.map((sf, i) => ({
  id: sf.id,
  label: sf.factLabel,
  quote: sf.factQuote,
}));

const directionOptions = [
  { id: "d1", text: "Driverless cars will completely transform where people choose to live", isCorrect: false, feedback: "This is too strong. The passage suggests driverless cars could reduce travel time, which is the limiting factor on suburban spread, but 'completely transform' goes well beyond what the facts support. A 40% reduction in delays is significant but not transformative of all living choices." },
  { id: "d2", text: "Driverless cars could loosen the current constraint on how far cities expand", isCorrect: true, feedback: "Exactly. Travel time limits suburban spread. Driverless cars reduce travel time. So driverless cars could weaken that limiting factor, allowing some further expansion. This is a careful, logical chain that doesn't overstate the evidence." },
  { id: "d3", text: "People should move out of cities and rely on driverless cars for commuting", isCorrect: false, feedback: "This is a recommendation, not a conclusion from the facts. Drawing a Conclusion questions ask what logically follows from the evidence, not what people should do. The passage presents facts, not advice." },
  { id: "d4", text: "City centres will become empty as everyone moves to the suburbs", isCorrect: false, feedback: "Far too extreme. The passage mentions multiple forces: jobs pull people towards cities, while prices and green living push them away. Driverless cars affect only one factor (travel time). Nothing suggests cities would empty out." },
];

const questionOptions = [
  { letter: "A", text: "We can expect some cities to expand beyond their current limits as a result of driverless cars.", verdict: "correct", tag: "FOLLOWS FROM THE FACTS", tagColor: C.concl, tagBg: C.conclBg, explanation: "This carefully follows the chain of reasoning. Travel time is the limiting factor on suburban spread. Driverless cars reduce delays by up to 40%. So driverless cars could weaken the main constraint on expansion, meaning some cities could spread further. The word 'some' is crucial: it doesn't claim all cities will expand, just that expansion is a reasonable expectation. This is the most cautious inference available." },
  { letter: "B", text: "There will no longer be any limits to suburban spread with the introduction of driverless cars.", verdict: "incorrect", tag: "GOES TOO FAR", tagColor: C.tooFar, tagBg: C.tooFarBg, explanation: "The passage says driverless cars could cut delays 'by up to 40 per cent,' not eliminate travel time entirely. A 40% reduction loosens the constraint but doesn't remove it. Saying there will be 'no longer any limits' is an absolute claim the evidence cannot support." },
  { letter: "C", text: "The attractions of living in city centres will disappear once people have access to a driverless car.", verdict: "incorrect", tag: "GOES TOO FAR", tagColor: C.tooFar, tagBg: C.tooFarBg, explanation: "The passage states that jobs attract people to cities. Nothing suggests this attraction will 'disappear.' Driverless cars address travel time, which is only one factor. Jobs, amenities, and other city attractions are not affected by driverless cars according to the passage." },
  { letter: "D", text: "The introduction of driverless cars could mean that there are no longer any green spaces for people to enjoy.", verdict: "incorrect", tag: "NOT SUPPORTED", tagColor: C.offTopic, tagBg: C.offTopicBg, explanation: "This makes a huge leap. Even if some cities expand, the passage provides no evidence that all green spaces would be consumed. The passage mentions green environments as something people value, but nothing connects driverless cars to the total elimination of green spaces." },
  { letter: "E", text: "There will be more people living in suburban environments than city centres after the introduction of driverless cars.", verdict: "incorrect", tag: "GOES TOO FAR", tagColor: C.tooFar, tagBg: C.tooFarBg, explanation: "The passage gives no data on current population distribution between cities and suburbs. We cannot conclude that suburbs will have more people than city centres. We only know the limiting factor on spread could be reduced, not that a majority shift will occur." },
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
      <p style={{ margin: 0 }}>People are attracted to cities because of the job opportunities that they bring. At the same time, house prices tend to push people away from <Vocab term="urban centres">urban centres</Vocab>. The draw of healthy living and green environments similarly pulls people towards less urban environments, further from city centres. The <Vocab term="limiting factor">limiting factor</Vocab> in <Vocab term="suburban spread">suburban spread</Vocab> – the expansion of cities beyond their existing boundaries – is often travel time, by either public or private means. One of the appeals of <Vocab term="driverless cars">driverless cars</Vocab> is that they are set to cut delays by up to 40 per cent because they switch lanes more efficiently, drive closer to the vehicle in front, and travel at a constant speed without repeatedly braking and accelerating, which is the main cause of <Vocab term="congestion">congestion</Vocab>.</p>
    </div>
  );
}

function PassageWithHover({ hoveredFact }) {
  const sentences = [
    { id: "f1", text: "People are attracted to cities because of the job opportunities that they bring." },
    { id: "f2", text: " At the same time, house prices tend to push people away from urban centres. The draw of healthy living and green environments similarly pulls people towards less urban environments, further from city centres." },
    { id: "f3", text: " The limiting factor in suburban spread – the expansion of cities beyond their existing boundaries – is often travel time, by either public or private means." },
    { id: "f4", text: " One of the appeals of driverless cars is that they are set to cut delays by up to 40 per cent because they switch lanes more efficiently, drive closer to the vehicle in front, and travel at a constant speed without repeatedly braking and accelerating, which is the main cause of congestion." },
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
            This passage has <strong style={{ color: C.white }}>no conclusion</strong>. It presents a series of facts about city living, suburban spread, and driverless cars. For each sentence below, identify what key fact it establishes.
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
                      fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif",
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
              You've identified all the key facts. Now let's see them together and look for the logical chain they form. Click <strong style={{ color: C.assum }}>Next</strong> to continue.
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
            Here are the facts you identified. Hover over each one to see it highlighted in the passage. Notice how they form a logical chain.
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
            Notice the chain: people want to leave cities (Facts 1-2) but are limited by <strong>travel time</strong> (Fact 3). Driverless cars could <strong>reduce travel time</strong> significantly (Fact 4). What happens when you reduce the main limiting factor on expansion?
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
              In "Drawing a Conclusion" questions, the correct answer is always the <strong style={{ color: C.concl }}>most cautious inference</strong>. If an option uses absolute language like "no longer any limits," "will disappear," or "no longer any green spaces," it almost certainly goes too far. The right answer will be carefully worded to match what the evidence actually supports, nothing more.
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
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif", letterSpacing: 0.2, padding: "24px 16px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: 1 }}>TARA</span>
            <span style={{ fontSize: 12, color: C.muted }}>Critical Thinking</span>
            <span style={{ fontSize: 12, color: C.muted }}>·</span>
            <span style={{ fontSize: 12, color: C.prem }}>Drawing a Conclusion</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 11</p>
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
              <p style={{ color: C.muted, fontSize: 12, margin: 0, fontStyle: "italic" }}>Remember: the correct answer will be the most cautious inference. Watch out for options that use absolute language or make claims the passage cannot support.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {questionOptions.map((opt, i) => (
                <OptionCard key={opt.letter} opt={opt} expanded={expanded === opt.letter} animate={optAnim[i]} onClick={() => setExpanded(p => p === opt.letter ? null : opt.letter)} />
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
          <button onClick={() => setStep(Math.min(4, step + 1))} disabled={step === 4} style={{
            flex: 1, padding: "13px 20px", borderRadius: 10, border: "none",
            background: step === 4 ? "#1e2030" : `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
            color: step === 4 ? C.muted : C.white,
            fontSize: 14, fontWeight: 600,
            cursor: step === 4 ? "not-allowed" : "pointer",
            opacity: step === 4 ? 0.4 : 1,
            fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif",
          }}>Next →</button>
        </div>
      </div>
    </div>
  );
}