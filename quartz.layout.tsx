import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzComponent, QuartzComponentProps } from "./quartz/components/types"

// 1. Shared header and footer components across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.PageMenu(),
    Component.PageLogo(),
    Component.Search(),
  ],
  afterBody: [],
  footer: Component.Footer({
    links: {},
  }),
}

// Instantiate sidebar helpers
const SidebarToc = Component.TableOfContents()
const ChapterNext = Component.ChapterNavNext()

// 2. STANDARD NOTE & HOMEPAGE LAYOUT (2-Column Grid: Main + Right Sidebar)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    // Homepage Grids with the restored isHome safeguard & terminal log check
    ((props: QuartzComponentProps) => {
      const slug = props.fileData.slug ?? ""
      const isHome = slug === "index" || slug === "" || slug === "/"
      
      console.log("PAGE SLUG CHECK ->", JSON.stringify(slug), "IS HOME?", isHome)

      if (!isHome) return null

      return (
        <>
          {Component.RPGgrid({ maxDisplay: 2 }) as any}
          {Component.GardenSection({ title: "Music", folder: "music", link: "/music/", limit: 3 }) as any}
          {Component.BookGrid({ folder: "books", displayClass: "book-grid", limit: 4 }) as any}
          {Component.GardenSection({ title: "Notes", folder: "blog", link: "/blog/", limit: 3 }) as any}
        </>
      )
    }) as any,

    // Standard page elements for non-home pages
    ((props: QuartzComponentProps) => {
      const slug = props.fileData.slug ?? ""
      const isHome = slug === "index" || slug === "" || slug === "/"
      if (isHome) return null
      
      const Title = Component.ArticleTitle()
      const Meta = Component.ContentMeta()
      const Tags = Component.TagList()

      return (
        <>
          {Title(props)}
          {Meta(props)}
          {Tags(props)}
        </>
      )
    }),
  ],
  left: [
    (props: QuartzComponentProps) => {
      const slug = (props.fileData.slug ?? "").toLowerCase()
      const isSwordsBeyond = slug.includes("swords-beyond") || slug.includes("swords beyond")

      if (!isSwordsBeyond) return null

      return (
        <div className="sidebar-content">
          <img
            src="https://superclark.net/static/swords-beyond-logo.png"
            alt="Swords Beyond Logo"
            style={{ width: "100%", height: "auto", marginBottom: "1rem", borderRadius: "4px" }}
          />
          <SidebarToc {...props} />
          <ChapterNext {...props} />
        </div>
      )
    },
  ], 
  right: [],
}

// 3. LIST PAGES (Tags / Folders / Protected Pages)
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
            src="https://superclark.net/static/swords-beyond-logo.png"
            alt="Swords Beyond Logo"
            style={{ width: "100%", height: "auto", marginBottom: "1rem", borderRadius: "4px" }}
          />
          <SidebarToc {...props} />
          <ChapterNext {...props} />
        </div>
      )
    }) as any,
  ],
  right: [],
}