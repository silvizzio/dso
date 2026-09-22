import fs from 'fs'
import path from 'path'
import { NextRequest } from 'next/server'

const EXT_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

const IMAGES_DIR = path.join(process.cwd(), 'private', 'images', 'docs')

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params
  const filename = segments.join('/')

  // resolve and confirm the path stays inside the images dir (block traversal)
  const filePath = path.normalize(path.join(IMAGES_DIR, filename))
  if (!filePath.startsWith(IMAGES_DIR + path.sep)) {
    return new Response('Not found', { status: 404 })
  }

  const ext = path.extname(filePath).toLowerCase()
  const mime = EXT_MIME[ext]
  if (!mime) {
    return new Response('Unsupported type', { status: 404 })
  }

  let buffer: Buffer
  try {
    buffer = fs.readFileSync(filePath)
  } catch {
    return new Response('Not found', { status: 404 })
  }

  // Versioned address (?v=<content fingerprint>): cache for a year, it never changes.
  // Plain address: always check for a newer file.
  const versioned = new URL(req.url).searchParams.has('v')
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': mime,
      'Cache-Control': versioned ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate',
    },
  })
}
