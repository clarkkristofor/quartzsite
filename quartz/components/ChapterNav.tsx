import { QuartzComponent, QuartzComponentProps } from "./types"
import { resolveRelative, SimpleSlug, FilePath, slugifyFilePath } from "../util/path"

// Helper function to turn raw titles or relative strings into valid SimpleSlug relative to current directory
const formatChapterSlug = (currentSlug: string, targetPath: string): SimpleSlug => {
  const cleanTarget = targetPath.replace(/[\[\]]/g, "").trim()

  if (cleanTarget.startsWith("/") || cleanTarget.includes("/")) {
    return slugifyFilePath(cleanTarget as unknown as FilePath) as unknown as SimpleSlug
  }

  const lastSlashIndex = currentSlug.lastIndexOf("/")
  const currentDir = lastSlashIndex !== -1 ? currentSlug.substring(0, lastSlashIndex) : ""
  const slugifiedTitle = cleanTarget.toLowerCase().replace(/\s+/g, "-")
  const fullPath = currentDir ? `${currentDir}/${slugifiedTitle}` : slugifiedTitle
  
  return slugifyFilePath(fullPath as unknown as FilePath) as unknown as SimpleSlug
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