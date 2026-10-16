import { TracesDashboard } from '@/features/traces/components/traces-dashboard'

export function App() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Observa</h1>
          <p className="text-sm text-muted-foreground">Cómo se usan tus agentes y tools de IA.</p>
        </header>
        <TracesDashboard />
      </main>
    </div>
  )
}
