import Content from "./pages/Content"
import TagContent from "./pages/TagContent"
import FolderContent from "./pages/FolderContent"
import NotFound from "./pages/404"
import ArticleTitle from "./ArticleTitle"
import Darkmode from "./Darkmode"
import ReaderMode from "./ReaderMode"
import Head from "./Head"
import ContentMeta from "./ContentMeta"
import Spacer from "./Spacer"
import TableOfContents from "./TableOfContents"
import Explorer from "./Explorer"
import TagList from "./TagList"
import Graph from "./Graph"
import Backlinks from "./Backlinks"
import Search from "./Search"
import Footer from "./Footer"
import DesktopOnly from "./DesktopOnly"
import MobileOnly from "./MobileOnly"
import RecentNotes from "./RecentNotes"
import Breadcrumbs from "./Breadcrumbs"
import Comments from "./Comments"
import Flex from "./Flex"
import ConditionalRender from "./ConditionalRender"

export {
  ArticleTitle,
  Content,
  TagContent,
  FolderContent,
  Darkmode,
  ReaderMode,
  Head,
  ContentMeta,
  Spacer,
  TableOfContents,
  Explorer,
  TagList,
  Graph,
  Backlinks,
  Search,
  Footer,
  DesktopOnly,
  MobileOnly,
  RecentNotes,
  NotFound,
  Breadcrumbs,
  Comments,
  Flex,
  ConditionalRender,
}

export { default as FolderGrid } from "./FolderGrid"
export { default as Section } from "./Section"
export { default as SimpleList } from "./SimpleList"
export { default as GardenSection } from "./GardenSection"
export { default as PageTitle } from "./PageTitle"
export { default as PageLogo } from "./PageLogo"
export { default as PageMenu } from "./PageMenu"
export { default as BookGrid } from "./BookGrid"
export { default as RPGgrid } from "./RPGgrid" // Note the lowercase 'g' to match your filename
export { default as GenericGrid } from "./GenericGrid" 
export { default as FolderGridSystem } from "./FolderGridSystem"
// force rebuild
