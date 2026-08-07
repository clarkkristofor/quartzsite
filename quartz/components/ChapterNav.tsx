import { QuartzComponent, QuartzComponentProps } from "./types"
import { resolveRelative, SimpleSlug, FilePath, slugifyFilePath } from "../util/path"

// Helper function to resolve paths cleanly while preserving folder casing
const formatChapterSlug = (currentSlug: string, targetPath: string): SimpleSlug => {
  const cleanTarget = targetPath.replace(/[\[\]]/g, "").trim()
  const lastSlashIndex = currentSlug.lastIndexOf("/")
  const currentDir = lastSlashIndex !== -1 ? currentSlug.substring(0, lastSlashIndex) : ""

  if (cleanTarget.startsWith("/") || cleanTarget.includes("/")) {
    return cleanTarget as unknown as SimpleSlug
  }

  const slugifiedTitle = slugifyFilePath(cleanTarget as unknown as FilePath) as string
  const fullPath = currentDir ? `${currentDir}/${slugifiedTitle}` : slugifiedTitle
  
  return fullPath as unknown as SimpleSlug
}

export const ChapterNavNext = (): QuartzComponent => {
  const ChapterNavNextComponent: QuartzComponent = (props: QuartzComponentProps) => {
    const { fileData, allFiles } = props
    if (!fileData.slug) return null

    // 1. Get current directory path (e.g., "rpgs/protected/Swords-Beyond")
    const lastSlashIndex = fileData.slug.lastIndexOf("/")
    const currentDir = lastSlashIndex !== -1 ? fileData.slug.substring(0, lastSlashIndex) : ""
    if (!currentDir) return null

    // 2. Find all markdown files in the exact same directory (excluding index/folder root and hidden items)
    const folderFiles = allFiles.filter((file) => {
        if (!file.slug) return false
        
        const fileDir = file.slug.substring(0, file.slug.lastIndexOf("/"))
        const isSameDir = fileDir === currentDir && !file.slug.endsWith("/index")
        
        // Check frontmatter flags to hide notes
        const order = file.frontmatter?.order ?? file.frontmatter?.weight
        const isHidden = order === 0 || file.frontmatter?.draft === true || file.frontmatter?.hidden === true

        return isSameDir && !isHidden
    })

    // 3. Sort files by frontmatter `order`, `weight`, or fallback to alphabetical title
    folderFiles.sort((a, b) => {
      const orderA = (a.frontmatter?.order ?? a.frontmatter?.weight ?? 99) as number
      const orderB = (b.frontmatter?.order ?? b.frontmatter?.weight ?? 99) as number
      if (orderA !== orderB) return orderA - orderB
      
      const titleA = (a.frontmatter?.title ?? a.slug ?? "").toString()
      const titleB = (b.frontmatter?.title ?? b.slug ?? "").toString()
      return titleA.localeCompare(titleB)
    })

    if (folderFiles.length === 0) return null

    return (
      <div className="chapter-nav-container" style={{ marginTop: "1.5rem" }}>
        {/* Wrapped inside button container to inherit TOC's background card styling */}
        <div className="toc-header">
          <button 
            type="button" 
            className="toc-button" 
            style={{ width: "100%", textAlign: "left", cursor: "default" }}
          >
            <h3>Chapters</h3>
          </button>
        </div>

        {/* Chapter List */}
        <div className="chapter-nav-full-list" style={{ marginTop: "0.5rem" }}>
          {folderFiles.map((file) => {
            const isCurrent = file.slug === fileData.slug
            const title = (file.frontmatter?.title ?? file.slug?.split("/").pop()) as string
            const targetSlug = formatChapterSlug(fileData.slug!, title)

            return (
              <div 
                key={file.slug} 
                className={`chapter-nav-item ${isCurrent ? "active-chapter" : ""}`}
                style={{ marginBottom: "0.35rem" }}
              >
                {isCurrent ? (
                  <span style={{ fontWeight: "bold", opacity: 0.85 }}>{title}</span>
                ) : (
                  <a 
                    href={resolveRelative(fileData.slug!, targetSlug)}
                    style={{ textDecoration: "none" }}
                  >
                    {title}
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return ChapterNavNextComponent
}

// Keep a lightweight export for backwards compatibility in quartz.layout.tsx
export const ChapterNavPrev = (): QuartzComponent => {
  return () => null
}