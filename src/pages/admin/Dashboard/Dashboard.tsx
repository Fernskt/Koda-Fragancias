import { useState } from 'react';
import { LogOut, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import {
  usePerfumesAdmin,
  useCreatePerfumeAdmin,
  useUpdatePerfumeAdmin,
  useSetActivePerfume,
  useDeletePerfumeAdmin,
} from '../../../hooks/usePerfumesAdmin';
import { ProductForm } from '../../../components/features/admin/ProductForm';
import { normalize } from '../../../utils/normalize';
import type { Perfume } from '../../../types/perfume';
import styles from './Dashboard.module.css';

function StatusBadge({ status }: { status: Perfume['status'] }) {
  const cls =
    status === 'Disponible' ? styles.ok
    : status === 'Última unidad' ? styles.warn
    : styles.error;
  return <span className={`${styles.badge} ${cls}`}>{status}</span>;
}

export function Dashboard() {
  const { logout } = useAuth();
  const { data: perfumes = [], isLoading } = usePerfumesAdmin();
  const createMutation = useCreatePerfumeAdmin();
  const updateMutation = useUpdatePerfumeAdmin();
  const toggleActiveMutation = useSetActivePerfume();
  const deleteMutation = useDeletePerfumeAdmin();

  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Perfume | undefined>(undefined);

  const filtered = perfumes.filter((p) => {
    const q = normalize(search);
    return !q || normalize(`${p.name} ${p.brand}`).includes(q);
  });

  const stats = {
    total: perfumes.length,
    active: perfumes.filter((p) => (p as Perfume & { active?: boolean }).active !== false).length,
    disponible: perfumes.filter((p) => p.status === 'Disponible').length,
    sinStock: perfumes.filter((p) => p.status === 'Sin stock').length,
  };

  const handleSave = async (data: Omit<Perfume, 'id'>, id?: number) => {
    if (id !== undefined) {
      await updateMutation.mutateAsync({ id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleDelete = (p: Perfume) => {
    if (!window.confirm(`¿Desactivar "${p.name}"? Podrás reactivarlo después.`)) return;
    deleteMutation.mutate(p.id);
  };

  const handleToggleActive = (p: Perfume & { active?: boolean }) => {
    const next = p.active === false;
    toggleActiveMutation.mutate({ id: p.id, active: next });
  };

  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (p: Perfume) => {
    setEditing(p);
    setFormOpen(true);
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
          <button className={styles.btnNew} onClick={openCreate}>
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
                  <th>Tipo</th>
                  <th>Género</th>
                  <th>Estado</th>
                  <th>Precio</th>
                  <th>Visible</th>
                  <th style={{ width: 90 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const perfumeWithActive = p as Perfume & { active?: boolean };
                  const isActive = perfumeWithActive.active !== false;
                  return (
                    <tr key={p.id} className={isActive ? undefined : styles.inactive}>
                      <td>
                        {p.image ? (
                          <img className={styles.thumb} src={p.image} alt={p.name} loading="lazy" />
                        ) : (
                          <div className={styles.thumbPlaceholder}>🌸</div>
                        )}
                      </td>
                      <td>
                        <div className={styles.productName}>{p.name}</div>
                        <div className={styles.productBrand}>{p.brand}</div>
                      </td>
                      <td style={{ color: 'var(--muted)', fontSize: 13 }}>{p.type}</td>
                      <td style={{ color: 'var(--muted)', fontSize: 13 }}>{p.gender}</td>
                      <td><StatusBadge status={p.status} /></td>
                      <td style={{ fontWeight: 600 }}>{p.price}</td>
                      <td>
                        <button
                          className={`${styles.toggleBtn} ${isActive ? styles.active : styles.inactive}`}
                          onClick={() => handleToggleActive(perfumeWithActive)}
                          title={isActive ? 'Click para desactivar' : 'Click para activar'}
                        >
                          {isActive ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={styles.iconBtn}
                            onClick={() => openEdit(p)}
                            title="Editar"
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

      {formOpen && (
        <ProductForm
          perfume={editing}
          onSave={handleSave}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  );
}
