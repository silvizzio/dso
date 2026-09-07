import Link from 'next/link'
import { type DocMeta } from '@/lib/docs'

type Props = {
  prev: DocMeta | null
  next: DocMeta | null
}

export default function PrevNext({ prev, next }: Props) {
  if (!prev && !next) return null

  return (
    <div className="mt-12 pt-6 border-t border-border flex items-center justify-between gap-4">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group flex flex-col gap-0.5 max-w-xs"
        >
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Previous
          </span>
          <span className="text-sm text-foreground group-hover:underline underline-offset-2">
            {prev.title}
          </span>
          <span className="text-xs text-muted-foreground">{prev.section}</span>
        </Link>
      ) : <div />}

      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group flex flex-col gap-0.5 max-w-xs items-end text-right"
        >
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-1">
            Next
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
          <span className="text-sm text-foreground group-hover:underline underline-offset-2">
            {next.title}
          </span>
          <span className="text-xs text-muted-foreground">{next.section}</span>
        </Link>
      ) : <div />}
    </div>
  )
}