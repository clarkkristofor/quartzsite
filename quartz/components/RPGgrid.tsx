import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import BaseGrid from "./BaseGrid"

interface Options { 
  folder: string
  displayClass?: string 
  limit?: number
  title?: string // Added title to options to make it flexible
}

const RPGgrid: QuartzComponent = (props: QuartzComponentProps & { options?: Options }) => {
  // Pull values from options with fallbacks
  const folder = props.options?.folder ?? "rpgs"
  const title = props.options?.title ?? "RPGs" // Now supports custom titles like "Current Games"
  const limit = props.options?.limit ?? 4
  const link = `/${folder}/` // Dynamic link based on the folder
  
  const pages = props.allFiles.filter(page => {
    const slug = page.slug ?? ""
    if (slug.endsWith("index")) return false
    
    const slugParts = slug.split("/")
    const targetParts = folder.split("/").filter(p => p !== "")
    
    // Only direct children
    return slug.startsWith(folder + "/") && slugParts.length === targetParts.length + 1
  })
  .sort((a, b) => {
    // 1. Get timestamps (fallback to 0)
    const dateA = a.dates?.modified?.getTime() ?? 0
    const dateB = b.dates?.modified?.getTime() ?? 0
    
    // 2. If dates are different, sort by date (Newest first)
    if (dateA !== dateB) {
      return dateB - dateA
    }
    
    // 3. TIE-BREAKER: If dates are the same (like on GitHub), 
    // sort by Title so it's at least predictable
    const titleA = a.frontmatter?.title ?? a.slug ?? ""
    const titleB = b.frontmatter?.title ?? b.slug ?? ""
    return titleA.localeCompare(titleB)
  })
  .slice(0, limit)

  return (
    <BaseGrid 
      pages={pages} 
      title={title} 
      link={link} 
      customClass={props.options?.displayClass} 
      {...props} 
    />
  )
}

/**
 * Corrected Constructor Factory
 * Ensures options passed from layout.ts are correctly injected into props.
 */
export default ((opts?: Options) => {
  const Component = (props: QuartzComponentProps) => <RPGgrid options={opts} {...props} />
  return Component
}) satisfies QuartzComponentConstructor