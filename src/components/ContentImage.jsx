import { Illustration } from "./Illustration.jsx";

export function ContentImage({ item, type }) {
  const label = item.name || item.title || "Electronics illustration";
  if (item.img?.startsWith("data:image/")) {
    return <img className="pic" src={item.img} alt={label} loading="lazy"/>;
  }
  if (type === "article") {
    return <svg className="pic" viewBox="0 0 160 100" role="img" aria-label={label}><rect width="160" height="100" fill="#f7d6d0"/><path d="M46 24h68v52H46zM58 38h44M58 50h44M58 62h30" fill="none" stroke="#4a4a4a" strokeWidth="4"/></svg>;
  }
  return <Illustration label={label}/>;
}