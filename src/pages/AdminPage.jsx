import { useEffect, useState } from "react";
import { ArticleCard } from "../components/ArticleCard.jsx";
import { ContentEditor } from "../components/ContentEditor.jsx";
import { PartCard } from "../components/PartCard.jsx";
import { SiteFooter, SiteHeader } from "../components/SiteLayout.jsx";
import { Toast } from "../components/Toast.jsx";
import { useContent } from "../hooks/useContent.js";
import { authService } from "../services/authService.js";
import { contentService } from "../services/contentService.js";

export function AdminPage() {
  const { content, loading: contentLoading, error: contentError } = useContent();
  const [signedIn, setSignedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [editor, setEditor] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let active = true;
    authService.getCurrentAdmin()
      .then(user => { if (active) setSignedIn(Boolean(user)); })
      .catch(error => { if (active) setLoginError(error.message); })
      .finally(() => { if (active) setCheckingSession(false); });

    let unsubscribe = () => {};
    try {
      const { data: { subscription } } = authService.onAuthStateChange(event => {
        if (event === "SIGNED_OUT") setSignedIn(false);
      });
      unsubscribe = () => subscription.unsubscribe();
    } catch (error) {
      if (active) setLoginError(error.message);
    }
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  async function signIn(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setLoginLoading(true);
    setLoginError("");
    try {
      await authService.signIn(fields.get("email").trim(), fields.get("password"));
      setSignedIn(true);
    } catch (error) {
      setLoginError(error.message || "Sign in failed.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function saveItem(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const editing = editor.item;
    const type = editor.type;
    const file = fields.get("image");
    const id = editing?.id || crypto.randomUUID();
    let imagePath = editing?.imagePath || null;
    let uploadedPath = null;
    let savedMessage = "Changes saved to Supabase.";

    try {
      if (file?.size > 0) {
        uploadedPath = await contentService.uploadImage(file, type, id);
        imagePath = uploadedPath;
      }

      const item = type === "part"
        ? { id, cat: fields.get("category"), name: fields.get("title").trim(), desc: fields.get("body").trim(), spec: fields.get("spec").trim(), imagePath }
        : { id, title: fields.get("title").trim(), by: "junkdrawer", body: fields.get("body").trim(), imagePath };

      await contentService.save(type, item, imagePath, !editing);
      if (uploadedPath && editing?.imagePath) {
        try { await contentService.removeImage(editing.imagePath); } catch { savedMessage = "Saved, but the previous image could not be removed."; }
      }
      setEditor(null);
      setToast(savedMessage);
    } catch (error) {
      if (uploadedPath) {
        try { await contentService.removeImage(uploadedPath); } catch { /* Keep the original save error visible. */ }
      }
      setToast(error.message || "Could not save this item.");
    }
  }

  async function deleteItem(type, id) {
    if (!window.confirm("Delete this item?")) return;
    try {
      await contentService.delete(type, id);
      setToast("Item deleted from Supabase.");
    } catch (error) {
      setToast(error.message || "Could not delete this item.");
    }
  }

  async function signOut() {
    try {
      await authService.signOut();
      setSignedIn(false);
      setEditor(null);
    } catch (error) {
      setToast(error.message || "Could not sign out.");
    }
  }

  async function resetPassword() {
    const email = document.getElementById("email")?.value.trim();
    if (!email) {
      setLoginError("Enter your email first to request a password reset.");
      return;
    }
    try {
      await authService.requestPasswordReset(email);
      setLoginError("Password reset email sent.");
    } catch (error) {
      setLoginError(error.message || "Could not send the reset email.");
    }
  }

  return <>
    <SiteHeader admin/>
    {checkingSession ? <main className="wrap page-enter"><p className="empty">Checking admin session…</p></main> : !signedIn ? <main className="wrap page-enter"><section className="login-panel"><span className="tag">JUNKDRAWER ADMIN</span><h1>Admin sign in</h1><p>Use the admin account created in Supabase.</p><form onSubmit={signIn}><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required/><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required/><p className="login-error" role="status">{loginError}</p><button className="pill" type="submit" disabled={loginLoading}>{loginLoading ? "Signing in…" : "Sign in"}</button><button className="text-button" type="button" onClick={resetPassword}>Forgot password?</button></form></section></main> : <main className="wrap page-enter"><section className="admin-head"><div><span className="tag">ADMIN WORKSPACE</span><h1>Content manager</h1><p>Changes sync through Supabase.</p></div><div className="actions"><a className="ghost" href="/index.html">View public site</a><button type="button" className="pill" onClick={signOut}>Sign out</button></div></section><div className="summary"><div className="stat"><b>{content.parts.length}</b>Parts</div><div className="stat"><b>{content.articles.length}</b>Articles</div></div>{contentError && <p className="empty" role="alert">Supabase content unavailable: {contentError}. Run supabase/schema.sql in the Supabase SQL Editor.</p>}{contentLoading ? <p className="empty">Loading Supabase content…</p> : <><h2>Parts <button type="button" className="pill" onClick={() => setEditor({ type: "part", item: null })}>+ Add part</button></h2><div className="grid">{[...content.parts].reverse().map((item, index) => <PartCard key={item.id} item={item} index={index} editable onEdit={() => setEditor({ type: "part", item })} onDelete={() => deleteItem("part", item.id)}/>)}</div><h2>Articles <button type="button" className="pill" onClick={() => setEditor({ type: "article", item: null })}>+ Add article</button></h2><div className="grid">{[...content.articles].reverse().map((item, index) => <ArticleCard key={item.id} item={item} index={index} editable onEdit={() => setEditor({ type: "article", item })} onDelete={() => deleteItem("article", item.id)}/>)}</div></>}</main>}
    <SiteFooter/>
    {signedIn && editor && <ContentEditor item={editor.item} type={editor.type} onClose={() => setEditor(null)} onSave={saveItem}/>}
    <Toast message={toast}/>
  </>;
}