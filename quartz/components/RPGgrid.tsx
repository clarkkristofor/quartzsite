// quartz/components/RPGgrid.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, SimpleSlug, simplifySlug, FullSlug } from "../util/path"

interface Options {
  title?: string
  maxDisplay?: number
}

// Define a type interface for frontmatter fields
interface Frontmatter {
  title?: string
  description?: string
  cover?: string
  image?: string
  [key: string]: any // Allows string indexing like fm["current campaign"]
}

const defaultOptions = {
  title: "RPGs",
  maxDisplay: Infinity,
} satisfies Options

export default ((userOpts?: Options) => {
  const opts = { ...defaultOptions, ...userOpts }

  const RPGGrid: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
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

      // Cast frontmatter to explicit type
      const fm = (file.frontmatter ?? {}) as Frontmatter

      const rawCampaign = fm["current campaign"] ?? fm["currentCampaign"] ?? fm["current_campaign"]
      
      return Boolean(rawCampaign)
    })

    if (activeRpgNotes.length === 0) return null

    const maxLimit = userOpts?.maxDisplay ?? opts.maxDisplay
    const displayNotes = activeRpgNotes.slice(0, maxLimit)
    const hasMore = activeRpgNotes.length > maxLimit
    const rpgsFolderUrl = resolveRelative((fileData.slug ?? "") as FullSlug, "rpgs/index" as SimpleSlug)

    return (
      <div className="rpg-section">
        <div className="rpg-grid">
          {displayNotes.map((rpg) => {
            // Cast frontmatter safely
            const fm = (rpg.frontmatter ?? {}) as Frontmatter

            const rpgTitle = fm.title ?? rpg.slug?.split("/").pop() ?? "Untitled RPG"
            const description = fm.description
            const coverImage = fm.cover || fm.image
            
            const rawCampaign = fm["current campaign"] ?? fm["currentCampaign"] ?? fm["current_campaign"]
            const currentCampaign = parseWikilink(rawCampaign as string)

            const rpgUrl = resolveRelative((fileData.slug ?? "") as FullSlug, rpg.slug!)

            return (
              <div className="rpg-card" key={rpg.slug}>
                {coverImage && (
                  <a href={rpgUrl} className="rpg-card-image-link">
                    <img src={coverImage} alt={rpgTitle} className="rpg-card-image" />
                  </a>
                )}

                <div className="rpg-card-content">
                  <div className="rpg-card-header">
                    <h3>
                      <a href={rpgUrl} className="internal">
                        {rpgTitle}
                      </a>
                    </h3>
                  </div>

                  {description && <p className="rpg-card-desc">{description}</p>}

                  {currentCampaign && (
                    <div className="rpg-card-status">
                      <span className="status-label">🔥 Current Campaign:</span>{" "}
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

          {hasMore && (
            <div className="rpg-card rpg-card-more">
              <div className="rpg-card-content">
                <div className="rpg-card-header">
                  <h3>
                    <a href={rpgsFolderUrl} className="internal">
                      More Systems →
                    </a>
                  </h3>
                </div>
                <p className="rpg-card-desc">
                  Explore {activeRpgNotes.length - maxLimit} additional campaign logs and rules.
                </p>
                <a href={rpgsFolderUrl} className="internal view-all-link">
                  View All RPG Notes ({activeRpgNotes.length})
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return RPGGrid
}) satisfies QuartzComponentConstructor