import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import BaseGrid from "./BaseGrid"

interface Options { 
  folder: string
  displayClass?: string
  limit?: number
  title?: string
}

const BookGrid: QuartzComponent = (props: QuartzComponentProps & { options?: Options }) => {
  // Pull values from options, with hard-coded defaults if they are missing
  const folder = props.options?.folder ?? "books"
  const title = props.options?.title ?? "Books"
  const limit = props.options?.limit ?? 6
  const link = `/${folder}/` // Dynamic link based on the folder
  
  const pages = props.allFiles.filter(page => {
    const slug = page.slug ?? ""
    // Ensure we only look at direct children of the target folder
    const isDirectChild = slug.split("/").length === (folder.split("/").length + 1)
    
    // Logic Gate: Only include pages with a date_finished value in frontmatter
    const isFinished = !!page.frontmatter?.date_finished 
    
    return slug.startsWith(folder + "/") && !slug.endsWith("index") && isDirectChild && isFinished
  })
  .map(page => ({
    ...page,
    frontmatter: {
      ...page.frontmatter,
      // Fallback Logic: use 'coverUrl' if 'image' is missing
      image: page.frontmatter?.image || page.frontmatter?.coverUrl
    }
  }))
  .sort((a, b) => {
    const fmA = a.frontmatter as any
    const fmB = b.frontmatter as any
    
    const dateA = fmA?.date_finished as string | undefined
    const dateB = fmB?.date_finished as string | undefined
    
    // Sort by most recently finished
    return (dateB ? new Date(dateB).getTime() : 0) - (dateA ? new Date(dateA).getTime() : 0)
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
 * The Constructor Factory
 * This captures the options passed from layout.ts (like title: "Read") 
 * and injects them into the component's props.
 */
export default ((opts?: Options) => {
  const Component = (props: QuartzComponentProps) => <BookGrid options={opts} {...props} />
  return Component
}) satisfies QuartzComponentConstructor