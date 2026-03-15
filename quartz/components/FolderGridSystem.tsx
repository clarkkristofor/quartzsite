import { QuartzComponent, QuartzComponentProps } from "./types"
import * as Component from "."

const FolderGridSystem: QuartzComponent = (props: QuartzComponentProps) => {
  const slug = (props.fileData.slug ?? "").replace(/\/index$/, "")
  
  if (slug === "books") {
    // Get the Component Definitions from the constructors
    const ReadGrid = Component.BookGrid({ 
      title: "Read", 
      folder: "books", 
      displayClass: "book-grid",
      limit: 99999
    })
    const RecsGrid = Component.GenericGrid({ 
      title: "Reading List & Recommendations", 
      folder: "books", 
      displayClass: "book-grid"
    })

    // Use JSX syntax to execute the components
    return (
      <>
        <ReadGrid {...props} />
        <RecsGrid {...props} />
      </>
    )
  }

  // Default for other folders
  const DefaultGrid = Component.GenericGrid({ displayClass: "rpg-grid" })
  return <DefaultGrid {...props} />
}

export default () => FolderGridSystem