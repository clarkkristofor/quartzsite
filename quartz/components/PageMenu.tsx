import { QuartzComponent } from "./types"

const PageMenu: QuartzComponent = () => {
  
  return (
        <div className="custom-dropdown">
          <svg width="0" height="0" style="display: block;">
            <defs>
              <linearGradient id="flame-gradient" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#cc0000" /> <stop offset="45%" stop-color="#e53935" />
                <stop offset="100%" stop-color="#ffcc00" /> </linearGradient>
            </defs>
          </svg>

          <button className="dropdown-button" aria-label="Menu">
            <span className="menu-label">Menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
          </button>

          <div className="dropdown-content">
            <a href="/rpgs/" className="nav-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/></svg>
              <span className="nav-label">RPGs</span>
            </a>
            <a href="/rpgs/session_notes/" className="nav-item">
              <svg width="24" height="24" viewBox="0 0 24 24"><path d="M8 2v4"/><path d="M12 2v4"/><path d="M16 2v4"/><rect width="16" height="18" x="4" y="4" rx="2"/><path d="M8 10h6"/><path d="M8 14h8"/><path d="M8 18h5"/></svg>
              <span className="nav-label">Session notes</span>
               </a>
            <a href="/music/" className="nav-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              <span className="nav-label">Music</span>
            </a>
            <a href="/books/" className="nav-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>
              <span className="nav-label">Books</span>
            </a>
            <a href="/blog/" className="nav-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/></svg>
              <span className="nav-label">Notes</span>
            </a>
          </div>
        </div>
  )
}


export default () => PageMenu