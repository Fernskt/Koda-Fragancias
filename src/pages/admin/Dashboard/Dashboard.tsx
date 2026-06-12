import { useState } from 'react';
import { LogOut, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import {
  usePerfumesAdmin,
  useSetActivePerfume,
  useDeletePerfumeAdmin,
  useUpdateProductBusiness,
} from '../../../hooks/usePerfumesAdmin';
import { FragellaSearchPanel, ProductConfigPanel } from '../../../components/features/admin/FragellaSearchPanel';
import type { BusinessFormData } from '../../../components/features/admin/FragellaSearchPanel';
import { normalize } from '../../../utils/normalize';
import type { ProductRecord, PerfumeStatus } from '../../../types/perfume';
import styles from './Dashboard.module.css';

function StatusBadge({ status }: { status: PerfumeStatus }) {
  const cls =
    status === 'Disponible' ? styles.ok
    : status === 'Última unidad' ? styles.warn
    : styles.error;
  return <span className={`${styles.badge} ${cls}`}>{status}</span>;
}

function EditOverlay({
  product,
  onClose,
}: {
  product: ProductRecord;
  onClose: () => void;
}) {
  const updateMutation = useUpdateProductBusiness();

  const handleSave = async (formData: BusinessFormData) => {
    await updateMutation.mutateAsync({
      id: product.id,
      data: {
        price: formData.price,
        stock_status: formData.stock_status,
        stock_qty: formData.stock_qty ? parseInt(formData.stock_qty, 10) : null,
        notes_admin: formData.notes_admin || null,
        active: formData.active,
      },
    });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.72)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: 'var(--card2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          width: '100%',
          maxWidth: 480,
          maxHeight: '90dvh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>
            Editar producto
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--muted)',
              cursor: 'pointer',
              fontSize: 20,
              lineHeight: 1,
            }}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <ProductConfigPanel
          fragrance={null}
          product={product}
          isSaving={updateMutation.isPending}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}

export function Dashboard() {
  const { logout } = useAuth();
  const { data: products = [], isLoading } = usePerfumesAdmin();
  const toggleActiveMutation = useSetActivePerfume();
  const deleteMutation = useDeletePerfumeAdmin();

  const [search, setSearch] = useState('');
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRecord | undefined>(undefined);

  const filtered = products.filter((p) => {
    const q = normalize(search);
    const name = p.fragella_cache?.Name ?? p.fragella_id;
    const brand = p.fragella_cache?.Brand ?? '';
    return !q || normalize(`${name} ${brand}`).includes(q);
  });

  const stats = {
    total: products.length,
    active: products.filter((p) => p.active).length,
    disponible: products.filter((p) => p.stock_status === 'Disponible').length,
    sinStock: products.filter((p) => p.stock_status === 'Sin stock').length,
  };

  const handleDelete = (p: ProductRecord) => {
    const name = p.fragella_cache?.Name ?? p.fragella_id;
    if (!window.confirm(`¿Desactivar "${name}"? Podrás reactivarlo después.`)) return;
    deleteMutation.mutate(p.id);
  };

  const handleToggleActive = (p: ProductRecord) => {
    toggleActiveMutation.mutate({ id: p.id, active: !p.active });
  };

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.brand}>Koda Fragancias</span>
          <span className={styles.divider}>|</span>
          <span className={styles.pageTitle}>Panel Admin</span>
        </div>
        <button className={styles.btnLogout} onClick={logout}>
          <LogOut size={14} style={{ marginRight: 6 }} />
          Salir
        </button>
      </header>

      <main className={styles.main}>
        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{stats.active}</div>
            <div className={styles.statLabel}>Activos</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{stats.disponible}</div>
            <div className={styles.statLabel}>Disponibles</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{stats.sinStock}</div>
            <div className={styles.statLabel}>Sin stock</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Buscar por nombre o marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className={styles.btnNew} onClick={() => setSearchPanelOpen(true)}>
            <Plus size={16} />
            Nuevo perfume
          </button>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className={styles.empty}>Cargando productos...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>No se encontraron productos.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: 60 }}></th>
                  <th>Nombre</th>
                  <th>Género</th>
                  <th>Estado</th>
                  <th>Precio</th>
                  <th>Visible</th>
                  <th style={{ width: 90 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const name = p.fragella_cache?.Name ?? p.fragella_id;
                  const brand = p.fragella_cache?.Brand ?? '—';
                  const image =
                    p.fragella_cache?.['Image URL Transparent'] ??
                    p.fragella_cache?.['Image URL'];
                  const gender = p.fragella_cache?.Gender ?? '—';

                  return (
                    <tr key={p.id} className={p.active ? undefined : styles.inactive}>
                      <td>
                        {image ? (
                          <img className={styles.thumb} src={image} alt={name} loading="lazy" />
                        ) : (
                          <div className={styles.thumbPlaceholder}>🌸</div>
                        )}
                      </td>
                      <td>
                        <div className={styles.productName}>{name}</div>
                        <div className={styles.productBrand}>{brand}</div>
                      </td>
                      <td style={{ color: 'var(--muted)', fontSize: 13 }}>{gender}</td>
                      <td><StatusBadge status={p.stock_status} /></td>
                      <td style={{ fontWeight: 600 }}>{p.price}</td>
                      <td>
                        <button
                          className={`${styles.toggleBtn} ${p.active ? styles.active : styles.inactive}`}
                          onClick={() => handleToggleActive(p)}
                          title={p.active ? 'Click para desactivar' : 'Click para activar'}
                        >
                          {p.active ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={styles.iconBtn}
                            onClick={() => setEditing(p)}
                            title="Editar precio y stock"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className={`${styles.iconBtn} ${styles.danger}`}
                            onClick={() => handleDelete(p)}
                            title="Desactivar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {searchPanelOpen && (
        <FragellaSearchPanel onClose={() => setSearchPanelOpen(false)} />
      )}

      {editing && (
        <EditOverlay product={editing} onClose={() => setEditing(undefined)} />
      )}
    </div>
  );
}
