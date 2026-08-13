import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzComponentProps } from "./quartz/components/types"

// 1. Components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.PageLogo(),
    Component.Search(),
  ],
  afterBody: [],
  footer: Component.Footer({
    links: {},
  }),
}

// Instantiate top-level components
const SidebarToc = Component.TableOfContents()
const ChapterNext = Component.ChapterNavNext()

// 2. STANDARD NOTE & HOMEPAGE LAYOUT
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.RPGgrid({ 
      maxDisplay: 2
    }) as any,
    Component.BookGrid({ 
      folder: "books", 
      displayClass: "book-grid", 
      limit: 6 
    }) as any,
  ],
  left: [],
  right: [
    Component.GardenSection({ 
      title: "Music", 
      folder: "music", 
      link: "/music/", 
      limit: 3
    }) as any,
    Component.GardenSection({ 
      title: "Notes", 
      folder: "blog", 
      link: "/blog/", 
      limit: 3
    }) as any, 
  ],
}

// 3. LIST PAGES (Tags/Folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.FolderGridSystem(),
  ],
  left: [
    ((props: QuartzComponentProps) => {
      const slug = (props.fileData.slug ?? "").toLowerCase()
      
      const isSwordsBeyond = slug.includes("swords-beyond") || slug.includes("swords beyond")

      if (!isSwordsBeyond) return null

      return (
        <div className="sidebar-content">
          <img
            src="https://superclark.net/Files/swords-beyond---logo---online-rules.png"
            alt="Swords Beyond"
          />
          <ChapterNext {...props} />
          <SidebarToc {...props} />
        </div>
      )
    }),
  ],
  right: [],
}