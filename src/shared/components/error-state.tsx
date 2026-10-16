import { CircleAlertIcon } from 'lucide-react'

import type { ApiErrorKind } from '@/api/api-error'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import { Button } from '@/shared/components/ui/button'

const MESSAGES = {
  auth: {
    title: 'Claves de Langfuse incorrectas',
    description:
      'Langfuse ha rechazado las credenciales. Revisa las claves configuradas en el backend.',
  },
  source_unavailable: {
    title: 'Langfuse no está disponible',
    description: 'No se han podido obtener las trazas. Inténtalo de nuevo en unos minutos.',
  },
  network: {
    title: 'No se puede conectar con el servidor',
    description: 'Comprueba que el backend de Observa está en marcha y es accesible.',
  },
  unknown: {
    title: 'Error inesperado',
    description: 'Algo ha fallado al cargar los datos.',
  },
} as const satisfies Record<ApiErrorKind, { title: string; description: string }>

interface ErrorStateProps {
  kind: ApiErrorKind
  onRetry: () => void
  isRetrying?: boolean
}

/** Explains a failed request in the user's terms and lets them try again. */
export function ErrorState({ kind, onRetry, isRetrying = false }: ErrorStateProps) {
  const { title, description } = MESSAGES[kind]

  return (
    <Alert variant="destructive">
      <CircleAlertIcon aria-hidden />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>{description}</p>
        <Button variant="outline" size="sm" onClick={onRetry} disabled={isRetrying}>
          {isRetrying ? 'Reintentando…' : 'Reintentar'}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
