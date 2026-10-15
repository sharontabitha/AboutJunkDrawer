import { useEffect, useState } from "react";
import { ArticleCard } from "../components/ArticleCard.jsx";
import { ContentDialog } from "../components/ContentDialog.jsx";
import { DragonFacts } from "../components/DragonFacts.jsx";
import { PartCard } from "../components/PartCard.jsx";
import { SiteFooter, SiteHeader } from "../components/SiteLayout.jsx";
import { useContent } from "../hooks/useContent.js";

const categories = ["All", "Computer", "Microcontroller", "Component"];

export function PublicPage() {
  const { content, loading, error } = useContent();
  const [view, setView] = useState(() => location.hash.slice(1) || "home");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const updateRoute = () => { setView(location.hash.slice(1) || "home"); setSelected(null); };
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  const visibleParts = content.parts.filter(item => (category === "All" || item.cat === category) && `${item.name} ${item.desc} ${item.cat}`.toLowerCase().includes(query.toLowerCase()));
  const partCard = (item, index) => <PartCard key={item.id} item={item} index={index} onOpen={() => setSelected({ item, type: "part" })}/>;
  const articleCard = (item, index) => <ArticleCard key={item.id} item={item} index={index} onOpen={() => setSelected({ item, type: "article" })}/>;

  return <>
    <SiteHeader active={view}/>
    <main className="wrap page-enter" key={view}>
      {error ? <p className="empty" role="alert">Supabase could not load the catalog: {error}. Run supabase/schema.sql in the Supabase SQL Editor.</p> : loading ? <p className="empty" role="status">Loading the parts library…</p> : view === "parts" ? <><h1 className="section-title">Parts library</h1><div className="tools"><input type="search" placeholder="Search resistor, ESP32, RAM…" value={query} onChange={event => setQuery(event.target.value)} aria-label="Search parts"/>{categories.map(value => <button key={value} type="button" className={`chip ${category === value ? "active" : ""}`} onClick={() => setCategory(value)}>{value}</button>)}</div><div className="grid">{visibleParts.map(partCard)}{visibleParts.length === 0 && <p className="empty">No matching parts in the database yet.</p>}</div></> : view === "articles" ? <><h1 className="section-title">Technology articles</h1><div className="grid">{[...content.articles].reverse().map(articleCard)}{content.articles.length === 0 && <p className="empty">No articles in the database yet.</p>}</div></> : <>
        <section className="hero"><span className="tag">A FRIENDLY FIELD GUIDE</span><h1>Everything in the drawer, explained.</h1><p>Plain-language guides to computer parts, microcontrollers and electronic components. Browse, learn, build.</p></section>
        <h2>Latest parts<a className="ghost" href="/index.html#parts">See all</a></h2><div className="grid">{[...content.parts].reverse().slice(0, 4).map(partCard)}{content.parts.length === 0 && <p className="empty">Add parts from the admin page to begin.</p>}</div>
        <h2>Technology articles<a className="ghost" href="/index.html#articles">See all</a></h2><div className="grid">{[...content.articles].reverse().slice(0, 3).map(articleCard)}{content.articles.length === 0 && <p className="empty">Published articles will appear here.</p>}</div>
      </>}
    </main>
    <SiteFooter/>
    <DragonFacts/>
    {selected && <ContentDialog item={selected.item} type={selected.type} onClose={() => setSelected(null)}/>}
  </>;
}