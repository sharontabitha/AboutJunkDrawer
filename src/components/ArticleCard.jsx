import { ContentImage } from "./ContentImage.jsx";

export function ArticleCard({ item, index = 0, onOpen, editable = false, onEdit, onDelete }) {
  const excerpt = item.body.length > 130 ? `${item.body.slice(0, 130)}…` : item.body;
  return <article className={`card card-enter ${onOpen ? "card-open" : ""}`} style={{ "--card-order": index }} role={onOpen ? "button" : undefined} tabIndex={onOpen ? 0 : undefined} onClick={onOpen} onKeyDown={event => { if (onOpen && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onOpen(); } }}>
    <ContentImage item={item} type="article"/>
    <span className="tag">Article · {item.by || "junkdrawer"}</span>
    <h3>{item.title}</h3>
    <p>{excerpt}</p>
    {editable && <div className="actions"><button type="button" className="ghost" onClick={event => { event.stopPropagation(); onEdit(); }}>Edit</button><button type="button" className="delete" onClick={event => { event.stopPropagation(); onDelete(); }}>Delete</button></div>}
  </article>;
}