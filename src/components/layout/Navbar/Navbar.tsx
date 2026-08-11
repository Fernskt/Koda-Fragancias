import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../../hooks/useCart';
import { usePerfumes } from '../../../hooks/usePerfumes';
import { useDebounce } from '../../../hooks/useDebounce';
import { useFilterStore, defaults as filterDefaults } from '../../../store/filterStore';
import { Chip } from '../../ui/Chip';
import styles from './Navbar.module.css';
import Logo from '../../../assets/koda-logo.png';

const unique = (arr: string[]) => [...new Set(arr)].sort((a, b) => a.localeCompare(b, 'es'));

const STATUS_OPTIONS = ['Todos', 'Disponible', 'Última unidad', 'Sin stock'];
const GENDER_OPTIONS = ['Todos', 'Hombre', 'Mujer', 'Unisex', 'Para empezar'];

interface FilterDef {
  key: string;
  label: string;
  value: string;
  defaultValue: string;
  options: string[];
  setter: (v: string) => void;
}

interface NavFilterDropdownProps {
  filter: FilterDef;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (setter: (v: string) => void, value: string) => void;
}

function NavFilterDropdown({ filter, isOpen, onOpen, onClose, onSelect }: NavFilterDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const active = filter.value !== filter.defaultValue;

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <div className={styles.navFilterWrap} ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        className={[styles.navLink, active ? styles.navItemActive : ''].filter(Boolean).join(' ')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => (isOpen ? onClose() : onOpen())}
      >
        {filter.label}
        <ChevronDown
          size={14}
          className={[styles.arrow, isOpen ? styles.open : ''].filter(Boolean).join(' ')}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div className={styles.navPanel} role="listbox" aria-label={filter.label}>
          <div className={styles.navChips}>
            {filter.options.map((opt) => (
              <Chip
                key={opt}
                variant="filter"
                active={filter.value === opt}
                onClick={() => onSelect(filter.setter, opt)}
              >
                {opt}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface MobileFilterItemProps {
  filter: FilterDef;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (setter: (v: string) => void, value: string) => void;
}

function MobileFilterItem({ filter, isOpen, onToggle, onSelect }: MobileFilterItemProps) {
  const active = filter.value !== filter.defaultValue;

  return (
    <div className={styles.mobileFilterItem}>
      <button
        type="button"
        className={[styles.mobileNavLink, styles.mobileFilterBtn, active ? styles.active : ''].join(' ')}
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span>{filter.label}</span>
        <ChevronDown
          size={16}
          className={[styles.arrow, isOpen ? styles.open : ''].filter(Boolean).join(' ')}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: 'hidden' }}
          >
            <div className={styles.mobileChips}>
              {filter.options.map((opt) => (
                <Chip
                  key={opt}
                  variant="filter"
                  active={filter.value === opt}
                  onClick={() => onSelect(filter.setter, opt)}
                >
                  {opt}
                </Chip>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [openMobileKey, setOpenMobileKey] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { openCart, totalItems } = useCart();
  const prevItems = useRef(totalItems);
  const navigate = useNavigate();
  const location = useLocation();
  const store = useFilterStore();
  const { data: perfumes = [] } = usePerfumes();

  const searchWrapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [localSearch, setLocalSearch] = useState(store.search);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    store.setSearch(debouncedSearch);
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    prevItems.current = totalItems;
  }, [totalItems]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [searchOpen]);

  const brandOptions = useMemo(() => ['Todas', ...unique(perfumes.map((p) => p.brand))], [perfumes]);
  const familyOptions = useMemo(() => {
    const all = unique(perfumes.flatMap((p) => p.family));
    const pinned = ['Más pedidos'].filter((v) => all.includes(v));
    const rest = all.filter((v) => !pinned.includes(v));
    return ['Todas', ...pinned, ...rest];
  }, [perfumes]);
  const useOptions = useMemo(() => ['Todos', ...unique(perfumes.flatMap((p) => p.use))], [perfumes]);

  const filters: FilterDef[] = [
    { key: 'brand', label: 'Marca', value: store.brand, defaultValue: filterDefaults.brand, options: brandOptions, setter: store.setBrand },
    { key: 'status', label: 'Estado', value: store.status, defaultValue: filterDefaults.status, options: STATUS_OPTIONS, setter: store.setStatus },
    { key: 'gender', label: 'Mostrar', value: store.gender, defaultValue: filterDefaults.gender, options: GENDER_OPTIONS, setter: store.setGender },
    { key: 'family', label: 'Familia', value: store.family, defaultValue: filterDefaults.family, options: familyOptions, setter: store.setFamily },
    { key: 'use', label: 'Uso', value: store.use, defaultValue: filterDefaults.use, options: useOptions, setter: store.setUse },
  ];

  const handleSelect = (setter: (v: string) => void, value: string) => {
    setter(value);
    setOpenKey(null);
    setMenuOpen(false);
    if (location.pathname !== '/') navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [styles.navLink, isActive ? styles.active : ''].filter(Boolean).join(' ');

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    [styles.mobileNavLink, isActive ? styles.active : ''].filter(Boolean).join(' ');

  return (
    <header className={[styles.navbar, scrolled ? styles.scrolled : ''].filter(Boolean).join(' ')}>
      <div className={styles.inner}>
        <NavLink
          to="/"
          className={styles.brand}
          aria-label="Koda Fragancias - inicio"
          onClick={() => store.reset()}
        >
          <img src={Logo} alt="Koda Fragancias" className={styles.logo} />
          <span className={styles.brandName}>
            Koda <span>Fragancias</span>
          </span>
        </NavLink>

        <nav className={styles.nav} aria-label="Filtros del catálogo">
          {filters.map((f) => (
            <NavFilterDropdown
              key={f.key}
              filter={f}
              isOpen={openKey === f.key}
              onOpen={() => setOpenKey(f.key)}
              onClose={() => setOpenKey((k) => (k === f.key ? null : k))}
              onSelect={handleSelect}
            />
          ))}
          <NavLink to="/about" className={navLinkClass}>
            Acerca de
          </NavLink>
        </nav>

        <div className={styles.actions}>
          <div className={styles.searchWrap} ref={searchWrapRef}>
            <input
              ref={searchInputRef}
              type="search"
              className={[styles.searchInput, searchOpen ? styles.searchInputOpen : ''].filter(Boolean).join(' ')}
              placeholder="Buscar perfume, marca, nota o estilo..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              tabIndex={searchOpen ? 0 : -1}
              aria-hidden={!searchOpen}
            />
            <button
              type="button"
              className={styles.iconBtn}
              aria-label="Buscar"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Search size={19} />
            </button>
          </div>

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
            <div className={styles.mobileSearchWrap}>
              <Search size={16} className={styles.mobileSearchIcon} aria-hidden="true" />
              <input
                type="search"
                className={styles.mobileSearchInput}
                placeholder="Buscar perfume, marca, nota o estilo..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
            {filters.map((f) => (
              <MobileFilterItem
                key={f.key}
                filter={f}
                isOpen={openMobileKey === f.key}
                onToggle={() => setOpenMobileKey((k) => (k === f.key ? null : f.key))}
                onSelect={handleSelect}
              />
            ))}
            <NavLink to="/about" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
              Acerca de
            </NavLink>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
