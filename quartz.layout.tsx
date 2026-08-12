import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzComponentProps } from "./quartz/components/types"

// 1. SHARED COMPONENTS
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
    // Homepage Layout Logic
    ((props: QuartzComponentProps) => {
      const slug = props.fileData.slug ?? ""
      const isHome = slug === "index" || slug === "" || slug === "/"
      if (!isHome) return null

      return Component.Section({ 
        className: "home-only-grid",
        children: [
          Component.Section({ className: "home-hero", title: "" }),
          
          // UPPER GARDEN (Session Notes & RPG Grid)
          Component.Section({ 
            className: "garden-section upper",
            children: [
              Component.Section({
                className: "garden-col-left",
                children: [
                  Component.RPGgrid({ 
                    maxDisplay: 2
                  }) as any,
                ]
              }),
              Component.Section({
                className: "garden-col-right",
                children: [
                  Component.GardenSection({ 
                    title: "Music", 
                    folder: "music", 
                    link: "/music/", 
                    limit: 5 
                  }) as any,
                ]
              }),
            ]
          }),

          // LOWER GARDEN (Books & Music)
          Component.Section({ 
            className: "garden-section lower",
            children: [
              Component.Section({
                className: "garden-col-left",
                children: [
                  Component.GardenSection({ 
                    title: "Notes", 
                    folder: "blog", 
                    link: "/blog/", 
                    limit: 4
                  }) as any
                ]
              }),
              Component.Section({
                className: "garden-col-right",
                children: [
                  Component.BookGrid({ 
                    folder: "books", 
                    displayClass: "book-grid", 
                    limit: 6 
                  }) as any,
                ]
              }),
              
            ]
          }),
        ]
      })(props) // <-- Executing with (props) preserves full grid hierarchy!
    }),

    // Standard Note Headers (Non-Homepage)
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

      // Target only pages inside the Swords Beyond folder
      const isSwordsBeyond =
        slug.includes("swords-beyond") || slug.includes("swords beyond")

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
    },
  ],
  right: [],
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