export function SiteHeader({ active = "home", admin = false }) {
  return <header><div className="wrap bar"><a className="logo" href="/index.html">junk<span>drawer</span></a>{admin ? <nav><a href="/index.html">Public site</a></nav> : <nav><a className={active === "home" ? "active" : ""} href="/index.html#home">Home</a><a className={active === "parts" ? "active" : ""} href="/index.html#parts">Parts</a><a className={active === "articles" ? "active" : ""} href="/index.html#articles">Articles</a></nav>}</div></header>;
}

export function SiteFooter() {
  return <footer><div className="wrap"><section><h3>junkdrawer</h3><p>Electronics and computing, explained simply.</p></section><section><h3>Contact</h3><p>Instagram: <a href="https://instagram.com/junkdrawer.io" target="_blank" rel="noreferrer">@junkdrawer.io</a></p><p>WhatsApp / phone: <a href="https://wa.me/62895340815111" target="_blank" rel="noreferrer">+62 895 3408 15111</a></p></section></div></footer>;
}