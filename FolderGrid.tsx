import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, simplifySlug } from "../util/path"

export default (() => {
  const FolderGrid: QuartzComponent = ({ allFiles, displayClass, fileData }: QuartzComponentProps) => {
    // Only show files that are in the current folder and aren't the index page
    const currentFolder = fileData.slug
    const pages = allFiles.filter((page) => {
      const parent = page.slug?.split("/").slice(0, -1).join("/")
      return parent === currentFolder && !page.slug?.endsWith("index")
    })

    return (
      <div className={`folder-grid ${displayClass ?? ""}`}>
        {pages.map((page) => (
          <a href={simplifySlug(page.slug!)} className="grid-card">
            <div className="card-tag">{page.frontmatter?.tags?.[0] ?? "Note"}</div>
            <h3>{page.frontmatter?.title}</h3>
            <p>{page.frontmatter?.description ?? "No description available..."}</p>
          </a>
        ))}
      </div>
    )
  }

  return FolderGrid
}) satisfies QuartzComponentConstructor