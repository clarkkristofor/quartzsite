import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  folder?: string
  displayClass?: string
}

const FolderGrid: QuartzComponent = ({ allFiles, displayClass: baseClass, fileData, options }: QuartzComponentProps & { options?: Options }) => {
  const currentSlug = fileData.slug ?? ""
  const targetFolder = options?.folder ?? currentSlug.replace(/\/index$/, "")

  // We combine the classes manually to avoid the TypeScript "mobile-only" restriction
  const customClass = options?.displayClass ?? ""
  const combinedClass = `${baseClass ?? ""} ${customClass}`.trim()

  const pages = allFiles.filter((page) => {
    const slug = page.slug ?? ""
    if (slug.endsWith("index")) return false

    const slugParts = slug.split("/")
    const targetParts = targetFolder.split("/").filter(p => p !== "")
    
    const isDirectChild = slugParts.length === targetParts.length + 1
    
    return slug.startsWith(targetFolder + "/") && isDirectChild
  })

  pages.sort((a, b) => {
    const d1 = a.dates?.modified ?? a.dates?.created ?? new Date(0)
    const d2 = b.dates?.modified ?? b.dates?.created ?? new Date(0)
    return d2.getTime() - d1.getTime()
  })

  if (pages.length === 0) return null

  return (
    <div className={`${combinedClass} folder-grid`}>
      {pages.map((page) => {
        const externalLink = (page.frontmatter?.link || page.frontmatter?.url) as string | undefined
        const targetLink = (externalLink ?? `/${page.slug}`).toString()

        let imageUrl = page.frontmatter?.image as string | undefined
        if (imageUrl && !imageUrl.startsWith("http")) {
          imageUrl = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`
        }

        return (
          <a href={targetLink} className="grid-card" key={page.slug}>
            {imageUrl && (
              <div className="card-image">
                <img src={imageUrl} alt="" />
              </div>
            )}
            <div className="card-content">
              <h3>{page.frontmatter?.title ?? (page.slug?.split('/').pop() || "Untitled")}</h3>
              <p>{page.frontmatter?.description ?? "No description..."}</p>
            </div>
          </a>
        )
      })}
    </div>
  )
}

export default ((opts?: Options) => {
  return (props: QuartzComponentProps) => FolderGrid({ ...props, options: opts })
}) satisfies QuartzComponentConstructor