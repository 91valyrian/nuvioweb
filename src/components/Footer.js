import Link from "next/link";

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
          <Link href="/work">Work</Link>
          <Link href="/contact">Contact</Link>
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