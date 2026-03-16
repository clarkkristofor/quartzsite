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

// 2. STANDARD NOTE & HOMEPAGE LAYOUT
// 2. STANDARD NOTE & HOMEPAGE LAYOUT
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    // Homepage Logic - Explicitly typed to stop Error 7006
    ((props: QuartzComponentProps) => {
      const slug = props.fileData.slug ?? ""
      const isHome = slug === "index" || slug === "" || slug === "/"
      if (!isHome) return null

      return Component.Section({ 
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
                    title: "QC Shadows", 
                    folder: "rpgs/UrbanShadowsQC", 
                    link: "/rpgs/UrbanShadowsQC/", 
                    limit: 5 
                  }) as any
                ]
              }),
              Component.Section({
                className: "garden-col-right",
                children: [
                  Component.RPGgrid({ 
                    folder: "rpgs", 
                    displayClass: "rpg-grid", 
                    limit: 4 
                  }) as any,
                ]
              }),
            ]
          }),
          // LOWER GARDEN
          Component.Section({ 
            className: "garden-section lower",
            children: [
              Component.Section({
                className: "garden-col-left",
                children: [
                  Component.BookGrid({ 
                    folder: "books", 
                    displayClass: "book-grid", 
                    limit: 6 
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
          Component.Section({
            className: "blog-section",
            children: [
                  Component.GardenSection({ 
                    title: "Notes", 
                    folder: "blog", 
                    link: "/blog/", 
                    limit: 4
                  }) as any
                ]
          }),
        ]
      })(props)
    }), // <-- CHECK: This must have a comma and the closing bracket
  
    // Standard Note Headers
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
  left: [],
  right: [],
}

// 3. LIST PAGES (Tags/Folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.FolderGridSystem(),
  ],
  left: [],
  right: [],
}