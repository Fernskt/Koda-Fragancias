import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Perfume, PerfumeGender, PerfumeStatus, PerfumeType } from '../../../../types/perfume';
import styles from './ProductForm.module.css';

type FormData = {
  name: string;
  brand: string;
  type: PerfumeType;
  gender: PerfumeGender;
  notes: string;
  price: string;
  status: PerfumeStatus;
  family: string;
  use: string;
  image: string;
  fragranticaUrl: string;
  fragranticaName: string;
  starter: boolean;
};

const EMPTY: FormData = {
  name: '',
  brand: '',
  type: 'Arabe',
  gender: 'Unisex',
  notes: '',
  price: '',
  status: 'Disponible',
  family: '',
  use: '',
  image: '',
  fragranticaUrl: '',
  fragranticaName: '',
  starter: false,
};

function toForm(p: Perfume): FormData {
  return {
    name: p.name,
    brand: p.brand,
    type: p.type,
    gender: p.gender,
    notes: p.notes,
    price: p.price,
    status: p.status,
    family: p.family.join(', '),
    use: p.use.join(', '),
    image: p.image ?? '',
    fragranticaUrl: p.fragranticaUrl ?? '',
    fragranticaName: p.fragranticaName ?? '',
    starter: p.starter,
  };
}

function fromForm(f: FormData, active: boolean = true): Omit<Perfume, 'id'> {
  const split = (s: string) =>
    s.split(',').map((v) => v.trim()).filter(Boolean);
  return {
    name: f.name.trim(),
    brand: f.brand.trim(),
    type: f.type,
    gender: f.gender,
    notes: f.notes.trim(),
    price: f.price.trim(),
    status: f.status,
    family: split(f.family),
    use: split(f.use),
    image: f.image.trim() || undefined,
    fragranticaUrl: f.fragranticaUrl.trim() || undefined,
    fragranticaName: f.fragranticaName.trim() || undefined,
    starter: f.starter,
    active,
  };
}

interface ProductFormProps {
  perfume?: Perfume;
  onSave: (data: Omit<Perfume, 'id'>, id?: number) => Promise<void>;
  onClose: () => void;
}

export function ProductForm({ perfume, onSave, onClose }: ProductFormProps) {
  const [form, setForm] = useState<FormData>(perfume ? toForm(perfume) : EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(perfume ? toForm(perfume) : EMPTY);
    setError('');
  }, [perfume]);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.notes || !form.price) {
      setError('Completá los campos obligatorios.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSave(fromForm(form, perfume?.active), perfume?.id);
      onClose();
    } catch {
      setError('Ocurrió un error al guardar. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={perfume ? 'Editar perfume' : 'Nuevo perfume'}>
        <div className={styles.header}>
          <span className={styles.title}>{perfume ? 'Editar perfume' : 'Nuevo perfume'}</span>
          <button className={styles.close} onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <form className={styles.body} onSubmit={handleSubmit} id="product-form">
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={`${styles.label} ${styles.required}`} htmlFor="pf-name">Nombre</label>
              <input id="pf-name" className={styles.input} value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label className={`${styles.label} ${styles.required}`} htmlFor="pf-brand">Marca</label>
              <input id="pf-brand" className={styles.input} value={form.brand} onChange={(e) => set('brand', e.target.value)} required />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pf-type">Tipo</label>
              <select id="pf-type" className={styles.select} value={form.type} onChange={(e) => set('type', e.target.value as PerfumeType)}>
                <option>Arabe</option>
                <option>Diseñador</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pf-gender">Género</label>
              <select id="pf-gender" className={styles.select} value={form.gender} onChange={(e) => set('gender', e.target.value as PerfumeGender)}>
                <option>Hombre</option>
                <option>Mujer</option>
                <option>Unisex</option>
                <option>Femenino</option>
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`} htmlFor="pf-notes">Notas olfativas</label>
            <input id="pf-notes" className={styles.input} value={form.notes} onChange={(e) => set('notes', e.target.value)} required />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={`${styles.label} ${styles.required}`} htmlFor="pf-price">Precio</label>
              <input id="pf-price" className={styles.input} placeholder="$65.000" value={form.price}
                onChange={(e) => {
                  // allow only digits from user input
                  const digits = e.target.value.replace(/\D/g, '');
                  if (!digits) {
                    set('price', '');
                    return;
                  }
                  // format with dot as thousands separator and leading $
                  const withSep = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                  set('price', `$${withSep}`);
                }} required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pf-status">Estado</label>
              <select id="pf-status" className={styles.select} value={form.status} onChange={(e) => set('status', e.target.value as PerfumeStatus)}>
                <option>Disponible</option>
                <option>Última unidad</option>
                <option>Sin stock</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pf-family">Familia olfativa</label>
              <input id="pf-family" className={styles.input} placeholder="Fresco, Acuático, Versátil" value={form.family} onChange={(e) => set('family', e.target.value)} />
              <span className={styles.hint}>Separadas por coma</span>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pf-use">Uso recomendado</label>
              <input id="pf-use" className={styles.input} placeholder="Día, Oficina, Verano" value={form.use} onChange={(e) => set('use', e.target.value)} />
              <span className={styles.hint}>Separados por coma</span>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="pf-image">URL de imagen</label>
            <input id="pf-image" className={styles.input} type="url" placeholder="https://..." value={form.image} onChange={(e) => set('image', e.target.value)} />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pf-furl">Fragrantica URL</label>
              <input id="pf-furl" className={styles.input} type="url" placeholder="https://fragrantica.com/..." value={form.fragranticaUrl} onChange={(e) => set('fragranticaUrl', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pf-fname">Nombre en Fragrantica</label>
              <input id="pf-fname" className={styles.input} placeholder="Nombre exacto" value={form.fragranticaName} onChange={(e) => set('fragranticaName', e.target.value)} />
            </div>
          </div>

          <div className={styles.checkRow}>
            <input
              id="pf-starter"
              className={styles.checkbox}
              type="checkbox"
              checked={form.starter}
              onChange={(e) => set('starter', e.target.checked)}
            />
            <label className={styles.checkLabel} htmlFor="pf-starter">
              Marcar como "Para empezar" (recomendado para principiantes)
            </label>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </form>

        <div className={styles.footer}>
          <button className={styles.btnCancel} type="button" onClick={onClose}>Cancelar</button>
          <button className={styles.btnSave} type="submit" form="product-form" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
