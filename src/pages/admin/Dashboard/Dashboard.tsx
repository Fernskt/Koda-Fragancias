import { useMemo, useState } from 'react';
import { LogOut, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
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

const PAGE_SIZE = 50;
const TYPE_OPTIONS = ['Todos', 'Arabe', 'Diseñador'];
const GENDER_OPTIONS = ['Todos', 'Hombre', 'Mujer', 'Unisex', 'Femenino'];
const STATUS_OPTIONS = ['Todos', 'Disponible', 'Última unidad', 'Sin stock'];
const VISIBLE_OPTIONS = ['Todos', 'Activos', 'Inactivos'];

const unique = (arr: string[]) => [...new Set(arr)].sort((a, b) => a.localeCompare(b, 'es'));

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
  const [brandFilter, setBrandFilter] = useState('Todas');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [genderFilter, setGenderFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [visibleFilter, setVisibleFilter] = useState('Todos');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Perfume | undefined>(undefined);

  const brandOptions = useMemo(
    () => ['Todas', ...unique(perfumes.map((p) => p.brand))],
    [perfumes]
  );

  const filtered = perfumes.filter((p) => {
    const q = normalize(search);
    const matchesSearch = !q || normalize(`${p.name} ${p.brand}`).includes(q);
    const matchesBrand = brandFilter === 'Todas' || p.brand === brandFilter;
    const matchesType = typeFilter === 'Todos' || p.type === typeFilter;
    const matchesGender = genderFilter === 'Todos' || p.gender === genderFilter;
    const matchesStatus = statusFilter === 'Todos' || p.status === statusFilter;
    const isActive = p.active !== false;
    const matchesVisible =
      visibleFilter === 'Todos' || (visibleFilter === 'Activos' ? isActive : !isActive);
    return matchesSearch && matchesBrand && matchesType && matchesGender && matchesStatus && matchesVisible;
  });

  const updateSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };
  const updateBrandFilter = (v: string) => {
    setBrandFilter(v);
    setPage(1);
  };
  const updateTypeFilter = (v: string) => {
    setTypeFilter(v);
    setPage(1);
  };
  const updateGenderFilter = (v: string) => {
    setGenderFilter(v);
    setPage(1);
  };
  const updateStatusFilter = (v: string) => {
    setStatusFilter(v);
    setPage(1);
  };
  const updateVisibleFilter = (v: string) => {
    setVisibleFilter(v);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hasActiveFilters =
    search !== '' ||
    brandFilter !== 'Todas' ||
    typeFilter !== 'Todos' ||
    genderFilter !== 'Todos' ||
    statusFilter !== 'Todos' ||
    visibleFilter !== 'Todos';

  const clearFilters = () => {
    setSearch('');
    setBrandFilter('Todas');
    setTypeFilter('Todos');
    setGenderFilter('Todos');
    setStatusFilter('Todos');
    setVisibleFilter('Todos');
  };

  const stats = {
    total: perfumes.length,
    active: perfumes.filter((p) => p.active !== false).length,
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
    if (!window.confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return;
    deleteMutation.mutate(p.id);
  };

  const handleToggleActive = (p: Perfume) => {
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
          <div className={styles.toolbarLeft}>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Buscar por nombre o marca..."
              value={search}
              onChange={(e) => updateSearch(e.target.value)}
            />
            {hasActiveFilters && (
              <button className={styles.btnClear} onClick={clearFilters}>Limpiar filtros</button>
            )}
          </div>
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
                  <th>
                    <select className={styles.thSelect} value={brandFilter} onChange={(e) => updateBrandFilter(e.target.value)} aria-label="Filtrar por marca">
                      <option value="Todas">Marca</option>
                      {brandOptions.filter((opt) => opt !== 'Todas').map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </th>
                  <th>
                    <select className={styles.thSelect} value={typeFilter} onChange={(e) => updateTypeFilter(e.target.value)} aria-label="Filtrar por tipo">
                      <option value="Todos">Tipo</option>
                      {TYPE_OPTIONS.filter((opt) => opt !== 'Todos').map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </th>
                  <th>
                    <select className={styles.thSelect} value={genderFilter} onChange={(e) => updateGenderFilter(e.target.value)} aria-label="Filtrar por género">
                      <option value="Todos">Género</option>
                      {GENDER_OPTIONS.filter((opt) => opt !== 'Todos').map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </th>
                  <th>
                    <select className={styles.thSelect} value={statusFilter} onChange={(e) => updateStatusFilter(e.target.value)} aria-label="Filtrar por estado">
                      <option value="Todos">Estado</option>
                      {STATUS_OPTIONS.filter((opt) => opt !== 'Todos').map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </th>
                  <th>Precio</th>
                  <th>
                    <select className={styles.thSelect} value={visibleFilter} onChange={(e) => updateVisibleFilter(e.target.value)} aria-label="Filtrar por visibilidad">
                      <option value="Todos">Visible</option>
                      {VISIBLE_OPTIONS.filter((opt) => opt !== 'Todos').map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </th>
                  <th style={{ width: 90 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((p) => {
                  const isActive = p.active !== false;
                  return (
                    <tr key={p.id} className={isActive ? undefined : styles.inactive}>
                      <td>
                        {p.perfume_img ? (
                          <img className={styles.thumb} src={p.perfume_img} alt={p.name} loading="lazy" />
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
                          onClick={() => handleToggleActive(p)}
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
                            title="Eliminar"
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

        {/* Pagination */}
        {!isLoading && filtered.length > 0 && (
          <div className={styles.pagination}>
            <span className={styles.pageInfo}>
              Mostrando {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filtered.length)} de {filtered.length}
            </span>
            <div className={styles.pageControls}>
              <button
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Página anterior"
              >
                <ChevronLeft size={16} />
              </button>
              <span className={styles.pageCurrent}>Página {currentPage} de {totalPages}</span>
              <button
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
              >
                <ChevronRight size={16} />
              </button>
            </div>
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
