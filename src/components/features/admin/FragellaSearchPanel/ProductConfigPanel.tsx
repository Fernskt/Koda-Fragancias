import { useState } from 'react';
import { t, ACCORDS_ES, GENDER_ES } from '../../../../utils/translations';
import type { FragellaFragrance, ProductRecord, PerfumeStatus } from '../../../../types/perfume';
import styles from './ProductConfigPanel.module.css';

export interface BusinessFormData {
  price: string;
  stock_status: PerfumeStatus;
  stock_qty: string;
  notes_admin: string;
  active: boolean;
}

interface Props {
  fragrance: FragellaFragrance | null;
  product?: ProductRecord;
  isSaving: boolean;
  onSave: (data: BusinessFormData) => void;
  onBack?: () => void;
}

function initForm(product?: ProductRecord): BusinessFormData {
  return {
    price: product?.price ?? '',
    stock_status: product?.stock_status ?? 'Disponible',
    stock_qty: product?.stock_qty?.toString() ?? '',
    notes_admin: product?.notes_admin ?? '',
    active: product?.active ?? true,
  };
}

function FragrancePreview({ fragrance }: { fragrance: FragellaFragrance }) {
  const image = fragrance['Image URL Transparent'] ?? fragrance['Image URL'];
  const gender = fragrance.Gender ? t(GENDER_ES, fragrance.Gender) : undefined;
  const meta = [fragrance.OilType, gender, fragrance.Year].filter(Boolean).join(' · ');
  const accords = (fragrance['Main Accords'] ?? []).slice(0, 5).map((a) => t(ACCORDS_ES, a));

  return (
    <div className={styles.preview}>
      {image ? (
        <img src={image} alt={fragrance.Name} className={styles.previewImg} />
      ) : (
        <div className={styles.previewImgPlaceholder}>🌸</div>
      )}
      <div className={styles.previewInfo}>
        <p className={styles.previewName}>{fragrance.Name}</p>
        <p className={styles.previewBrand}>{fragrance.Brand}</p>
        {meta && <p className={styles.previewMeta}>{meta}</p>}
        {accords.length > 0 && (
          <div className={styles.previewAccords}>
            {accords.map((a) => (
              <span key={a} className={styles.accordChip}>{a}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductConfigPanel({ fragrance, product, isSaving, onSave, onBack }: Props) {
  const [form, setForm] = useState<BusinessFormData>(() => initForm(product));
  const [error, setError] = useState('');

  const set = <K extends keyof BusinessFormData>(key: K, value: BusinessFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.price.trim()) {
      setError('El precio es obligatorio.');
      return;
    }
    setError('');
    onSave(form);
  };

  const displayFragrance = fragrance ?? product?.fragella_cache ?? null;

  return (
    <div className={styles.wrap}>
      {displayFragrance && <FragrancePreview fragrance={displayFragrance} />}

      <form className={styles.form} onSubmit={handleSubmit} id="config-form">
        <p className={styles.formTitle}>Datos del negocio</p>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="cfg-price">Precio *</label>
            <input
              id="cfg-price"
              className={styles.input}
              placeholder="$65.000"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="cfg-status">Estado de stock</label>
            <select
              id="cfg-status"
              className={styles.select}
              value={form.stock_status}
              onChange={(e) => set('stock_status', e.target.value as PerfumeStatus)}
            >
              <option>Disponible</option>
              <option>Última unidad</option>
              <option>Sin stock</option>
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="cfg-qty">Cantidad (opcional)</label>
          <input
            id="cfg-qty"
            className={styles.input}
            type="number"
            min="0"
            placeholder="ej: 3"
            value={form.stock_qty}
            onChange={(e) => set('stock_qty', e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="cfg-notes">Nota interna (opcional)</label>
          <textarea
            id="cfg-notes"
            className={styles.textarea}
            placeholder="Notas visibles solo para el admin..."
            value={form.notes_admin}
            onChange={(e) => set('notes_admin', e.target.value)}
          />
        </div>

        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>Visible en catálogo</span>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set('active', e.target.checked)}
            />
            <span className={styles.toggleSlider} />
          </label>
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </form>

      <div className={styles.footer}>
        {onBack && (
          <button type="button" className={styles.btnBack} onClick={onBack}>
            ← Volver
          </button>
        )}
        <button
          type="submit"
          form="config-form"
          className={styles.btnSave}
          disabled={isSaving}
        >
          {isSaving
            ? 'Guardando...'
            : product
            ? 'Guardar cambios'
            : 'Agregar al catálogo'}
        </button>
      </div>
    </div>
  );
}
