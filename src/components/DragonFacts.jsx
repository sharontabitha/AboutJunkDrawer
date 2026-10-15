import { useState } from "react";

const stemFacts = [
  {
    name: "Katherine Johnson",
    text: "Her calculations helped verify the trajectories of America’s first crewed spaceflights. NASA’s astronauts trusted the numbers she checked by hand."
  },
  {
    name: "Grace Hopper",
    text: "She helped create one of the first compiler tools, translating human-readable instructions into code a computer could run."
  },
  {
    name: "Chien-Shiung Wu",
    text: "Her 1956 experiment showed that parity is not conserved in weak nuclear interactions, changing a fundamental idea in physics."
  },
  {
    name: "Mary Jackson",
    text: "A NASA mathematician and engineer, she became NASA’s first Black female engineer and worked to widen access to STEM careers."
  },
  {
    name: "Margaret Hamilton",
    text: "Her team’s Apollo flight software used priority scheduling to recover from an overloaded computer during the Moon landing."
  },
  {
    name: "Radia Perlman",
    text: "Her Spanning Tree Protocol helps Ethernet networks avoid loops while keeping alternate paths ready if a connection fails."
  },
  {
    name: "Katherine Johnson",
    text: "She received the Presidential Medal of Freedom in 2015 for her work advancing American spaceflight."
  },
  {
    name: "Hedy Lamarr",
    text: "She co-invented a frequency-hopping communication method with composer George Antheil; it later inspired spread-spectrum research."
  },
  {
    name: "Barbara McClintock",
    text: "Her discovery of mobile genetic elements, sometimes called jumping genes, earned her the 1983 Nobel Prize in Physiology or Medicine."
  },
  {
    name: "Katalin Karikó",
    text: "Her decades of mRNA research with Drew Weissman helped make mRNA vaccines practical; they shared the 2023 Nobel Prize in Medicine."
  }
];

function PinkDragon() {
  return <svg className="dragon-art" viewBox="0 0 180 170" role="img" aria-label="A cheerful pink dragon scientist">
    <path className="dragon-tail" d="M71 126C47 152 21 140 34 121c5-8 14-6 17 0" fill="none" stroke="#c94f78" strokeWidth="11" strokeLinecap="round"/>
    <path className="dragon-wing" d="M111 72c12-29 39-32 44-24-8 1-10 8-9 13 7-6 16-5 19 1-11 1-14 10-15 18-7 16-24 19-37 13z" fill="#f7b2c8" stroke="#bd5578" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M131 73c-13-10-22-12-30-9m38 9c-9-1-15 2-20 8" fill="none" stroke="#d77b99" strokeWidth="2.5" strokeLinecap="round"/>
    <g className="dragon-float">
      <ellipse cx="91" cy="117" rx="46" ry="39" fill="#f48fb1" stroke="#9f315d" strokeWidth="3"/>
      <ellipse cx="92" cy="121" rx="26" ry="29" fill="#ffdce7"/>
      <path d="M57 78c-5-13-2-22 3-25 2 9 8 12 15 14m47 8c8-12 17-15 23-10-8 4-9 11-9 17" fill="#f7c4d5" stroke="#9f315d" strokeWidth="3" strokeLinejoin="round"/>
      <path d="M73 68c-3-7-2-14 2-17 2 6 7 9 13 10m18 5c3-7 8-11 14-11-4 5-4 10-2 15" fill="#f4d8a9" stroke="#9f315d" strokeWidth="3" strokeLinejoin="round"/>
      <ellipse cx="91" cy="85" rx="43" ry="34" fill="#ffb3ca" stroke="#9f315d" strokeWidth="3"/>
      <ellipse cx="75" cy="84" rx="5" ry="7" fill="#442f38"/>
      <ellipse cx="105" cy="84" rx="5" ry="7" fill="#442f38"/>
      <circle cx="76.5" cy="81.5" r="1.6" fill="#fff"/>
      <circle cx="106.5" cy="81.5" r="1.6" fill="#fff"/>
      <ellipse cx="91" cy="96" rx="17" ry="11" fill="#ffe4ec" stroke="#9f315d" strokeWidth="2.5"/>
      <ellipse cx="85" cy="94" rx="2.5" ry="2" fill="#bd5578"/>
      <ellipse cx="97" cy="94" rx="2.5" ry="2" fill="#bd5578"/>
      <path d="M86 101c3 3 7 3 10 0" fill="none" stroke="#9f315d" strokeWidth="2" strokeLinecap="round"/>
      <path d="M62 91l-10 2m11 3-9 4m78-9 10 2m-11 3 9 4" stroke="#d77b99" strokeWidth="2" strokeLinecap="round"/>
      <path d="M64 124c-12 4-16 14-9 17 7 3 14-1 19-7m52-10c12 4 16 14 9 17-7 3-14-1-19-7" fill="#f48fb1" stroke="#9f315d" strokeWidth="3" strokeLinecap="round"/>
      <path d="M70 144h18m13 0h17" stroke="#9f315d" strokeWidth="4" strokeLinecap="round"/>
      <path d="M110 109c5 3 8 7 9 12" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
    </g>
    <path className="dragon-sparkle sparkle-one" d="M27 67v14m-7-7h14M153 119v12m-6-6h12" fill="none" stroke="#d29a42" strokeWidth="2.5" strokeLinecap="round"/>
    <path className="dragon-sparkle sparkle-two" d="M39 42l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#f4c663"/>
  </svg>;
}

export function DragonFacts() {
  const [open, setOpen] = useState(true);
  const [factIndex, setFactIndex] = useState(0);

  function nextFact() {
    setFactIndex(current => {
      if (stemFacts.length < 2) return current;
      let next = current;
      while (next === current) next = Math.floor(Math.random() * stemFacts.length);
      return next;
    });
  }

  const fact = stemFacts[factIndex];

  return <aside className="dragon-widget" aria-label="STEM fact mascot">
    {open && <section className="dragon-bubble" aria-live="polite" aria-atomic="true">
      <div className="dragon-bubble-top"><span className="dragon-label">✦ WOMEN IN STEM</span><button className="dragon-close" type="button" onClick={() => setOpen(false)} aria-label="Minimize dragon fact">−</button></div>
      <p key={factIndex} className="dragon-fact"><strong>{fact.name}</strong>{fact.text}</p>
      <button className="dragon-next" type="button" onClick={nextFact}>Another fact <span aria-hidden="true">✧</span></button>
    </section>}
    <button className="dragon-toggle" type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-label={open ? "Minimize STEM dragon" : "Open STEM dragon for a fact"}>
      <PinkDragon/>
    </button>
  </aside>;
}
