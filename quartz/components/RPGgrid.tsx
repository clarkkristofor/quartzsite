import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import BaseGrid from "./BaseGrid"

interface Options { 
  folder: string
  displayClass?: string 
  limit?: number
}

const RPGgrid: QuartzComponent = (props: QuartzComponentProps & { options?: Options }) => {
  const folder = props.options?.folder ?? "rpgs"
  const title = "RPGs"
  const link = "/rpgs/"
  const limit = props.options?.limit ?? 4
  
  const pages = props.allFiles.filter(page => {
    const slug = page.slug ?? ""
    if (slug.endsWith("index")) return false
    
    const slugParts = slug.split("/")
    const targetParts = folder.split("/").filter(p => p !== "")
    
    // Only direct children
    return slug.startsWith(folder + "/") && slugParts.length === targetParts.length + 1
  })
  .sort((a, b) => (b.dates?.modified?.getTime() ?? 0) - (a.dates?.modified?.getTime() ?? 0))
  .slice(0, limit)

  return <BaseGrid pages={pages} title={title} link={link} customClass={props.options?.displayClass} {...props} />
}


export default ((opts?: Options) => {
  return (props: QuartzComponentProps) => RPGgrid({ ...props, options: opts })
}) satisfies QuartzComponentConstructor