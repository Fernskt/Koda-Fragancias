import { useState } from 'react';
import { X } from 'lucide-react';
import { useFragellaSearch } from '../../../../hooks/useFragella';
import { useAddFromFragella } from '../../../../hooks/usePerfumesAdmin';
import { useDebounce } from '../../../../hooks/useDebounce';
import { t, ACCORDS_ES, GENDER_ES } from '../../../../utils/translations';
import { ProductConfigPanel } from './ProductConfigPanel';
import type { BusinessFormData } from './ProductConfigPanel';
import type { FragellaFragrance } from '../../../../types/perfume';
import styles from './FragellaSearchPanel.module.css';

interface Props {
  onClose: () => void;
}

function ResultItem({
  fragrance,
  selected,
  onClick,
}: {
  fragrance: FragellaFragrance;
  selected: boolean;
  onClick: () => void;
}) {
  const image = fragrance['Image URL Transparent'] ?? fragrance['Image URL'];
  const gender = fragrance.Gender ? t(GENDER_ES, fragrance.Gender) : undefined;
  const meta = [fragrance.OilType, gender, fragrance.Year].filter(Boolean).join(' · ');
  const accords = (fragrance['Main Accords'] ?? []).slice(0, 4).map((a) => t(ACCORDS_ES, a));

  return (
    <button
      type="button"
      className={[styles.resultItem, selected ? styles.selected : ''].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      {image ? (
        <img src={image} alt={fragrance.Name} className={styles.resultImg} />
      ) : (
        <div className={styles.resultImgPlaceholder}>🌸</div>
      )}
      <div className={styles.resultInfo}>
        <p className={styles.resultName}>{fragrance.Name}</p>
        <p className={styles.resultBrand}>{fragrance.Brand}</p>
        {meta && <p className={styles.resultMeta}>{meta}</p>}
        {accords.length > 0 && (
          <div className={styles.resultAccords}>
            {accords.map((a) => (
              <span key={a} className={styles.accordChip}>{a}</span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

export function FragellaSearchPanel({ onClose }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [selected, setSelected] = useState<FragellaFragrance | null>(null);
  const debouncedQuery = useDebounce(inputValue, 400);

  const { data: results = [], isFetching } = useFragellaSearch(debouncedQuery);
  const addMutation = useAddFromFragella();

  const handleSave = async (formData: BusinessFormData) => {
    if (!selected) return;

    await addMutation.mutateAsync({
      fragellaId: selected._id,
      fragrance: selected,
      businessData: {
        price: formData.price,
        stock_status: formData.stock_status,
        stock_qty: formData.stock_qty ? parseInt(formData.stock_qty, 10) : undefined,
        notes_admin: formData.notes_admin || undefined,
      },
    });

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel}>
        {/* Search column */}
        <div className={styles.searchCol}>
          <div className={styles.searchHeader}>
            <span className={styles.searchTitle}>Buscar en Fragella</span>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
              <X size={18} />
            </button>
          </div>

          <div className={styles.searchInputWrap}>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Ej: Hawas, Asad, Black Phantom..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setSelected(null);
              }}
              autoFocus
            />
          </div>

          <div className={styles.results}>
            {isFetching ? (
              <p className={styles.loadingHint}>Buscando...</p>
            ) : debouncedQuery.trim().length < 2 ? (
              <p className={styles.emptyHint}>
                Escribí al menos 2 caracteres para buscar fragancias en el catálogo de Fragella.
              </p>
            ) : results.length === 0 ? (
              <p className={styles.emptyHint}>
                No se encontraron resultados para "{debouncedQuery}".
              </p>
            ) : (
              results.map((f) => (
                <ResultItem
                  key={f._id}
                  fragrance={f}
                  selected={selected?._id === f._id}
                  onClick={() => setSelected(f)}
                />
              ))
            )}
          </div>
        </div>

        {/* Config column */}
        <div className={styles.configCol}>
          {selected ? (
            <ProductConfigPanel
              fragrance={selected}
              isSaving={addMutation.isPending}
              onSave={handleSave}
              onBack={() => setSelected(null)}
            />
          ) : (
            <div className={styles.configEmpty}>
              <span className={styles.configEmptyIcon}>👈</span>
              <p>Seleccioná una fragancia de los resultados para configurar precio y stock.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
