// quartz/components/BookGrid.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import BaseGrid from "./BaseGrid"

interface Options { 
  folder: string
  displayClass?: string
  limit?: number
  columns?: number
  title?: string
}

const BookGrid: QuartzComponent = ({ options, ...props }: QuartzComponentProps & { options?: Options }) => {
  const folder = options?.folder ?? "books"
  const title = options?.title ?? "Books"
  const limit = options?.limit ?? 6
  const cols = options?.columns ?? Math.min(limit, 3)
  const className = options?.displayClass ?? "book-grid"
  const link = `/${folder}/`
  
  const pages = props.allFiles.filter(page => {
    const slug = page.slug ?? ""
    const isDirectChild = slug.split("/").length === (folder.split("/").length + 1)
    const isFinished = !!page.frontmatter?.date_finished 
    
    return slug.startsWith(folder + "/") && !slug.endsWith("index") && isDirectChild && isFinished
  })
  .map(page => ({
    ...page,
    frontmatter: {
      ...page.frontmatter,
      image: page.frontmatter?.image || page.frontmatter?.coverUrl
    }
  }))
  .sort((a, b) => {
    const fmA = a.frontmatter as any
    const fmB = b.frontmatter as any
    const dateA = fmA?.date_finished as string | undefined
    const dateB = fmB?.date_finished as string | undefined
    return (dateB ? new Date(dateB).getTime() : 0) - (dateA ? new Date(dateA).getTime() : 0)
  })
  .slice(0, limit)

  return (
    <div className={className}>
      <BaseGrid 
        pages={pages} 
        title={title} 
        link={link} 
        customClass={className}
        {...props} 
      />
    </div>
  )
}

export default ((options?: Options) => {
  return (props: QuartzComponentProps) => <BookGrid options={options} {...props} />
}) satisfies QuartzComponentConstructor