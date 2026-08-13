import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, SimpleSlug, simplifySlug, FullSlug } from "../util/path"

interface Options {
  title?: string
  maxDisplay?: number
  columns?: number
  displayClass?: string
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
} satisfies Options

export default ((userOpts?: Options) => {
  const opts = { ...defaultOptions, ...userOpts }

  const RPGGrid: QuartzComponent = ({ allFiles, fileData, displayClass }: QuartzComponentProps) => {
    const cols = opts.columns ?? (opts.maxDisplay !== Infinity ? opts.maxDisplay : 2)
    const gridClassName = displayClass ?? opts.displayClass ?? "rpg-grid"

    const parseWikilink = (linkStr?: string): { text: string; slug: SimpleSlug } | null => {
      if (!linkStr || typeof linkStr !== "string") return null
      
      let clean = linkStr.trim().replace(/^['\"]|['\"]$/g, "").replace(/^\[\[/, "").replace(/\]\]$/, "").trim()
      if (!clean) return null

      let displayAlias = ""
      if (clean.includes("|")) {
        const parts = clean.split("|")
        clean = parts[0].trim()
        displayAlias = parts[1].trim()
      }

      const slug = simplifySlug(clean as FullSlug)
      const text = displayAlias || clean.split("/").pop() || clean
      return { text, slug }
    }

    // STRICT FILTER: ONLY include files in rpgs/ that HAVE a "current campaign" or "current_campaign" property
    const activeRpgNotes = allFiles.filter((file) => {
      const slug = file.slug ?? ""
      if (!slug.startsWith("rpgs/")) return false
      if (slug === "rpgs/index" || slug === "rpgs/") return false

      const fm = (file.frontmatter ?? {}) as Frontmatter
      const rawCampaign = fm["current campaign"] || fm["current_campaign"]

      // Checks if 'current campaign' property exists and actually contains text/wikilink
      const campaignLink = parseWikilink(rawCampaign as string)
      return Boolean(campaignLink)
    })

    const displayedRpgs = activeRpgNotes.slice(0, opts.maxDisplay)

    if (displayedRpgs.length === 0) return null

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
          {displayedRpgs.map((rpg) => {
            const fm = (rpg.frontmatter ?? {}) as Frontmatter
            const rpgTitle = fm.title || rpg.slug?.split("/").pop() || "Untitled RPG"
            const description = fm.description
            const coverImage = fm.cover || fm.image

            const rawCampaign = fm["current campaign"] || fm["current_campaign"]
            const currentCampaign = parseWikilink(rawCampaign as string)

            const rpgUrl = resolveRelative((fileData.slug ?? "") as FullSlug, rpg.slug!)

            return (
              <div className="grid-card">
                {coverImage && (
                  <div className="card-image rpg-card-image-link">
                    <a href={rpgUrl}>
                      <img src={coverImage} alt={rpgTitle} className="rpg-card-image" />
                    </a>
                  </div>
                )}

                <div className="card-content">
                  <h3>{rpgTitle}</h3>

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