// quartz/components/RPGgrid.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, FullSlug, slugifyFilePath } from "../util/path"
import { CSSProperties } from "preact/compat"

interface Options {
  title?: string
  maxDisplay?: number
  columns?: number
  displayClass?: string
  folder?: string
}

interface Frontmatter {
  title?: string
  description?: string
  cover?: string
  image?: string
  [key: string]: any
}

const defaultOptions = {
  title: "RPGs",
  maxDisplay: Infinity,
  folder: "rpgs",
  columns: 2,
} satisfies Options

export default ((userOpts?: Options) => {
  const opts = { ...defaultOptions, ...userOpts }

  const RPGGrid: QuartzComponent = ({ allFiles, fileData, displayClass }: QuartzComponentProps) => {
    const folder = opts.folder ?? "rpgs"
    const title = opts.title ?? "RPGs"
    const limit = opts.maxDisplay ?? Infinity
    const cols = opts.columns ?? (limit !== Infinity ? limit : 2)
    const gridClassName = displayClass ?? opts.displayClass ?? "rpg-grid"

    const parseWikilink = (linkStr?: string): { text: string; slug: FullSlug } | null => {
      if (!linkStr || typeof linkStr !== "string") return null
      let clean = linkStr.trim().replace(/^['\"]|['\"]/g, "").replace(/^\[\[/, "").replace(/\]\]$/, "").trim()
      if (!clean) return null

      let displayAlias = ""
      if (clean.includes("|")) {
        const parts = clean.split("|")
        clean = parts[0].trim()
        displayAlias = parts[1].trim()
      }

      const targetSlug = slugifyFilePath(clean as any) as FullSlug
      return {
        text: displayAlias || clean,
        slug: targetSlug,
      }
    }

    const rpgNotes = allFiles.filter((file) => file.slug?.startsWith(`${folder}/`) && file.slug !== folder)

    const sortedRpgs = rpgNotes.sort((a, b) => {
      const dateA = new Date(a.dates?.modified || a.dates?.created || 0).getTime()
      const dateB = new Date(b.dates?.modified || b.dates?.created || 0).getTime()
      return dateB - dateA
    })

    const displayedRpgs = sortedRpgs.slice(0, limit)
    if (displayedRpgs.length === 0) {
      return null
    }

    return (
      <div className={gridClassName} style={{ "--columns": cols } as CSSProperties}>
        {title && (
          <h2>
            <a href={resolveRelative((fileData.slug ?? "") as FullSlug, `/${folder}/` as FullSlug)} className="internal">
              {title}
            </a>
          </h2>
        )}
        <div className={`${gridClassName}-cards grid-card-container`}>
          {displayedRpgs.map((rpg) => {
            const fm = rpg.frontmatter as Frontmatter
            const rpgTitle = fm?.title || rpg.slug?.split("/").pop() || "Untitled"
            const description = fm?.description
            const coverImage = fm?.cover || fm?.image

            const rawCampaign = fm["current campaign"] || fm["current_campaign"]
            const currentCampaign = parseWikilink(rawCampaign as string)

            const rpgUrl = resolveRelative((fileData.slug ?? "") as FullSlug, rpg.slug! as FullSlug)

            return (
              <div className="grid-card rpg-card" key={rpg.slug}>
                {coverImage && (
                  <div className="card-image rpg-card-image-link">
                    <a href={rpgUrl}>
                      <img src={coverImage} alt={rpgTitle} className="rpg-card-image" />
                    </a>
                  </div>
                )}

                <div className="card-content rpg-card-content">
                  <h3>
                    <a href={rpgUrl}>{rpgTitle}</a>
                  </h3>

                  {description && <p className="rpg-card-desc">{description}</p>}

                  {currentCampaign && (
                    <div className="rpg-card-status">
                      <span className="status-label">🔥 Campaign:</span>{" "}
                      <a
                        href={resolveRelative((fileData.slug ?? "") as FullSlug, currentCampaign.slug)}
                        className="internal campaign-link"
                      >
                        {currentCampaign.text}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return RPGGrid
}) satisfies QuartzComponentConstructor