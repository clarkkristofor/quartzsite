// quartz/components/RPGgrid.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, FullSlug, slugifyFilePath } from "../util/path"

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

export default ((userOpts?: Options) => {
  const folder = userOpts?.folder ?? "rpgs"
  const title = userOpts?.title ?? "RPGs"
  const limit = userOpts?.maxDisplay ?? Infinity
  const className = userOpts?.displayClass ?? "rpg-grid"
  const sectionLink = `/${folder}/`

  const RPGGrid: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
    const parseWikilink = (linkStr?: string): { text: string; slug: FullSlug } | null => {
      if (!linkStr || typeof linkStr !== "string") return null

      let clean = linkStr
        .trim()
        .replace(/^['\"]|['\"]$/g, "")
        .replace(/^\[\[/, "")
        .replace(/\]\]$/, "")
        .trim()
      if (!clean) return null

      let displayAlias = ""
      if (clean.includes("|")) {
        const parts = clean.split("|")
        clean = parts[0].trim()
        displayAlias = parts[1].trim()
      }

      const fullSlug = slugifyFilePath(clean as any)
      return {
        text: displayAlias || clean,
        slug: fullSlug,
      }
    }

    // Filter files in the RPG folder that strictly have a 'current campaign' frontmatter property
    const activeRpgNotes = allFiles
      .filter((file) => {
        const slug = file.slug ?? ""
        const isDirectChild = slug.split("/").length === folder.split("/").length + 1
        const isRpgNote = slug.startsWith(folder + "/") && !slug.endsWith("index") && isDirectChild

        const fm = (file.frontmatter ?? {}) as Frontmatter
        const hasCurrentCampaign = !!(fm["current campaign"] || fm["current_campaign"])

        return isRpgNote && hasCurrentCampaign
      })
      .slice(0, limit)

    if (activeRpgNotes.length === 0) return null

    return (
      <div className={`garden-section-container ${className}`}>
        {title && (
          <h2 className="garden-title">
            {sectionLink ? (
              <a href={sectionLink} className="header-link">
                {title}
                <span className="header-arrow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </a>
            ) : (
              <span className="header-text-only">{title}</span>
            )}
          </h2>
        )}

        <div className="rpg-grid-cards">
          {activeRpgNotes.map((rpg) => {
            const fm = (rpg.frontmatter ?? {}) as Frontmatter
            const rpgTitle = fm.title || rpg.slug?.split("/").pop() || "Untitled"
            const description = fm.description || ""
            const coverImage = fm.cover || fm.image

            const rawCampaign = fm["current campaign"] || fm["current_campaign"]
            const currentCampaign = parseWikilink(rawCampaign as string)

            const rpgUrl = resolveRelative((fileData.slug ?? "") as FullSlug, rpg.slug!)

            return (
              <div className="grid-card" key={rpg.slug}>
                {coverImage && (
                  <div className="card-image rpg-card-image-link">
                    <a href={rpgUrl}>
                      <img src={coverImage} alt={rpgTitle} className="rpg-card-image" />
                    </a>
                  </div>
                )}

                <div className="card-content">
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