import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzComponent, QuartzComponentProps } from "./quartz/components/types"

// 1. SHARED COMPONENTS
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

// Top-level component instantiations
const SidebarToc = Component.TableOfContents()
const ChapterList = Component.ChapterNavNext()

// 2. STANDARD NOTE & HOMEPAGE LAYOUT
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    // Homepage Grid (Direct Component Tree - Restored from working original)
    Component.Section({
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
                  limit: 3,
                }),
              ],
            }),
            Component.Section({
              className: "garden-col-right",
              children: [
                Component.GardenSection({
                  title: "Books",
                  folder: "media/books",
                  limit: 3,
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
                  limit: 3,
                }),
              ],
            }),
            Component.Section({
              className: "garden-col-right",
              children: [
                Component.GardenSection({
                  title: "Tech & Systems",
                  folder: "tech",
                  limit: 3,
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    // Standard Article Header Elements (Title, Meta, Tags)
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

// 3. LIST PAGES (Tags/Folders)
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