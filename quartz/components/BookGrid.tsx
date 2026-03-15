import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import BaseGrid from "./BaseGrid"

interface Options { 
  folder: string
  displayClass?: string
  limit?: number
  title?: string
}

// We change the signature to accept 'options' as a top-level prop alongside Quartz props
const BookGrid: QuartzComponent = ({ options, ...props }: QuartzComponentProps & { options?: Options }) => {
  // We pull from 'options' (which the factory below will provide)
  const folder = options?.folder ?? "books"
  const title = options?.title ?? "Books"
  const limit = options?.limit ?? 6
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
    <BaseGrid 
      pages={pages} 
      title={title} 
      link={link} 
      customClass={options?.displayClass} 
      {...props} 
    />
  )
}

// The Constructor Factory: This is the critical change
export default ((userOptions?: Options): QuartzComponentConstructor => {
  const Component = (externalProps: QuartzComponentProps) => (
    <BookGrid options={userOptions} {...externalProps} />
  )
  return Component
}) satisfies QuartzComponentConstructor