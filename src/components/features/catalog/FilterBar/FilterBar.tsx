import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Input } from '../../../ui/Input';
import { Chip } from '../../../ui/Chip';
import { useFilterStore } from '../../../../store/filterStore';
import { useDebounce } from '../../../../hooks/useDebounce';
import { perfumes } from '../../../../data/perfumes';
import styles from './FilterBar.module.css';

const unique = (arr: string[]) => [...new Set(arr)].sort((a, b) => a.localeCompare(b, 'es'));
const brandOptions = ['Todas', ...unique(perfumes.map((p) => p.brand))];
const statusOptions = ['Todos', 'Disponible', 'Última unidad', 'Sin stock'];
const genderOptions = ['Todos', 'Hombre', 'Mujer', 'Unisex', 'Para empezar'];
const familyOptions = [
  'Todas', 'Más pedidos', 'Dulce', 'Gourmand', 'Fresco', 'Frutal', 'Floral',
  'Intenso', 'Acuático', 'Elegante', 'Oud', 'Versátil',
];
const useOptions = ['Todos', 'Día', 'Noche', 'Verano', 'Invierno', 'Oficina', 'Salida', 'Regalo'];

interface DropdownProps {
  label: string;
  current: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

function Dropdown({ label, current, options, value, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const scrollHandler = () => setOpen(false);
    document.addEventListener('click', handler);
    window.addEventListener('scroll', scrollHandler, { passive: true });
    return () => {
      document.removeEventListener('click', handler);
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className={styles.dropWrap} ref={ref}>
      <button
        type="button"
        className={styles.dropBtn}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.dropBtnInner}>
          <span>{label}</span>
          <span className={styles.dropCurrent}>{current}</span>
        </span>
        <ChevronDown
          size={16}
          className={[styles.arrow, open ? styles.open : ''].filter(Boolean).join(' ')}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.panel}
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
          >
            <div className={styles.chips}>
              {options.map((opt) => (
                <Chip
                  key={opt}
                  variant="filter"
                  active={value === opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
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

export function FilterBar() {
  const store = useFilterStore();
  const [localSearch, setLocalSearch] = useState(store.search);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    store.setSearch(debouncedSearch);
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className={styles.bar} aria-label="Filtros del catálogo">
      <div className={styles.shell}>
        <div className={styles.topRow}>
          <Input
            id="search"
            type="search"
            placeholder="Buscar perfume, marca, nota o estilo..."
            autoComplete="off"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          <Dropdown
            label="Marca"
            current={store.brand}
            options={brandOptions}
            value={store.brand}
            onChange={store.setBrand}
          />
          <Dropdown
            label="Estado"
            current={store.status}
            options={statusOptions}
            value={store.status}
            onChange={store.setStatus}
          />
        </div>
        <div className={styles.dropRow}>
          <Dropdown
            label="Mostrar"
            current={store.gender}
            options={genderOptions}
            value={store.gender}
            onChange={store.setGender}
          />
          <Dropdown
            label="Familia olfativa"
            current={store.family}
            options={familyOptions}
            value={store.family}
            onChange={store.setFamily}
          />
          <Dropdown
            label="Uso recomendado"
            current={store.use}
            options={useOptions}
            value={store.use}
            onChange={store.setUse}
          />
        </div>
      </div>
    </section>
  );
}
