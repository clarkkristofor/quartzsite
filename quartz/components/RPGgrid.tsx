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
    // 1. Extract the custom 'date' from frontmatter
    // We assume the frontmatter 'date' is a string (ISO format) or a Date object
    const dateA = a.frontmatter?.date
    const dateB = b.frontmatter?.date

    // 2. Convert to timestamps, falling back to 0 (very old) if missing
    // If it's already a Date object, getTime() works. If it's a string, new Date() parses it.
    const timeA = dateA ? new Date(dateA).getTime() : 0
    const timeB = dateB ? new Date(dateB).getTime() : 0

    // If times are actually different, sort newest first
    if (timeA !== timeB) {
      return timeB - timeA
    }

    // Only if times are identical, use title as a stable tie-breaker
    return (a.frontmatter?.title ?? "").localeCompare(b.frontmatter?.title ?? "")
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