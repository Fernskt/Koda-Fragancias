import { PageWrapper } from '../../../components/layout/PageWrapper';

export function Dashboard() {
  return (
    <PageWrapper>
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 18px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, marginBottom: 16 }}>Panel de administración</h1>
        <p style={{ color: 'var(--muted)', fontSize: 16 }}>
          Próximamente — requiere autenticación con Supabase.
        </p>
      </main>
    </PageWrapper>
  );
}
