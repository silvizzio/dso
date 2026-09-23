# DSO Digital Twin documentation

Documentation site for the Dubai Silicon Oasis (DSO) Digital Twin, built by Vizzio under contract DIEZ/CON-00844.
The guide explains how visitors explore properties, assess the District IO proposal and contact the DSO commercial team.

Live site: https://www.vizzio.space/dso

The site is built from the Vizzio `template-docs` starter: Next.js 16, MDX (next-mdx-remote), Tailwind, deployed on Vercel.

## Quick start

```bash
git clone https://github.com/silvizzio/dso.git
cd dso
npm install
npm run dev
```

Open http://localhost:3000/dso.
The site serves under the `/dso` base path, so the bare root redirects there.

## Structure

The guide mirrors the platform.
Each timeline state is a section, and each chapter inside a section covers one task a visitor can do.

| Section | Chapters |
|---|---|
| Getting Started | 01 Overview, 02 Interface Guide |
| Future | 03 "Future" Overview, 04 Explore District IO, 05 Step Through the Delivery Years, 06 Drill Down to a Building, 07 Enquire Off-Plan |
| Now | 08 "Now" Overview, 09 Find Available Space, 10 Check How a Building Performs, 11 Explore Leased Buildings, 12 Watch Cameras and Videos, 13 Walk the Street and the Interior |
| Past | 14 "Past" Overview, 15 Step Through the Archive, 16 Check the Delivery Record |
| Reference | 17 Reference |

Future comes first because it is the default view and introduces District IO.
Now covers existing properties, while Past shows the district through archived imagery and completion records.

## Where things live

| Path | Contents |
|---|---|
| `content/docs/*.mdx` | The chapters. The file name is the URL slug. |
| `content/_archive/` | Dormant template chapters. Not built or served. |
| `private/images/docs/` | Processed screens, served through `/dso/api/img/<file>`. |
| `raw-images/` | Drop folder for source PNGs. Ignored by git and emptied after processing. |
| `tools/` | The image pipeline. |
| `src/app/page.tsx` | The landing page. |
| `src/components/platform-diagram.tsx` | The platform diagram shown on every overview chapter. |
| `src/components/mdx-components.tsx` | Callout, StepList and the other MDX components. |
| `public/logo.svg`, `src/app/icon.svg` | DSO logo and favicon. |

## Writing a chapter

Every chapter needs frontmatter.
The sidebar groups chapters by `section` and orders them by `order` across the whole site.

```yaml
---
title: Explore District IO
section: Future
order: 4
description: One line, shown on the landing page card.
---
```

Overview chapters use a quoted title, written with single quotes around the whole value:

```yaml
title: '"Future" Overview'
```

Write each chapter around the task it explains:

1. Introduce the visitor's question and explain how the feature helps.
2. Use descriptive headings that tell readers what they will find.
3. Explain the actions in order, including what changes on screen. Use numbered steps when they make a procedure easier to follow.
4. Explain the benefit for visitors and the DSO team where it adds useful context.
5. Describe design choices when their reasons help the reader understand the interface.
6. Link to the next relevant chapter where there is a natural continuation.

Every chapter must reference at least one image.
Every overview chapter carries the platform diagram directly under its first image.

## Writing rules

Use plain, professional British English.
Explain what visitors can do and why the information helps them.
Keep clear wording as it is, and add detail where a reader needs it to understand a task.
Avoid predicting how every visitor will feel or claiming that a feature guarantees an enquiry.

- Say "the DSO Digital Twin" or "the platform". Do not use "kiosk".
- Write one sentence per line in the MDX source. Markdown renders the lines as one paragraph.
- Aim for sentences under 25 words, with some variation in length. Split a sentence when it becomes hard to follow.
- Define each term once, in bold, where it first appears. Do not bold anything else in body text.
- No em dashes and no semicolons. Use a colon, a comma, parentheses or two sentences.
- No spaces around slashes.
- Avoid marketing adjectives and filler words, for example `seamless`, `powerful`, `leverage`, `ensure` or `journey`.
- Label projected and indicative figures on the page.
  Use the Reference chapter to check data status. Do not describe an indicative value, placeholder feed or pending connection as live.

## Adding screens

Screens are exported from Figma as PNG, named with the platform level, the timeline state and the topic:
LOD 3 - Now - Leased.png
LOD 3 - Future - District IO - 1A.png
LOD 1.png


The pipeline compresses each PNG to a JPG of 1920 px on the long edge and names it by timeline section:

