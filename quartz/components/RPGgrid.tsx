// quartz/components/RPGGrid.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, SimpleSlug, simplifySlug, FullSlug } from "../util/path"

interface Options {
  title?: string
  maxDisplay?: number
}

const defaultOptions = {
  title: "RPGs",
  maxDisplay: Infinity,
} satisfies Options

export default ((userOpts?: Options) => {
  const opts = { ...defaultOptions, ...userOpts }

  const RPGGrid: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
    const allRpgNotes = allFiles.filter((file) => file.slug?.startsWith("rpgs/"))

    if (allRpgNotes.length === 0) return null

    const parseWikilink = (linkStr?: string): { text: string; slug: SimpleSlug } | null => {
      if (!linkStr) return null
      const cleanText = linkStr.replace(/^\[\[/, "").replace(/\]\]$/, "").trim()
      if (!cleanText) return null

      const targetFile = allFiles.find(
        (f) => f.frontmatter?.title === cleanText || f.slug?.endsWith(cleanText.toLowerCase().replace(/\s+/g, "-"))
      )

      const targetSlug: SimpleSlug = targetFile?.slug 
        ? simplifySlug(targetFile.slug)
        : (cleanText.toLowerCase().replace(/\s+/g, "-") as SimpleSlug)

      return { text: cleanText, slug: targetSlug }
    }

    const maxLimit = opts.maxDisplay ?? Infinity
    const displayedNotes = allRpgNotes.slice(0, maxLimit)
    // const rpgsFolderUrl = resolveRelative(fileData.slug!, "rpgs" as SimpleSlug)

    return (
      <div className="rpg-section">
        {opts.title && <h2>{opts.title}</h2>}
        <div className="rpg-grid">
          {displayedNotes.map((rpg) => {
            const rpgTitle = (rpg.frontmatter?.title as string | undefined) ?? rpg.slug ?? "Untitled System"
            const description = (rpg.frontmatter?.description as string | undefined) ?? (rpg.frontmatter?.summary as string | undefined)

            const currentCampaignRaw = (rpg.frontmatter?.current_campaign ?? rpg.frontmatter?.["current campaign"]) as string | undefined
            const currentCampaign = parseWikilink(currentCampaignRaw)

            const coverImage = (rpg.frontmatter?.cover ?? rpg.frontmatter?.image) as string | undefined
            const rpgUrl = resolveRelative(fileData.slug!, simplifySlug(rpg.slug!))

            return (
              <div className="rpg-card" key={rpg.slug}>
                {/* Left Column: Cover Image */}
                {coverImage && (
                  <a href={rpgUrl} className="rpg-card-image-link">
                    <img src={coverImage} alt={rpgTitle} className="rpg-card-image" />
                  </a>
                )}

                {/* Right Column: Title, Description, Campaign Link */}
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
        </div>
      </div>
    )
  }

  return RPGGrid
}) satisfies QuartzComponentConstructor