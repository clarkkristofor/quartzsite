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

  return (
    <div className={`garden-section-container ${customClass ?? ""}`}>
      <h2 className="garden-title">
        <a href={link} className="header-link">
          {title}
          <span className="header-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </span>
        </a>
      </h2>

      <div className="simple-list">
        {pages.map((page) => {
          // 1. Get the individual page description
          const pageDescription = page.frontmatter?.description as string | undefined
          const rawDate = page.frontmatter?.date

          // 2. Determine the icon based on THIS page's description
          const isRPG = (pageDescription?.toLowerCase()?.includes("shadows") || pageDescription?.toLowerCase()?.includes("redstone") || pageDescription?.toLowerCase()?.includes("playtest")) ?? false

          const icon = isMusic ? (
            /* Music Icon */
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="list-icon">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          ) : isRPG ? (
            /* Dices Icon */
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dices-icon lucide-dices"><rect width="12" height="12" x="2" y="10" rx="2" ry="2"/><path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6"/><path d="M6 18h.01"/><path d="M10 14h.01"/><path d="M15 6h.01"/><path d="M18 9h.01"/></svg>
          ) : (
            /* Default Notes Icon */
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="list-icon">
              <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>
            </svg>
          )

          return (
            <a key={page.slug} href={`/${page.slug}`} className="grid-card list-item-card">
              <div className="card-icon-wrapper">{icon}</div>
              <div className="card-content">
                <h3>{(page.frontmatter?.title as string) ?? page.name}</h3>
                <div className="card-metadata">
                  {pageDescription && <span className="card-desc">{pageDescription}</span>}
                  {pageDescription && rawDate && <span className="meta-separator"> • </span>}
                  {rawDate && <span className="card-date">{new Date(rawDate).toLocaleDateString()}</span>}
                </div>
                {!isMusic && page.text && (
                  <div className="card-snippet">
                    <p>{page.text.length > 100 ? page.text.substring(0, 100) + "..." : page.text}</p>
                  </div>
                )}
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default SimpleList