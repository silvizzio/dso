import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const DOCS_PATH = path.join(process.cwd(), 'content/docs')

export type DocMeta = {
  slug: string
  title: string
  section: string
  order: number
  role?: string
}

export type Doc = DocMeta & {
  content: string
}

export function getAllDocs(): DocMeta[] {
  const files = fs.readdirSync(DOCS_PATH).filter(f => f.endsWith('.mdx'))

  return files
    .map(filename => {
      const slug = filename.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(DOCS_PATH, filename), 'utf8')
      const { data } = matter(raw)
      return {
        slug,
        title: data.title ?? slug,
        section: data.section ?? 'General',
        order: data.order ?? 99,
        role: data.role,
      }
    })
    .sort((a, b) => a.order - b.order)
}

export function getDoc(slug: string): Doc | null {
  const filePath = path.join(DOCS_PATH, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? slug,
    section: data.section ?? 'General',
    order: data.order ?? 99,
    role: data.role,
    content,
  }
}

export function getDocsBySection(): Record<string, DocMeta[]> {
  const docs = getAllDocs()
  return docs.reduce((acc, doc) => {
    if (!acc[doc.section]) acc[doc.section] = []
    acc[doc.section].push(doc)
    return acc
  }, {} as Record<string, DocMeta[]>)
}

export function getPrevNext(slug: string): {
  prev: DocMeta | null
  next: DocMeta | null
} {
  const docs = getAllDocs()
  const index = docs.findIndex(d => d.slug === slug)
  return {
    prev: index > 0 ? docs[index - 1] : null,
    next: index < docs.length - 1 ? docs[index + 1] : null,
  }
}