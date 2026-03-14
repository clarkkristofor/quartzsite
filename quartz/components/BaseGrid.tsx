interface BaseGridProps {
  pages: any[]
  title?: string   // Now optional
  link?: string    // Now optional
  customClass?: string
}

// Inside BaseGrid.tsx
const BaseGrid = ({ pages, title, link, customClass }: BaseGridProps) => {
  if (pages.length === 0) return null

  return (
    <div className={`garden-section-container ${customClass ?? ""}`}>
      {/* Revised Header Logic */}
      {title && (
        <h2 className="garden-title">
          {link ? (
            /* If link exists, make it clickable with the arrow */
            <a href={link} className="header-link">
              {title}
              <span className="header-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </a>
          ) : (
            /* If no link, just render the text (prevents redundant internal links) */
            <span className="header-text-only">{title}</span>
          )}
        </h2>
      )}

      <div className="folder-grid">
        {pages.map((page) => {
          const externalLink = (page.frontmatter?.link || page.frontmatter?.url) as string | undefined
          const targetLink = (externalLink ?? `/${page.slug}`).toString()
          
          let imageUrl = page.frontmatter?.image as string | undefined
          if (imageUrl && !imageUrl.startsWith("http")) {
            imageUrl = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`
          }

          return (
            <a 
              href={targetLink} 
              className="grid-card" 
              key={page.slug}
              target={targetLink.startsWith("http") ? "_blank" : "_self"}
              rel={targetLink.startsWith("http") ? "noopener noreferrer" : ""}
            >
              {imageUrl && <div className="card-image"><img src={imageUrl} alt="" /></div>}
              <div className="card-content">
                <h3>{page.frontmatter?.title ?? (page.slug?.split('/').pop() || "Untitled")}</h3>
                
                {page.frontmatter?.authors ? (
                  <p className="card-author">
                    {Array.isArray(page.frontmatter.authors) 
                      ? page.frontmatter.authors.join(", ") 
                      : (page.frontmatter.authors as string)}
                  </p>
                ) : (
                  <p>{(page.frontmatter?.description as string) ?? "Unknown"}</p>
                )}
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default BaseGrid