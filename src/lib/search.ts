import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const DOCS_PATH = path.join(process.cwd(), 'content/docs')

export type SearchDoc = {
  slug: string
  title: string
  section: string
  order: number
  content: string
}

export function getSearchIndex(): SearchDoc[] {
  const files = fs.readdirSync(DOCS_PATH).filter(f => f.endsWith('.mdx'))
  return files
    .map(filename => {
      const slug = filename.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(DOCS_PATH, filename), 'utf8')
      const { data, content } = matter(raw)
      return {
        slug,
        title: data.title ?? slug,
        section: data.section ?? 'General',
        order: data.order ?? 99,
        content: content.replace(/<[^>]+>/g, ' ').replace(/[#*`>|]/g, ' ').replace(/\s+/g, ' ').trim(),
      }
    })
    .sort((a, b) => a.order - b.order)
}
