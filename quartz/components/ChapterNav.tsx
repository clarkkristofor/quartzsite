import { QuartzComponent, QuartzComponentProps } from "./types"
import { resolveRelative, SimpleSlug, FilePath, slugifyFilePath } from "../util/path"

const formatChapterSlug = (currentSlug: string, targetPath: string): SimpleSlug => {
  const cleanTarget = targetPath.replace(/[\[\]]/g, "").trim()

  // Extract current file's directory while keeping exact casing (e.g., "rpgs/protected/Swords-Beyond")
  const lastSlashIndex = currentSlug.lastIndexOf("/")
  const currentDir = lastSlashIndex !== -1 ? currentSlug.substring(0, lastSlashIndex) : ""

  // If frontmatter already provides a path with slashes
  if (cleanTarget.startsWith("/") || cleanTarget.includes("/")) {
    return cleanTarget as unknown as SimpleSlug
  }

  // Slugify ONLY the title filename (converts "The World & Its Peoples" -> "The-World--and--Its-Peoples")
  const slugifiedTitle = slugifyFilePath(cleanTarget as unknown as FilePath) as string

  // Join directory with the slugified title
  const fullPath = currentDir ? `${currentDir}/${slugifiedTitle}` : slugifiedTitle
  
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