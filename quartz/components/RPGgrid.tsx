import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, FullSlug, simplifySlug, SimpleSlug } from "../util/path"

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

    const rpgsFolderUrl = resolveRelative((fileData.slug ?? "") as FullSlug, folder as FullSlug)

    return (
      <div className={`garden-section-container ${gridClassName}`}>
        {/* --- THE FANCY TITLE BLOCK --- */}
        <div className="garden-title">
          <h2 class="garden-title">
            <a href={rpgsFolderUrl} class="header-link">
              {title}
            </a>
            <a href={rpgsFolderUrl} >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-move-right"
              >
                <path d="M18 8L22 12L18 16" />
                <path d="M2 12H22" />
              </svg>
            </a>
          </h2>
        </div>
        {/* --- END FANCY TITLE BLOCK --- */}

        <div
          className="rpg-grid-cards"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {displayedRpgs.map((rpg) => {
            const fm = rpg.frontmatter as Frontmatter
            if (!fm) return null

            const rpgTitle = fm.title || rpg.slug?.split("/").pop() || "Untitled"
            const description = fm.description
            const coverImage = fm.cover || fm.image

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