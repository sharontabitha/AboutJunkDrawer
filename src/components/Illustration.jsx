const drawings = [
  [/resistor/i, <><path d="M10 50H150"/><rect x="42" y="34" width="76" height="32" rx="16"/><path d="M60 34v32M74 34v32M88 34v32"/><path d="M104 34v32" stroke="#c9a227"/></>],
  [/diode/i, <><path d="M10 50H150M100 30v40"/><path d="M60 30v40l40-20z" fill="#e2b4bd"/></>],
  [/transistor|mosfet/i, <><circle cx="85" cy="50" r="30" fill="#e2b4bd"/><path d="M72 32v36M30 50h42M72 44l22-14v-16M72 56l22 14v16"/></>],
  [/capacitor/i, <><path d="M20 50h52M92 50h48M77 26v48M87 26v48"/></>],
  [/arduino/i, <><rect x="22" y="20" width="116" height="60" rx="6" fill="#e2b4bd"/><rect x="8" y="30" width="24" height="22"/><rect x="72" y="40" width="34" height="18" fill="#4a4a4a"/></>],
  [/cpu|processor/i, <><rect x="42" y="18" width="76" height="64" rx="6" fill="#e2b4bd"/><rect x="60" y="34" width="40" height="32"/><path d="M52 10v8M70 10v8M90 10v8M108 10v8M52 82v8M70 82v8M90 82v8M108 82v8"/></>],
  [/ram|memory/i, <><rect x="14" y="30" width="132" height="38" rx="3" fill="#e2b4bd"/><path d="M32 40h18v18H32zM60 40h18v18H60zM88 40h18v18H88zM116 40h18v18h-18zM20 76h120"/></>],
  [/ssd|storage/i, <><rect x="24" y="23" width="112" height="54" rx="8" fill="#e2b4bd"/><circle cx="48" cy="50" r="10"/><path d="M70 40h48M70 50h36M70 60h42"/></>],
  [/breadboard/i, <><rect x="28" y="12" width="104" height="76" rx="8" fill="#e2b4bd"/><path d="M38 24h84M38 76h84M52 36v28M68 36v28M84 36v28M100 36v28M116 36v28"/></>],
  [/esp|pico|teensy|microcontroller/i, <><rect x="48" y="8" width="64" height="84" rx="6" fill="#e2b4bd"/><rect x="60" y="14" width="40" height="26"/><rect x="68" y="52" width="24" height="24"/><path d="M42 16v68M118 16v68"/></>]
];

export function Illustration({ label }) {
  const artwork = drawings.find(([pattern]) => pattern.test(label))?.[1] || <><path d="M10 70h40l20-30h30l20 30h30"/><circle cx="50" cy="70" r="6" fill="#e2b4bd"/><circle cx="100" cy="40" r="6" fill="#e2b4bd"/></>;
  return <svg className="pic" viewBox="0 0 160 100" role="img" aria-label={label}><rect width="160" height="100" fill="#f7d6d0"/>{artwork}</svg>;
}