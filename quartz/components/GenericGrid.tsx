import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import BaseGrid from "./BaseGrid"

interface Options {
  folder?: string
  displayClass?: string
  limit?: number
  title?: string
}

const GenericGrid: QuartzComponent = ({ allFiles, fileData, options }: QuartzComponentProps & { options?: Options }) => {
  const currentSlug = fileData.slug ?? ""
  const targetFolder = options?.folder ?? currentSlug.replace(/\/index$/, "")
  const title = options?.title

  const pages = allFiles.filter((page) => {
    const slug = page.slug ?? ""
    if (slug.endsWith("index")) return false

    const slugParts = slug.split("/")
    const targetParts = targetFolder.split("/").filter(p => p !== "")
    const isDirectChild = slugParts.length === targetParts.length + 1
    
    // --- The Logic Gate ---
    // 1. Is this the books folder?
    const isBookFolder = targetFolder.includes("books")
    
    // 2. Does it have a finished date?
    const isFinished = !!page.frontmatter?.date_finished

    // 3. Application: 
    // If it's books, ONLY show things that are NOT finished.
    // If it's NOT books (like RPGs), show everything.
    const shouldShow = isBookFolder ? !isFinished : true

    return slug.startsWith(targetFolder + "/") && isDirectChild && shouldShow
  })
  .sort((a, b) => {
    // Helper to safely convert frontmatter date to timestamp
    const getDateTimestamp = (page: typeof a): number => {
      const rawDate = page.frontmatter?.date
      
      // Handle undefined/null
      if (!rawDate) return 0
      
      // Handle string or Date object
      if (typeof rawDate === 'string' || rawDate instanceof Date) {
        return new Date(rawDate).getTime()
      }
      
      // Fallback for unexpected types
      return 0
    }

    const timeA = getDateTimestamp(a)
    const timeB = getDateTimestamp(b)

    // Sort by custom date (newest first)
    return timeB - timeA
  })

  const displayedPages = options?.limit ? pages.slice(0, options.limit) : pages

  return <BaseGrid pages={displayedPages} title={title} customClass={options?.displayClass} />
}

export default ((opts?: Options) => {
  return (props: QuartzComponentProps) => GenericGrid({ ...props, options: opts })
}) satisfies QuartzComponentConstructor