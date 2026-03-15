import { QuartzComponentProps } from "./types"

interface SimpleListProps extends Partial<QuartzComponentProps> {
  pages: any[]
  title: string
  link: string
  isMusic: boolean
  customClass?: string
}

const SimpleList = ({ pages, title, link, isMusic, customClass }: SimpleListProps) => {
  if (pages.length === 0) return null

  const icon = isMusic ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="list-icon"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="list-icon"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 1 0 10 10"/></svg>
  )

  return (
    <div className={`garden-section-container ${customClass ?? ""}`}>
      <h2 className="garden-title">
        <a href={link} className="header-link">
          {title}
          <span className="header-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
      </h2>

      <div className="simple-list">
        {pages.map((page) => {
          const description = page.frontmatter?.description as string | undefined
          const rawDate = page.frontmatter?.date
          
          return (
            <a key={page.slug} href={`/${page.slug}`} className="grid-card list-item-card">
              <div className="card-icon-wrapper">{icon}</div>
              <div className="card-content">
                <h3>{(page.frontmatter?.title as string) ?? page.name}</h3>
                <div className="card-metadata">
                  {description && <span className="card-desc">{description}</span>}
                  {description && rawDate && <span className="meta-separator"> • </span>}
                  {rawDate && <span className="card-date">{new Date(rawDate).toLocaleDateString()}</span>}
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default SimpleList