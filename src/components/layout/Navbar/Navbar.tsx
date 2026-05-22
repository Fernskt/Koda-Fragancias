import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../../hooks/useCart';
import styles from './Navbar.module.css';
import Logo from '../../../assets/koda-logo.png';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openCart, totalItems } = useCart();
  const prevItems = useRef(totalItems);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    prevItems.current = totalItems;
  }, [totalItems]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [styles.navLink, isActive ? styles.active : ''].filter(Boolean).join(' ');

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    [styles.mobileNavLink, isActive ? styles.active : ''].filter(Boolean).join(' ');

  return (
    <header className={[styles.navbar, scrolled ? styles.scrolled : ''].filter(Boolean).join(' ')}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand} aria-label="Koda Fragancias - inicio">
          <img src={Logo} alt="Koda Fragancias" className={styles.logo} />
          <span className={styles.brandName}>
            Koda <span>Fragancias</span>
          </span>
        </NavLink>

        <nav className={styles.nav} aria-label="Navegación principal">
          <NavLink to="/" className={navLinkClass} end>
            Catálogo
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            Acerca de
          </NavLink>
        </nav>

        <div className={styles.actions}>
          <motion.button
            type="button"
            onClick={openCart}
            aria-label={`Abrir carrito${totalItems > 0 ? `, ${totalItems} items` : ''}`}
            style={{ position: 'relative', background: 'transparent', border: 'none', color: 'var(--text)', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            whileTap={{ scale: 0.92 }}
          >
            <ShoppingBag size={22} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'var(--violet2)',
                    color: 'white',
                    borderRadius: '999px',
                    width: 18,
                    height: 18,
                    fontSize: 11,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <button
            type="button"
            className={styles.hamburger}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={menuOpen ? 'close' : 'open'}
                initial={{ opacity: 0, rotate: -30 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 30 }}
                transition={{ duration: 0.16 }}
              >
                {menuOpen ? <X size={22} color="var(--text)" /> : <Menu size={22} color="var(--text)" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className={[styles.mobileMenu, styles.open].join(' ')}
            aria-label="Menú móvil"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <NavLink to="/" className={mobileNavLinkClass} end onClick={() => setMenuOpen(false)}>
              Catálogo
            </NavLink>
            <NavLink to="/about" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
              Acerca de
            </NavLink>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
