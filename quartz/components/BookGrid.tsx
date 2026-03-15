import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import BaseGrid from "./BaseGrid"

interface Options { 
  folder: string
  displayClass?: string
  limit?: number
  title?: string
}

const BookGrid: QuartzComponent = (props: QuartzComponentProps & { options?: Options }) => {
  const folder = props.options?.folder ?? "books"
  const title = props.options?.title ?? "Books"
  const link = "/books/"
  const limit = props.options?.limit ?? 6
  
  const pages = props.allFiles.filter(page => {
    const slug = page.slug ?? ""
    const isDirectChild = slug.split("/").length === (folder.split("/").length + 1)
    
    // Logic Gate: Must have a date_finished value
    const isFinished = !!page.frontmatter?.date_finished 
    
    return slug.startsWith(folder + "/") && !slug.endsWith("index") && isDirectChild && isFinished
  })
  .map(page => ({
    ...page,
    frontmatter: {
      ...page.frontmatter,
      // Fallback Logic: if 'image' is missing, use 'coverUrl'
      image: page.frontmatter?.image || page.frontmatter?.coverUrl
    }
  }))
  .sort((a, b) => {
    // We cast frontmatter to 'any' to bypass the property existence check
    const fmA = a.frontmatter as any
    const fmB = b.frontmatter as any
    
    const dateA = fmA?.date_finished as string | undefined
    const dateB = fmB?.date_finished as string | undefined
    
    return (dateB ? new Date(dateB).getTime() : 0) - (dateA ? new Date(dateA).getTime() : 0)
  })
  .slice(0, limit)

  return <BaseGrid pages={pages} title={title} link={link} customClass={props.options?.displayClass} {...props} />
}

export default ((opts?: Options) => {
  return (props: QuartzComponentProps) => BookGrid({ ...props, options: opts })
}) satisfies QuartzComponentConstructor