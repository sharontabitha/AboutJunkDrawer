export function ContentEditor({ item, type, onClose, onSave }) {
  const part = type === "part";
  return <div className="editor" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><section className="editor-panel page-enter" role="dialog" aria-modal="true" aria-label={`${item ? "Edit" : "Add"} ${type}`}><button type="button" className="close" onClick={onClose} aria-label="Close">×</button><h2>{item ? "Edit" : "Add"} {part ? "part" : "article"}</h2><form onSubmit={onSave}>
    <label htmlFor="content-title">{part ? "Name" : "Title"}</label><input id="content-title" name="title" defaultValue={part ? item?.name : item?.title} required/>
    {part && <><label htmlFor="content-category">Category</label><select id="content-category" name="category" defaultValue={item?.cat || "Computer"}><option>Computer</option><option>Microcontroller</option><option>Component</option></select></>}
    <label htmlFor="content-body">{part ? "Description" : "Content"}</label><textarea id="content-body" name="body" rows="6" defaultValue={part ? item?.desc : item?.body} required/>
    {part && <><label htmlFor="content-spec">Key specification (optional)</label><input id="content-spec" name="spec" defaultValue={item?.spec}/></>}
    <label htmlFor="content-image">Picture (optional)</label><input id="content-image" name="image" type="file" accept="image/*"/>
    {item?.img && <p>Choose a new image to replace the current one.</p>}
    <button className="pill" type="submit">{item ? "Save changes" : part ? "Save part" : "Publish article"}</button>
  </form></section></div>;
}