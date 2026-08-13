import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzComponent, QuartzComponentProps } from "./quartz/components/types"

// 1. Shared header and footer components across all pages
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

// Instantiate sidebar helpers
const SidebarToc = Component.TableOfContents()
const ChapterNext = Component.ChapterNavNext()

// Home grid component with isHome safeguard to prevent it rendering on standard notes
const HomeGrids: QuartzComponent = (props: QuartzComponentProps) => {
  // DEBUG: This will print every single page slug to your terminal during build
  console.log("PAGE SLUG CHECK ->", JSON.stringify(props.fileData.slug))

  const slug = (props.fileData.slug ?? "").toLowerCase()
  const isHome = slug === "" || slug === "index" || slug === "index.md" || slug === "/"

  if (!isHome) return null

  return (
    <>
      {Component.RPGgrid({ maxDisplay: 2 }) as any}
      {Component.GardenSection({ title: "Music", folder: "music", link: "/music/", limit: 3 }) as any}
      {Component.BookGrid({ folder: "books", displayClass: "book-grid", limit: 4 }) as any}
      {Component.GardenSection({ title: "Notes", folder: "blog", link: "/blog/", limit: 3 }) as any}
    </>
  )
}

// 2. STANDARD NOTE & HOMEPAGE LAYOUT (2-Column Grid: Main + Right Sidebar)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    HomeGrids as any,
  ],
  left: [], // Kept as an empty array to satisfy TypeScript's PageLayout interface
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