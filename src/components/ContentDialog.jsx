import { ContentImage } from "./ContentImage.jsx";

export function ContentDialog({ item, type, onClose }) {
  const title = type === "part" ? item.name : item.title;
  const body = type === "part" ? item.desc : item.body;
  return <div className="detail" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><section className="detail-panel page-enter" role="dialog" aria-modal="true" aria-label={title}><button type="button" className="close" onClick={onClose} aria-label="Close">×</button><ContentImage item={item} type={type}/><span className="tag">{type === "part" ? item.cat : `Article · ${item.by || "junkdrawer"}`}</span><h2>{title}</h2><p className="body">{body}</p>{type === "part" && item.spec && <span className="spec">{item.spec}</span>}</section></div>;
}