| Source name starts with | Output prefix | Example |
|---|---|---|
| `LOD 1` or `LOD 2` | `02` | `02-lod2-dso-1.jpg` |
| `LOD 3 - Future` | `03-future` | `03-future-lod3-district-io-1a.jpg` |
| `LOD 3 - Now` | `04-now` | `04-now-lod3-leased.jpg` |
| `LOD 3 - Past` | `05-past` | `05-past-lod3-2020.jpg` |

To add or replace screens:

1. Put the PNGs in `raw-images/`.
2. Run the pipeline with a commit message. It processes the images, commits, empties `raw-images/` and pushes.

```bash
tools/process_and_clean.sh "Add Now screens"
```

To process without committing, run `python3 tools/name_images.py`.
To process automatically while you work, run `python3 tools/watch_images.py` (needs `pip install watchdog`).

Reference an image in MDX with its processed name.
The alt text becomes the caption under the image.

```md
![a leased building opened: its history, the units inside it and its live cameras](/dso/api/img/04-now-lod3-leased.jpg)
```

To hide an image without deleting it, wrap the line in an MDX comment:

```md
{/* Image to follow: ![caption](/dso/api/img/04-now-lod3-virtual-tour-interior.jpg) */}
```

## Components

| Component | Use |
|---|---|
| `<PlatformDiagram focus="all" />` | The platform diagram. `focus` is `all`, `future`, `now` or `past` and highlights that section. |
| `<Callout type="note" title="...">` | A highlighted note. Types: `note`, `warning`, `tip`, `admin`. |
| `<StepList>` with `<Step number={1}>` | A numbered procedure in a bordered list. |
| `<DocVideo src="..." caption="..." />` | A looping, muted video with a caption. Files go in `public/videos/docs/`, unchanged from the source. |
| Markdown tables | Rendered and styled automatically. |

Two MDX rules prevent build errors:

- Pass only string or number props to components. Array props break the MDX build.
- In `.tsx` components, keep each closing `>` on the same line as the last attribute.
  A line that holds only `>` can be lost when code is copied, which breaks the tag.

## Landing page

The landing page builds its sections from the chapter files, the same source as the sidebar.
Adding, renaming or reordering a chapter updates both.

- The two hero cards show Overview and "Future" Overview, each with the first image of its chapter.
- Browse by section lists Getting Started, Future, Now and Past. Reference is linked from the Getting started box instead.
- A section card uses the first image of its chapter, unless `COVERS` in `src/app/page.tsx` sets another.
- Section descriptions live in `SECTION_DESC` in the same file.

## Brand

| Token | Value | Use |
|---|---|---|
| DSO primary | `#194167` | Getting started box, platform diagram header and actions |
| District IO blue | `#006fff` | Future highlight in the platform diagram |
| Diagram panel | `#EEF4FB` with a `#D6E4F3` border | Background of the platform diagram |

The header, sidebar and mobile navigation use the DSO black logo, cropped to the mark.
The favicon switches to white when the browser uses dark mode.

## Deploy

The site deploys on Vercel as a Next.js project and builds with `next build`.

1. Set `NEXT_PUBLIC_BASE_URL` in the Vercel project settings (Production) to the project's own `.vercel.app` domain. The PDF export renders live pages and fails without it.
2. Keep the project's `.vercel.app` domain active. The vizzio.space router proxies to it.
3. The `vizzio-space` router repo holds the rewrite pair that maps `vizzio.space/dso` to this deployment.

Before pushing, run a production build locally to catch MDX errors:

```bash
npm run build
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the local dev server |
| `npm run build` | Builds for production |
| `npm run start` | Serves the production build |
| `npm run lint` | Runs ESLint |

## Version

The site is at v1.0.
The version shows in the sidebar, the mobile navigation and the PDF header.
Update `package.json` and those display strings together on a release.

Confidential. For authorised DSO and Vizzio stakeholders only.

## Screenshot refresh (23 September 2026)

The current screenshots come from the [DSO Drive folder](https://drive.google.com/drive/folders/1ucPRvZ28rA2T3uZnaKQmSXSO3Pip1Va5).
`tools/screenshot-sources.json` records each published asset, its source file and its checksum.
Past uses LOD 3 in the guide, as requested, even though the supplied PNG filenames currently say LOD 2.
The archive timelapse uses the 2005, 2010, 2015 and 2020 screenshots and ends with the 2026 Now view.
