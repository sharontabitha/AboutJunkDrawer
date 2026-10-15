import { useState } from "react";
import { ArticleCard } from "../components/ArticleCard.jsx";
import { ContentEditor } from "../components/ContentEditor.jsx";
import { PartCard } from "../components/PartCard.jsx";
import { SiteFooter, SiteHeader } from "../components/SiteLayout.jsx";
import { Toast } from "../components/Toast.jsx";
import { useContent } from "../hooks/useContent.js";
import { authService } from "../services/authService.js";
import { contentService } from "../services/contentService.js";

function imageData(file) {
  if (!file || file.size === 0) return Promise.resolve("");
  if (!file.type.startsWith("image/")) return Promise.reject(new Error("Choose an image file."));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Image could not be read."));
    reader.readAsDataURL(file);
  });
}

export function AdminPage() {
  const content = useContent();
  const [signedIn, setSignedIn] = useState(() => authService.isSignedIn());
  const [loginError, setLoginError] = useState("");
  const [editor, setEditor] = useState(null);
  const [toast, setToast] = useState("");

  function signIn(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    if (authService.signIn(fields.get("email").trim(), fields.get("password"))) {
      setSignedIn(true);
      setLoginError("");
    } else {
      setLoginError("That username or password is incorrect.");
    }
  }

  async function saveItem(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const editing = editor.item;
    const type = editor.type;
    const file = fields.get("image");
    let image = editing?.img || "";

    try {
      image = await imageData(file) || image;
    } catch (error) {
      setToast(error.message);
      return;
    }

    const value = type === "part"
      ? { id: editing?.id || crypto.randomUUID(), cat: fields.get("category"), name: fields.get("title").trim(), desc: fields.get("body").trim(), spec: fields.get("spec").trim(), img: image }
      : { id: editing?.id || crypto.randomUUID(), title: fields.get("title").trim(), by: "junkdrawer", body: fields.get("body").trim(), img: image };
    const updated = contentService.update(current => ({
      ...current,
      [type === "part" ? "parts" : "articles"]: editing
        ? current[type === "part" ? "parts" : "articles"].map(item => item.id === editing.id ? value : item)
        : [...current[type === "part" ? "parts" : "articles"], value]
    }));

    setEditor(null);
    setToast(updated ? "Changes saved in this browser." : "Could not save. Try a smaller image.");
  }

  function deleteItem(type, id) {
    if (!window.confirm("Delete this item?")) return;
    const key = type === "part" ? "parts" : "articles";
    const saved = contentService.update(current => ({ ...current, [key]: current[key].filter(item => item.id !== id) }));
    setToast(saved ? "Item deleted." : "Could not save this change.");
  }

  function signOut() {
    authService.signOut();
    setSignedIn(false);
    setEditor(null);
  }

  return <>
    <SiteHeader admin/>
    {!signedIn ? <main className="wrap page-enter"><section className="login-panel"><span className="tag">JUNKDRAWER ADMIN</span><h1>Sign in</h1><p>Manage the parts library and technology articles.</p><form onSubmit={signIn}><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required/><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required/><p className="login-error" role="status">{loginError}</p><button className="pill" type="submit">Sign in</button></form><p className="demo-note">Demo access: <strong>niishimurra@gmail.com</strong> / <strong>drawer123</strong><br/>For local demonstration only. Use a backend for secure public hosting.</p></section></main> : <main className="wrap page-enter"><section className="admin-head"><div><span className="tag">ADMIN WORKSPACE</span><h1>Content manager</h1><p>Changes are saved in this browser.</p></div><div className="actions"><a className="ghost" href="/index.html">View public site</a><button type="button" className="pill" onClick={signOut}>Sign out</button></div></section><div className="summary"><div className="stat"><b>{content.parts.length}</b>Parts</div><div className="stat"><b>{content.articles.length}</b>Articles</div></div><h2>Parts <button type="button" className="pill" onClick={() => setEditor({ type: "part", item: null })}>+ Add part</button></h2><div className="grid">{[...content.parts].reverse().map((item, index) => <PartCard key={item.id} item={item} index={index} editable onEdit={() => setEditor({ type: "part", item })} onDelete={() => deleteItem("part", item.id)}/>)}</div><h2>Articles <button type="button" className="pill" onClick={() => setEditor({ type: "article", item: null })}>+ Add article</button></h2><div className="grid">{[...content.articles].reverse().map((item, index) => <ArticleCard key={item.id} item={item} index={index} editable onEdit={() => setEditor({ type: "article", item })} onDelete={() => deleteItem("article", item.id)}/>)}</div></main>}
    <SiteFooter/>
    {signedIn && editor && <ContentEditor item={editor.item} type={editor.type} onClose={() => setEditor(null)} onSave={saveItem}/>}
    <Toast message={toast}/>
  </>;
}