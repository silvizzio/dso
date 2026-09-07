import { getDoc, getAllDocs, getPrevNext } from '@/lib/docs'
import { getLastUpdated } from '@/lib/last-updated'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/print-button'
import PrevNext from '@/components/prev-next'
import TableOfContents from '@/components/toc'
import remarkGfm from 'remark-gfm'
import {
  Callout,
  ScreenshotPlaceholder,
  Kbd,
  StepList,
  Step,
  ReferenceTable,
  DetectionClassTable,
  ArchitectureDiagram,
  CoreWorkflowDiagram,
} from '@/components/mdx-components'
import { DocImage } from '@/components/doc-image'
import { SystemMap } from '@/components/system-map'
import { SimState, SimSources, SimGrid } from '@/components/sim-flow'

export async function generateStaticParams() {
  const docs = getAllDocs()
  return docs.map(doc => ({ slug: doc.slug }))
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const doc = getDoc(slug)
  if (!doc) notFound()

  const { prev, next } = getPrevNext(slug)

  const components = {
    Callout,
    ScreenshotPlaceholder,
    Kbd,
    StepList,
    Step,
    ReferenceTable,
    DetectionClassTable,
    ArchitectureDiagram,
    CoreWorkflowDiagram,
    SystemMap,
    SimState,
    SimSources,
    SimGrid,
        img: DocImage,
  }

  return (
    <>
      <TableOfContents />
      <div style={{ padding: '24px 0' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '24px' }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Docs</Link>
          <span>/</span>
          <span>{doc.section}</span>
          <span>/</span>
          <span style={{ color: 'hsl(var(--foreground))' }}>{doc.title}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', gap: '16px', flexWrap: 'wrap' as any }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 500, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              {doc.section}
            </p>
            <h1 style={{ fontSize: '28px', fontWeight: 500, color: 'hsl(var(--foreground))', lineHeight: 1.3, margin: 0 }}>
              {doc.title}
            </h1>
          </div>
          <PrintButton title={doc.title} section={doc.section} slug={slug} />
        </div>

        <article className="prose prose-zinc max-w-none
          prose-headings:font-medium prose-headings:scroll-mt-6
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-lg prose-h3:mt-7 prose-h3:mb-2
          prose-p:text-base prose-p:leading-relaxed prose-p:text-muted-foreground
          prose-li:text-base prose-li:text-muted-foreground
          prose-strong:text-foreground prose-strong:font-medium
          prose-table:text-sm
          prose-th:text-xs prose-th:font-medium prose-th:uppercase prose-th:tracking-wide
          prose-td:text-muted-foreground
          prose-blockquote:text-base prose-blockquote:text-muted-foreground
          prose-blockquote:not-italic prose-blockquote:border-l-2
          prose-code:text-sm prose-code:bg-muted prose-code:px-1.5
          prose-code:py-0.5 prose-code:rounded prose-code:font-normal
          prose-hr:border-border">
          <MDXRemote
            source={doc.content}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            components={components}
          />
        </article>

        <PrevNext prev={prev} next={next} />

        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid hsl(var(--border))' }}>
          <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
            © 2026 Vizzio · Project Documentation · {getLastUpdated().full} · Confidential
          </p>
        </div>

      </div>
    </>
  )
}
