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
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    // Logic for Homepage Grid
    ((props: QuartzComponentProps) => {
      const slug = props.fileData.slug ?? ""
      const isHome = slug === "index" || slug === "" || slug === "/"
      
      if (!isHome) return null

      return Component.Section({ 
        className: "home-only-grid",
        children: [
          Component.Section({ className: "home-hero", title: "" }),
          
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
        ]
      })(props)
    }),
  
    // Logic for Standard Note Headers (Article Title, etc)
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

export default {
  sharedPageComponents,
  defaultContentPageLayout,
  defaultListPageLayout,
}