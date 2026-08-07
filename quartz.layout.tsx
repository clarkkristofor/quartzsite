import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzComponent, QuartzComponentProps } from "./quartz/components/types"

// 1. SHARED COMPONENTS (Header & Footer)
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

// 2. TOP-LEVEL COMPONENT INSTANTIATIONS
const SidebarToc = Component.TableOfContents()
const ChapterList = Component.ChapterNavNext()

// Homepage Layout Construction
const HomeGrid = Component.Section({ 
  className: "home-only-grid",
  children: [
    Component.Section({ className: "home-hero", title: "" }),
    // UPPER GARDEN
    Component.Section({ 
      className: "garden-section upper",
      children: [
        Component.Section({
          className: "garden-col-left",
          children: [
            Component.GardenSection({ 
              title: "Session notes", 
              folder: "rpgs/session_notes", 
              limit: 3 
            }),
          ],
        }),
        Component.Section({
          className: "garden-col-right",
          children: [
            Component.GardenSection({ 
              title: "Books", 
              folder: "media/books", 
              limit: 3 
            }),
          ],
        }),
      ],
    }),
    // LOWER GARDEN
    Component.Section({ 
      className: "garden-section lower",
      children: [
        Component.Section({
          className: "garden-col-left",
          children: [
            Component.GardenSection({ 
              title: "Audio", 
              folder: "media/audio", 
              limit: 3 
            }),
          ],
        }),
        Component.Section({
          className: "garden-col-right",
          children: [
            Component.GardenSection({ 
              title: "Tech & Systems", 
              folder: "tech", 
              limit: 3 
            }),
          ],
        }),
      ],
    }),
  ],
})

// 3. STANDARD NOTE & HOMEPAGE LAYOUT
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    // Homepage Logic - Properly executes HomeGrid(props)
    ((props: QuartzComponentProps) => {
      const slug = props.fileData.slug ?? ""
      const isHome = slug === "index" || slug === "" || slug === "/"
      if (!isHome) return null

      return HomeGrid(props)
    }) as unknown as QuartzComponent,

    // Non-homepage article header elements
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
    }) as unknown as QuartzComponent,
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
          {/* Order 1: Table of Contents */}
          <SidebarToc {...props} />
          {/* Order 2: Chapter Navigation List */}
          <ChapterList {...props} />
        </div>
      )
    },
  ],
  right: [],
}

// 4. LIST PAGES (Tags/Folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.FolderGridSystem(),
  ],
  left: [
    (props: QuartzComponentProps) => {
      const slug = (props.fileData.slug ?? "").toLowerCase()
      const isSwordsBeyond =
        slug.includes("swords-beyond") || slug.includes("swords beyond")

      if (!isSwordsBeyond) return null

      return (
        <div className="sidebar-content">
          {/* Order 1: Table of Contents */}
          <SidebarToc {...props} />
          {/* Order 2: Chapter Navigation List */}
          <ChapterList {...props} />
        </div>
      )
    },
  ],
  right: [],
}