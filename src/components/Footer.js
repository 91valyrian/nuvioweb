export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <b>NUVIO</b>
          <p className="muted">Branding Websites that elevate value.</p>
        </div>
        <div className="footer-right">
          <a href="/work">Work</a>
          <a href="/contact">Contact</a>
          {/* <a href="/privacy">Privacy</a> */}
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          © {year} NUVIO. All rights reserved.
        </div>
      </div>
    </footer>
  );
}