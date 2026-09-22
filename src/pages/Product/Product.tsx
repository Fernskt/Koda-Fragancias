import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MessageCircle,
  ShoppingBag,
  ExternalLink,
  Sparkles,
  Sun,
  Users,
  BadgeCheck,
} from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Chip } from '../../components/ui/Chip';
import { Badge } from '../../components/ui/Badge';
import { usePerfumes } from '../../hooks/usePerfumes';
import { useCart } from '../../hooks/useCart';
import { useFilterStore } from '../../store/filterStore';
import { buildProductMessage, buildWhatsAppUrl } from '../../utils/whatsapp';
import { formatPrice } from '../../utils/formatPrice';
import type { Perfume } from '../../types/perfume';
import styles from './Product.module.css';

function statusVariant(status: Perfume['status']): 'ok' | 'warn' | 'out' {
  if (status === 'Disponible') return 'ok';
  if (status === 'Última unidad') return 'warn';
  return 'out';
}

function splitNotes(notes: string): string[] {
  return notes
    .split('·')
    .map((n) => n.trim())
    .filter(Boolean);
}

export function Product() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data = [], isLoading } = usePerfumes();
  const { addItem } = useCart();
  const { setBrand, setStatus, setGender, setFamily, setUse } = useFilterStore();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const perfume = data.find((p) => p.id === Number(id));

  const goToFilter = (apply: () => void) => {
    apply();
    navigate('/');
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <main className={styles.stateWrap}>
          <div className={styles.spinner} aria-hidden="true" />
          <p>Cargando perfume…</p>
        </main>
      </PageWrapper>
    );
  }

  if (!perfume) {
    return (
      <PageWrapper>
        <main className={styles.stateWrap}>
          <h1 className={styles.notFoundTitle}>No encontramos este perfume</h1>
          <p className={styles.notFoundText}>
            Puede que ya no esté disponible en el catálogo.
          </p>
          <button type="button" className={styles.backLink} onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            Volver al catálogo
          </button>
        </main>
      </PageWrapper>
    );
  }

  const isOut = perfume.status === 'Sin stock';
  const notes = splitNotes(perfume.notes);
  const displayImage = perfume.image || perfume.perfume_img;

  const handleAdd = () => {
    addItem(perfume);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <PageWrapper>
      <main className={styles.page}>
        <button type="button" className={styles.backLink} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Volver al catálogo
        </button>

        <div className={styles.layout}>
          <motion.div
            className={styles.imageCol}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div
              className={[
                styles.imageFrame,
                isOut ? styles.imageFrameOut : '',
                perfume.featured ? styles.imageFrameFeatured : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {displayImage ? (
                <img src={displayImage} alt={perfume.name} className={styles.image} />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <b>{perfume.name}</b>
                  <span>Foto pendiente</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            className={styles.infoCol}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05, ease: [0.4, 0, 0.2, 1] }}
          >
            <button
              type="button"
              className={[styles.brand, styles.tagReset].join(' ')}
              onClick={() => goToFilter(() => setBrand(perfume.brand))}
            >
              {perfume.brand}
            </button>
            <h1 className={styles.name}>{perfume.name}</h1>

            <div className={styles.metaRow}>
              <button
                type="button"
                className={[styles.metaItem, styles.tagReset].join(' ')}
                onClick={() => goToFilter(() => setGender(perfume.gender))}
              >
                <Users size={14} />
                {perfume.gender}
              </button>
              <span className={styles.metaItem}>
                <Sun size={14} />
                {perfume.type}
              </span>
              {perfume.featured && (
                <span className={styles.metaItem}>
                  <Sparkles size={14} />
                  Destacado
                </span>
              )}
              {perfume.starter && (
                <span className={styles.metaItem}>
                  <BadgeCheck size={14} />
                  Ideal para empezar
                </span>
              )}
            </div>

            <div className={styles.priceRow}>
              <span className={styles.price}>{formatPrice(perfume.price)}</span>
              <Badge
                variant={statusVariant(perfume.status)}
                onClick={() => goToFilter(() => setStatus(perfume.status))}
              >
                {perfume.status}
              </Badge>
            </div>

            {perfume.perfume_img && (
              <div className={styles.bottleShot}>
                <img src={perfume.perfume_img} alt={`Envase de ${perfume.name}`} />
              </div>
            )}

            <div className={styles.actions}>
              <a
                className={styles.waBtn}
                href={buildWhatsAppUrl(buildProductMessage(perfume))}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={17} />
                {isOut ? 'Consultar reposición por WhatsApp' : 'Consultar por WhatsApp'}
              </a>
              {!isOut && (
                <button type="button" className={styles.addBtn} onClick={handleAdd}>
                  <ShoppingBag size={16} />
                  {added ? '¡Agregado al carrito!' : 'Agregar al carrito'}
                </button>
              )}
            </div>

            {perfume.family.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionLabel}>Familia olfativa</h2>
                <div className={styles.chips}>
                  {perfume.family.map((f) => (
                    <Chip key={f} onClick={() => goToFilter(() => setFamily(f))}>
                      {f}
                    </Chip>
                  ))}
                </div>
              </section>
            )}

            {perfume.use.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionLabel}>Uso recomendado</h2>
                <div className={styles.chips}>
                  {perfume.use.map((u) => (
                    <Chip key={u} variant="use" onClick={() => goToFilter(() => setUse(u))}>
                      {u}
                    </Chip>
                  ))}
                </div>
              </section>
            )}

            {notes.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionLabel}>Notas olfativas</h2>
                <div className={styles.notesChips}>
                  {notes.map((n) => (
                    <span key={n} className={styles.noteChip}>
                      {n}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {perfume.fragranticaUrl && (
              <section className={styles.section}>
                <h2 className={styles.sectionLabel}>Referencia</h2>
                <a
                  className={styles.fragLink}
                  href={perfume.fragranticaUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Ver ${perfume.fragranticaName ?? perfume.name} en Fragrantica`}
                >
                  <ExternalLink size={14} />
                  {perfume.fragranticaName
                    ? `Fragrantica: ${perfume.fragranticaName}`
                    : 'Ver en Fragrantica'}
                </a>
                {perfume.verification && <p className={styles.verif}>{perfume.verification}</p>}
              </section>
            )}
          </motion.div>
        </div>
      </main>
    </PageWrapper>
  );
}
