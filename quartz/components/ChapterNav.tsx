import { QuartzComponent, QuartzComponentProps } from "./types"
import { resolveRelative, SimpleSlug, FilePath, slugifyFilePath } from "../util/path"

// Helper function that preserves folder casing for strict case-sensitive hosts (GitHub Pages)
const formatChapterSlug = (currentSlug: string, targetPath: string): SimpleSlug => {
  const cleanTarget = targetPath.replace(/[\[\]]/g, "").trim()

  // If frontmatter provides a full path or absolute slug
  if (cleanTarget.startsWith("/") || cleanTarget.includes("/")) {
    const formatted = cleanTarget.replace(/\s+/g, "-")
    return formatted as unknown as SimpleSlug
  }

  // Extract current file's directory while preserving exact casing (e.g., "rpgs/protected/Swords-Beyond")
  const lastSlashIndex = currentSlug.lastIndexOf("/")
  const currentDir = lastSlashIndex !== -1 ? currentSlug.substring(0, lastSlashIndex) : ""

  // Format only spaces to hyphens without changing character case
  const formattedTitle = cleanTarget.replace(/\s+/g, "-")

  const fullPath = currentDir ? `${currentDir}/${formattedTitle}` : formattedTitle
  
  return fullPath as unknown as SimpleSlug
}

export const ChapterNavPrev = (): QuartzComponent => {
  const ChapterNavPrevComponent: QuartzComponent = (props: QuartzComponentProps) => {
    const frontmatter = props.fileData.frontmatter
    if (!frontmatter || !frontmatter.prev || !props.fileData.slug) return null

    const prevRaw = frontmatter.prev as string
    const cleanDisplayTitle = prevRaw.replace(/[\[\]]/g, "").trim()
    const targetSlug = formatChapterSlug(props.fileData.slug, prevRaw)

    return (
      <div className="chapter-nav-prev" style={{ marginBottom: "0.5rem" }}>
        <a 
          href={resolveRelative(props.fileData.slug, targetSlug)}
          style={{ fontWeight: "bold", textDecoration: "none" }}
        >
          {cleanDisplayTitle}
        </a>
      </div>
    )
  }
  return ChapterNavPrevComponent
}

export const ChapterNavNext = (): QuartzComponent => {
  const ChapterNavNextComponent: QuartzComponent = (props: QuartzComponentProps) => {
    const frontmatter = props.fileData.frontmatter
    if (!frontmatter || !frontmatter.next || !props.fileData.slug) return null

    const nextRaw = frontmatter.next as string
    const cleanDisplayTitle = nextRaw.replace(/[\[\]]/g, "").trim()
    const targetSlug = formatChapterSlug(props.fileData.slug, nextRaw)

    return (
      <div className="chapter-nav-next" style={{ marginTop: "0.5rem" }}>
        <a 
          href={resolveRelative(props.fileData.slug, targetSlug)}
          style={{ fontWeight: "bold", textDecoration: "none" }}
        >
          {cleanDisplayTitle}
        </a>
      </div>
    )
  }
  return ChapterNavNextComponent
}