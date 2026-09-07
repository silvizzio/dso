# template-docs

Reusable starter for Vizzio digital-twin documentation sites. Next.js, MDX (next-mdx-remote), Tailwind, deploys to Vercel. Sidebar, search, table of contents, PDF export, and the doc image pipeline all work out of the box.

Every doc site (rsg, efm/analyst, efm/user) is built from this template and served under a subpath on vizzio.space.

## Start a new project

1. Click "Use this template" on GitHub, or clone this repo.
2. Rename the project in `package.json` (the `"name"` field).
3. `npm install`
4. `npm run dev` and open http://localhost:3000/project

This template ships with `basePath: '/project'`, so it serves under `/project`, not the bare root. Your next step is to change that slug to your own.

## Step 1: set your basePath (do this first)

The template is scoped under `/project`. Every new site must replace `/project` with its own slug (for example `/efm/analyst`). Miss one of these and images or the PDF will break. Change it in all of these:

- `next.config.ts`: the `basePath` value, and the root redirect `destination`
- `src/app/page.tsx`: the hero and quick-link `href` values, and the logo path
- `src/components/doc-header.tsx`, `sidebar.tsx`, `mobile-nav.tsx`: the `<img src="/project/logo.svg">` path
- `src/components/doc-image.tsx`: the `/project/api/img/` url
- `src/components/print-button.tsx` and `full-guide-button.tsx`: the `fetch('/project/api/pdf...')` calls
- `src/app/api/pdf/route.ts`: the `baseUrl` (it appends `/project` to the origin)

A find-and-replace of `/project` to `/yourslug` across `src` and `next.config.ts` covers all of these. Verify afterward that nothing stray remains.

## Step 2: set the domain env var (required for PDF)

The PDF route renders live pages with headless Chromium, so it needs the deployed origin. Without this the PDF falls back to localhost and fails.

In Vercel, the project's Settings, Environment Variables (Production):

    NEXT_PUBLIC_BASE_URL = https://your-project.vercel.app

Redeploy after setting it.

## Step 3: deploy and wire into the router

1. Push to GitHub and import the repo in Vercel. Framework is Next.js, no extra config. It builds with `next build`.
2. Keep the project's own `.vercel.app` domain alive; the vizzio.space router proxies to it.
3. In the `vizzio-space` router repo (corporate-owned, under the DevUE24 account; requires access to that repo), add a rewrite pair in `vercel.json` so `vizzio.space/yourslug` proxies to your deployment:

        { "source": "/yourslug", "destination": "https://your-project.vercel.app/yourslug" },
        { "source": "/yourslug/:path*", "destination": "https://your-project.vercel.app/yourslug/:path*" }

Order more specific slugs above less specific ones.

## Where things live

- `content/docs/*.mdx` are the chapters. This is what you edit per project. Filenames become URL slugs (`04-persona-b.mdx` serves at `/docs/04-persona-b`).
- `content/_archive/` holds dormant reference chapters. Not built or served.
- `private/images/docs/` holds processed doc images, served through the streaming image route (`/api/img`). Do not commit raw PNGs here.
- `raw-images/` is where you drop source PNGs before processing. Emptied after.
- `tools/` holds the image pipeline: `name_images.py` (compress raw PNGs to JPG), `process_and_clean.sh` (process, commit, clear), `watch_images.py` (watch mode). See `tools/WATCH-README.md`.
- `src/lib/docs.ts` reads chapters and frontmatter. Leave it unless changing the docs model.
- `src/components/` is the site shell (sidebar, header, TOC, MDX components). Project-agnostic.
- `src/app/page.tsx` is the landing page. Edit its copy and section list per project.

## Writing a chapter

Every file in `content/docs/` needs frontmatter. The sidebar groups by `section` and orders by `order`:

    ---
    title: Overview
    section: Getting Started
    order: 1
    role: OPERATOR A
    description: One line shown on the landing card.
    ---

    Body in MDX. Standard markdown plus the custom components below.

- `title` shows in the sidebar and page header.
- `section` is the sidebar group and the landing "Browse by section" group.
- `order` sorts across the whole site, not per section.
- `role` is optional, for persona chapters.
- `description` is optional, shown on the landing card.

## Available components

Use these directly in MDX. They are defined in `src/components/mdx-components.tsx`.

- `<Callout type="info">...</Callout>`: highlighted note. Types: info, warning.
- `<ScreenshotPlaceholder caption="..." />`: grey image placeholder. Use for image slots until a real screenshot exists.
- `<StepList><Step number={1}>...</Step></StepList>`: numbered procedure.
- `<Kbd>K</Kbd>`: keyboard key.
- `<ReferenceTable headers={["A","B"]} rows={[["1","2"]]} />`: do NOT use in MDX. Complex array props break the MDX build. Use a plain markdown table instead.
- `<DetectionClassTable />`: self-contained detection class reference table. No props.
- `<CoreWorkflowDiagram />`: self-contained workflow diagram. No props.
- `<ArchitectureDiagram />`: self-contained architecture diagram. No props.

Note: standard markdown tables render styled automatically. For image slots, prefer `ScreenshotPlaceholder` over markdown images in template content; markdown images require a real file in `private/images/docs/` and will fail the build if missing.

## Adding real images

1. Export source PNGs.
2. Drop them in `raw-images/`.
3. Run `tools/process_and_clean.sh "message"` (or `python3 tools/name_images.py`) to compress to JPG under `private/images/docs/`.
4. Reference in MDX with a markdown image; the filename maps to `/yourslug/api/img/<file>`.

## Conventions

- No em dashes anywhere. Use commas, colons, or parentheses.
- No spaces around slashes (write type/phase, not type / phase).
- Tables teach meaning, not raw UI values.

## Version

New sites start at v1.0.0. The version shows in the sidebar, mobile nav, and PDF header. Update `package.json` version and those display strings together on a release.

## Scripts

- `npm run dev` local dev server
- `npm run build` production build
- `npm run start` serve the production build
- `npm run lint` eslint

## Deploy

Push to GitHub and import the repo in Vercel. Builds with `next build`. Set `NEXT_PUBLIC_BASE_URL` (Step 2) or the PDF export will fail.
