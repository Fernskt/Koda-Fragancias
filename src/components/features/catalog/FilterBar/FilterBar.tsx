import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Input } from '../../../ui/Input';
import { Chip } from '../../../ui/Chip';
import { useFilterStore } from '../../../../store/filterStore';
import { useDebounce } from '../../../../hooks/useDebounce';
import type { DisplayProduct } from '../../../../types/perfume';
import styles from './FilterBar.module.css';

const unique = (arr: string[]) => [...new Set(arr)].sort((a, b) => a.localeCompare(b, 'es'));

const statusOptions = ['Todos', 'Disponible', 'Última unidad', 'Sin stock'];
const genderOptions = ['Todos', 'Hombre', 'Mujer', 'Unisex', 'Para empezar'];

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
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    let scrollHandler: (() => void) | null = null;
    const t = setTimeout(() => {
      scrollHandler = () => setOpen(false);
      window.addEventListener('scroll', scrollHandler, { passive: true });
    }, 200);
    return () => {
      clearTimeout(t);
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
    };
  }, [open]);

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
      {open && (
        <div className={styles.panel} role="listbox" aria-label={label}>
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
        </div>
      )}
    </div>
  );
}

interface FilterBarProps {
  perfumes: DisplayProduct[];
}

export function FilterBar({ perfumes }: FilterBarProps) {
  const store = useFilterStore();
  const [localSearch, setLocalSearch] = useState(store.search);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    store.setSearch(debouncedSearch);
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const brandOptions = useMemo(
    () => ['Todas', ...unique(perfumes.map((p) => p.brand))],
    [perfumes]
  );

  const familyOptions = useMemo(() => {
    const all = unique(perfumes.flatMap((p) => p.family));
    const pinned = ['Más pedidos'].filter((v) => all.includes(v));
    const rest = all.filter((v) => !pinned.includes(v));
    return ['Todas', ...pinned, ...rest];
  }, [perfumes]);

  const useOptions = useMemo(
    () => ['Todos', ...unique(perfumes.flatMap((p) => p.use))],
    [perfumes]
  );

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
