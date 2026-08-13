import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, FullSlug, slugifyFilePath } from "../util/path"

interface Options {
  title?: string
  link?: string // Added so you can pass a custom link for the title arrow
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
  folder: "rpgs" 
} satisfies Options

export default ((userOpts?: Options) => {
  const opts = { ...defaultOptions, ...userOpts }

  const RPGGrid: QuartzComponent = ({ allFiles, fileData, displayClass }: QuartzComponentProps) => {
    const gridClassName = displayClass ?? opts.displayClass ?? "rpg-grid"
    const folder = opts.folder ?? "rpgs"
    const title = opts.title
    
    // Automatically point the title link to the folder index if no link is explicitly provided
    const sectionLink = opts.link ?? (folder ? `/${folder}/` : undefined)

    const parseWikilink = (linkStr?: string): { text: string; slug: FullSlug } | null => {
      if (!linkStr || typeof linkStr !== "string") return null
      
      let clean = linkStr.trim().replace(/^['"]|['"]$/g, "").replace(/^\[\[/, "").replace(/\]\]$/, "").trim()
      if (!clean) return null

      let displayAlias = clean
      if (clean.includes("|")) {
        const parts = clean.split("|")
        clean = parts[0]
        displayAlias = parts[1]
      }
      
      return { text: displayAlias, slug: slugifyFilePath(clean as any) as FullSlug }
    }

    const pages = allFiles.filter((f) => f.slug?.startsWith(folder + "/") && f.slug !== folder + "/index")
    const displayPages = pages.slice(0, opts.maxDisplay)

    if (displayPages.length === 0) {
      return null
    }

    const currentSlug = (fileData.slug ?? "index") as FullSlug

    return (
      // Added your garden-section-container wrapper
      <div className={`garden-section-container ${gridClassName}`}>
        
        {/* Restored Header Block */}
        {title && (
          <h2 className="garden-title">
            {sectionLink ? (
              <a href={sectionLink} className="header-link">
                {title}
                <span className="header-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        
        {/* The Style-Free Card Grid */}
        <div className="rpg-grid-cards">
          {displayPages.map((rpg) => {
            // Preserving the strict TS string casts to prevent Signalish/alt errors
            const fm = (rpg.frontmatter ?? {}) as Frontmatter
            const rpgTitle = (fm.title ?? rpg.name ?? "Untitled") as string
            const description = fm.description as string | undefined
            const coverImage = (fm.cover || fm.image) as string | undefined

            const rawCampaign = fm["current campaign"] || fm["current_campaign"]
            const currentCampaign = parseWikilink(rawCampaign as string)

            const rpgUrl = resolveRelative(currentSlug, (rpg.slug ?? "") as FullSlug)

            return (
              <div className="grid-card rpg-card" key={rpg.slug}>
                {coverImage && (
                  <div className="card-image rpg-card-image-link">
                    <a href={rpgUrl}>
                      <img src={coverImage} alt={`${rpgTitle}`} className="rpg-card-image" />
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
                        href={resolveRelative(currentSlug, currentCampaign.slug)}
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