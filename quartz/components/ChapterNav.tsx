import { QuartzComponent, QuartzComponentProps } from "./types"
import { resolveRelative, SimpleSlug } from "../util/path"

export const ChapterNavPrev = (): QuartzComponent => {
  const ChapterNavPrevComponent: QuartzComponent = (props: QuartzComponentProps) => {
    const frontmatter = props.fileData.frontmatter
    if (!frontmatter || !frontmatter.prev) return null

    const prev = frontmatter.prev as string

    return (
      <div className="chapter-nav-prev" style={{ marginBottom: "1rem" }}>
        <a 
          href={resolveRelative(props.fileData.slug!, prev.replace(/[\[\]]/g, "") as SimpleSlug)}
          style={{ fontWeight: "bold", textDecoration: "none" }}
        >
          ← Previous: {prev.replace(/[\[\]]/g, "")}
        </a>
      </div>
    )
  }
  return ChapterNavPrevComponent
}

export const ChapterNavNext = (): QuartzComponent => {
  const ChapterNavNextComponent: QuartzComponent = (props: QuartzComponentProps) => {
    const frontmatter = props.fileData.frontmatter
    if (!frontmatter || !frontmatter.next) return null

    const next = frontmatter.next as string

    return (
      <div className="chapter-nav-next" style={{ marginTop: "1rem" }}>
        <a 
          href={resolveRelative(props.fileData.slug!, next.replace(/[\[\]]/g, "") as SimpleSlug)}
          style={{ fontWeight: "bold", textDecoration: "none" }}
        >
          Next: {next.replace(/[\[\]]/g, "")} →
        </a>
      </div>
    )
  }
  return ChapterNavNextComponent
}