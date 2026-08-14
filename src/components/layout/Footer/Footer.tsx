import { NavLink } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>
        <strong>Koda Fragancias</strong> — descubrí tu próxima fragancia.
      </p>
      <div className={styles.links}>
        <NavLink to="/about" className={styles.link}>
          Acerca de
        </NavLink>
        <span className={styles.dot}>·</span>
        <a
          href="https://www.instagram.com/kodafragancias/"
          target="_blank"
          rel="noreferrer"
          className={styles.link}
          aria-label="Instagram de Koda Fragancias"
        >
          Instagram
        </a>
        <span className={styles.dot}>·</span>
        <a
          href="https://wa.me/5491156009539?text=Hola%20Koda%20Fragancias!"
          target="_blank"
          rel="noreferrer"
          className={styles.link}
          aria-label="WhatsApp de Koda Fragancias"
        >
          WhatsApp
        </a>
        <span className={styles.dot}>·</span>
        <span>Stock sujeto a disponibilidad</span>
        <span className={styles.dot}>·</span>
        <span>© {year}</span>
      </div>
    </footer>
  );
}
