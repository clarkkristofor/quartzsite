import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import SimpleList from "./SimpleList"

interface Options {
  title: string
  folder: string
  link: string
  limit?: number
  displayClass?: string
}

const defaultOptions: Options = {
  title: "Section",
  folder: "",
  link: "/",
  limit: 5,
}

export default ((userOpts?: Partial<Options>) => {
  const opts = { ...defaultOptions, ...userOpts }

  const GardenSection: QuartzComponent = (props: QuartzComponentProps) => {
    const { allFiles } = props
    const { title, folder, link, limit, displayClass } = opts

    const pages = allFiles.filter((page) => {
      const slug = page.slug ?? ""
      if (slug.endsWith("index")) return false
      const slugParts = slug.split("/")
      const targetParts = folder.split("/").filter((p: string) => p !== "")
      return slug.startsWith(folder + "/") && slugParts.length === targetParts.length + 1
    })

    const displayedPages = pages
      .sort((a, b) => {
        // Check multiple date sources to find any unique timestamp
        const dateA = a.dates?.modified?.getTime() ?? a.dates?.created?.getTime() ?? a.dates?.published?.getTime() ?? 0
        const dateB = b.dates?.modified?.getTime() ?? b.dates?.created?.getTime() ?? b.dates?.published?.getTime() ?? 0

        if (dateA !== dateB) {
          return dateB - dateA
        }

        // Tie-breaker
        return (a.frontmatter?.title ?? "").localeCompare(b.frontmatter?.title ?? "")
      })
      .slice(0, limit)

    const isMusic = title.toLowerCase().includes("music")

    // We pass all the variables we "read" from opts into SimpleList
    return (
      <SimpleList 
        pages={displayedPages} 
        title={title}
        link={link} 
        isMusic={isMusic} 
        customClass={displayClass} 
      />
    )
  }

  return GardenSection
}) satisfies QuartzComponentConstructor