// quartz/components/RPGgrid.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, SimpleSlug, simplifySlug, FullSlug } from "../util/path"

interface Options {
  title?: string
  maxDisplay?: number
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
    // Robust wikilink parser handling [[Path/To/File|Alias]] or [[File]]
    const parseWikilink = (linkStr?: string): { text: string; slug: SimpleSlug } | null => {
      if (!linkStr || typeof linkStr !== "string") return null
      
      let clean = linkStr.trim().replace(/^['"]|['"]$/g, "").replace(/^\[\[/, "").replace(/\]\]$/, "").trim()
      if (!clean) return null

      let displayAlias = ""
      if (clean.includes("|")) {
        const parts = clean.split("|")
        clean = parts[0].trim()
        displayAlias = parts[1].trim()
      }

      const rawTargetName = clean.split("/").pop() ?? clean

      const targetFile = allFiles.find((f) => {
        const fm = (f.frontmatter ?? {}) as Frontmatter
        const fTitle = fm.title ?? ""
        const fSlug = f.slug ?? ""
        return (
          fTitle.toLowerCase() === rawTargetName.toLowerCase() ||
          fSlug.toLowerCase().endsWith(rawTargetName.toLowerCase().replace(/\s+/g, "-")) ||
          fSlug.toLowerCase() === clean.toLowerCase().replace(/\s+/g, "-")
        )
      })

      const targetSlug: SimpleSlug = targetFile?.slug 
        ? simplifySlug(targetFile.slug)
        : (clean.toLowerCase().replace(/\s+/g, "-") as SimpleSlug)

      const targetFm = (targetFile?.frontmatter ?? {}) as Frontmatter
      const displayText = displayAlias || targetFm.title || rawTargetName

      return {
        text: displayText,
        slug: targetSlug,
      }
    }

    // 1. FILTER: Only get notes in /rpgs/ that HAVE a 'current campaign' property
    const activeRpgNotes = allFiles.filter((file) => {
      const slug = file.slug ?? ""
      if (!slug.startsWith("rpgs/") || slug.endsWith("index")) return false

      const fm = (file.frontmatter ?? {}) as Frontmatter
      const rawCampaign = fm["current campaign"] ?? fm["currentCampaign"] ?? fm["current_campaign"]
      
      return Boolean(rawCampaign)
    })

    if (activeRpgNotes.length === 0) return null

    const maxLimit = userOpts?.maxDisplay ?? opts.maxDisplay
    const displayNotes = activeRpgNotes.slice(0, maxLimit)
    const rpgsFolderUrl = resolveRelative((fileData.slug ?? "") as FullSlug, "rpgs/index" as SimpleSlug)

    const titleText = userOpts?.title ?? opts.title

    return (
      <div className={`garden-section-container`}>
        {/* Section Title matching BaseGrid.tsx header formatting */}
        {titleText && (
          <h2 className="garden-title">
            <a href={rpgsFolderUrl} className="header-link">
              {titleText}
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
          </h2>
        )}

        {/* Outer grid container */}
        <div className="folder-grid">
          {displayNotes.map((rpg) => {
            const fm = (rpg.frontmatter ?? {}) as Frontmatter

            const rpgTitle = fm.title ?? rpg.slug?.split("/").pop() ?? "Untitled RPG"
            const description = fm.description
            const coverImage = fm.cover || fm.image
            
            const rawCampaign = fm["current campaign"] ?? fm["currentCampaign"] ?? fm["current_campaign"]
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

                  {description && <p>{description}</p>}

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