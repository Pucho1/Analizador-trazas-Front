import { InboxIcon } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
}

/** Placeholder for a successful request that returned nothing to show. */
export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
      <InboxIcon aria-hidden className="size-8 text-muted-foreground" />
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
