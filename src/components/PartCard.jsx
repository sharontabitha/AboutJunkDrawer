import { ContentImage } from "./ContentImage.jsx";

export function PartCard({ item, index = 0, onOpen, editable = false, onEdit, onDelete }) {
  return <article className={`card card-enter ${onOpen ? "card-open" : ""}`} style={{ "--card-order": index }} role={onOpen ? "button" : undefined} tabIndex={onOpen ? 0 : undefined} onClick={onOpen} onKeyDown={event => { if (onOpen && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onOpen(); } }}>
    <ContentImage item={item} type="part"/>
    <span className="tag">{item.cat}</span>
    <h3>{item.name}</h3>
    <p>{item.desc}</p>
    {item.spec && <span className="spec">{item.spec}</span>}
    {editable && <div className="actions"><button type="button" className="ghost" onClick={event => { event.stopPropagation(); onEdit(); }}>Edit</button><button type="button" className="delete" onClick={event => { event.stopPropagation(); onDelete(); }}>Delete</button></div>}
  </article>;
}