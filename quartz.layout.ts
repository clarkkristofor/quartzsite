import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.PageMenu(),
    Component.PageLogo(),
    Component.Search(),
    // Component.Darkmode(),
  ],
  afterBody: [
    
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// 2. STANDARD NOTE LAYOUT
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    // 1. THE GRID (Only for Home)
    ((props) => {
      const slug = props.fileData.slug ?? ""
      const isHome = slug === "index" || slug === "" || slug === "/"
      
      if (!isHome) return null

      return Component.Section({ 
        className: "home-only-grid",
        children: [
          Component.Section({ className: "home-hero", title: "" }),
          
          // UPPER GARDEN (RPG Focus)
          Component.Section({ 
            className: "garden-section upper",
            children: [
              Component.Section({
                className: "garden-col-left",
                children: [
                  Component.GardenSection({ 
                    title: "Urban Shadows QC", folder: "rpgs/UrbanShadowsQC", link: "/rpgs/UrbanShadowsQC/", limit: 5 
                  })
                ]
              }),
              Component.Section({
                className: "garden-col-right",
                children: [
                  Component.RPGgrid({ folder: "rpgs", displayClass: "rpg-grid", limit: 4 }),
                ]
              }),
            ]
          }),

          // LOWER GARDEN (Book Focus)
          Component.Section({ 
            className: "garden-section lower",
            children: [
              Component.Section({
                className: "garden-col-left",
                children: [
                  Component.BookGrid({ folder: "books", displayClass: "book-grid", limit: 6 }),
                ]
              }),
              Component.Section({
                className: "garden-col-right",
                children: [
                  Component.GardenSection({ 
                    title: "Music", folder: "music", link: "/music/", limit: 5 
                  }),
                ]
              }),
            ]
          }),
        ]
      })(props)
    }),
  
    // 2. STANDARD CONTENT (Only for Notes)
    ((props) => {
      const slug = props.fileData.slug ?? ""
      const isHome = slug === "index" || slug === "" || slug === "/"
      if (isHome) return null
      
      const Title = Component.ArticleTitle()
      const Meta = Component.ContentMeta()
      const Tags = Component.TagList()

      return [
        Title(props),
        Meta(props),
        Tags(props),
      ]
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
    ((props) => {
      // 1. Normalize the slug to catch both "books" and "books/index"
      const slug = (props.fileData.slug ?? "").replace(/\/index$/, "")
      const isBookFolder = slug === "books"

      if (isBookFolder) {
        return [
          Component.BookGrid({ 
            title: "Read", 
            folder: "books", 
            displayClass: "book-grid",
            limit: 99999
          })(props),

          Component.GenericGrid({ 
            title: "Reading List & Recommendations", 
            folder: "books", 
            displayClass: "book-grid"
          })(props),
        ]
      }

      // Default behavior for other folders (RPGs, etc.)
      return Component.GenericGrid({ 
        displayClass: "rpg-grid" 
      })(props)
    }),
  ],
  left: [],
  right: [],
}

// Simplified exports - No mapPageLayout needed
export default {
  sharedPageComponents,
  defaultContentPageLayout,
  defaultListPageLayout,
}
