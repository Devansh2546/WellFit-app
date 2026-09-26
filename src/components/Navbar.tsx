import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import SearchSuggestionsDropdown from './SearchSuggestionsDropdown'
import { getLocalSuggestions, fetchSearchSuggestions, type SuggestionItem } from '../data/searchCatalog'
import '../assets/CSS/Navbar.css'

function Navbar() {
  const { user, signOut } = useAuth()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isSearchingAsync, setIsSearchingAsync] = useState(false)
  const desktopSearchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const toolsDropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Initialize and sync theme state with DOM / system preference
  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme')
    if (current === 'dark' || current === 'light') {
      setTheme(current)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('wellfit-theme')) {
        const next = e.matches ? 'dark' : 'light'
        document.documentElement.setAttribute('data-theme', next)
        document.documentElement.style.colorScheme = next
        setTheme(next)
      }
    }
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  // Close menus & suggestions on navigation
  useEffect(() => {
    setMobileMenuOpen(false)
    setToolsOpen(false)
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }, [location.pathname, location.search])

  // Close menus & suggestions on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        setToolsOpen(false)
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(target)) {
        setToolsOpen(false)
      }
      const inDesktop = desktopSearchRef.current && desktopSearchRef.current.contains(target)
      const inMobile = mobileSearchRef.current && mobileSearchRef.current.contains(target)
      if (!inDesktop && !inMobile) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toolsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleToolsMouseEnter = () => {
    if (toolsTimeoutRef.current) {
      clearTimeout(toolsTimeoutRef.current)
      toolsTimeoutRef.current = null
    }
    setToolsOpen(true)
  }

  const handleToolsMouseLeave = () => {
    toolsTimeoutRef.current = setTimeout(() => {
      setToolsOpen(false)
    }, 220)
  }

  useEffect(() => {
    return () => {
      if (toolsTimeoutRef.current) clearTimeout(toolsTimeoutRef.current)
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
  }, [])

  const handleToolNavigation = (e: React.MouseEvent, path: string) => {
    // Normal left-click without modifier keys triggers programmatic navigation
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault()
      e.stopPropagation()
      setToolsOpen(false)
      navigate(path)
    } else {
      setToolsOpen(false)
    }
  }

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    document.documentElement.style.colorScheme = next
    localStorage.setItem('wellfit-theme', next)
  }

  const handleQueryChange = (val: string) => {
    setQuery(val)
    setSelectedIndex(-1)

    if (!val.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
      return
    }

    // 1. Instant local matching (0ms latency, e.g. "ben" -> "Bench Press")
    const instant = getLocalSuggestions(val, 7)
    setSuggestions(instant)
    setShowSuggestions(true)

    // 2. Debounced background Supabase query
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(async () => {
      setIsSearchingAsync(true)
      try {
        const enriched = await fetchSearchSuggestions(val, 7)
        setSuggestions(enriched)
      } finally {
        setIsSearchingAsync(false)
      }
    }, 180)
  }

  const handleSelectSuggestion = (item: SuggestionItem) => {
    setShowSuggestions(false)
    setQuery('')
    setMobileMenuOpen(false)
    navigate(item.url)
  }

  const handleViewAll = (searchTerm: string) => {
    if (searchTerm.trim()) {
      setShowSuggestions(false)
      setMobileMenuOpen(false)
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions && query.trim()) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setShowSuggestions(true)
        return
      }
    }

    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length ? prev + 1 : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : suggestions.length))
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault()
          handleSelectSuggestion(suggestions[selectedIndex])
        } else if (selectedIndex === suggestions.length) {
          e.preventDefault()
          handleViewAll(query)
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[selectedIndex])
      } else {
        handleViewAll(query)
      }
    }
  }

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const isToolsTabActive = (tab?: string) => {
    if (location.pathname !== '/tools') return false
    const params = new URLSearchParams(location.search)
    const currentTab = params.get('tab')
    if (!tab) return !currentTab || currentTab === 'all'
    return currentTab === tab
  }

  const isToolsActive = location.pathname.startsWith('/tools')

  return (
    <header className="navbar-header">
      <nav className="navbar" aria-label="Main Navigation">
        <div className="navbar-inner container">
          {/* Brand Logo - Crisp adaptive vector/PNG logo with zero flash CSS switching */}
          <Link to="/" className="navbar-logo" aria-label="WellFit Home">
            <img
              src="/logo.png"
              alt="WellFit"
              className="navbar-logo-img navbar-logo-light"
            />
            <img
              src="/logo_dark.png"
              alt="WellFit"
              className="navbar-logo-img navbar-logo-dark"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="navbar-links">
            <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
            <Link to="/workouts" className={isActive('/workouts') ? 'active' : ''}>Workouts</Link>
            <Link to="/progress" className={isActive('/progress') ? 'active' : ''}>Progress</Link>
            <Link to="/articles" className={isActive('/articles') ? 'active' : ''}>Articles</Link>
            <Link to="/recipes" className={isActive('/recipes') ? 'active' : ''}>Recipes</Link>

            {/* Tools Dropdown */}
            <div
              className="navbar-dropdown-wrapper"
              ref={toolsDropdownRef}
              onMouseEnter={handleToolsMouseEnter}
              onMouseLeave={handleToolsMouseLeave}
            >
              <button
                type="button"
                className={`navbar-dropdown-trigger ${isToolsActive ? 'active' : ''}`}
                onClick={() => setToolsOpen((prev) => !prev)}
                aria-expanded={toolsOpen}
                aria-haspopup="true"
                aria-label="Fitness tools menu"
              >
                <span>Tools</span>
                <svg
                  className={`navbar-dropdown-chevron ${toolsOpen ? 'rotated' : ''}`}
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <div
                className={`navbar-dropdown-menu ${toolsOpen ? 'open' : ''}`}
                role="menu"
                onMouseEnter={handleToolsMouseEnter}
                onMouseLeave={handleToolsMouseLeave}
              >
                <Link
                  to="/tools"
                  className={`navbar-dropdown-item ${isToolsTabActive() ? 'active' : ''}`}
                  onClick={(e) => handleToolNavigation(e, '/tools')}
                  role="menuitem"
                >
                  <div className="navbar-dropdown-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="14" width="7" height="7" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                  </div>
                  <div className="navbar-dropdown-item-content">
                    <span className="navbar-dropdown-item-title">All Fitness Tools</span>
                    <span className="navbar-dropdown-item-desc">Browse all calculators & athletic tools</span>
                  </div>
                </Link>

                <Link
                  to="/tools?tab=bmi"
                  className={`navbar-dropdown-item ${isToolsTabActive('bmi') ? 'active' : ''}`}
                  onClick={(e) => handleToolNavigation(e, '/tools?tab=bmi')}
                  role="menuitem"
                >
                  <div className="navbar-dropdown-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div className="navbar-dropdown-item-content">
                    <span className="navbar-dropdown-item-title">BMI Calculator</span>
                    <span className="navbar-dropdown-item-desc">Body mass index & health metric tracking</span>
                  </div>
                </Link>

                <Link
                  to="/tools?tab=1rm"
                  className={`navbar-dropdown-item ${isToolsTabActive('1rm') ? 'active' : ''}`}
                  onClick={(e) => handleToolNavigation(e, '/tools?tab=1rm')}
                  role="menuitem"
                >
                  <div className="navbar-dropdown-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 5v14M18 5v14M2 9v6M22 9v6M6 12h12" />
                    </svg>
                  </div>
                  <div className="navbar-dropdown-item-content">
                    <span className="navbar-dropdown-item-title">1RM Calculator</span>
                    <span className="navbar-dropdown-item-desc">One-rep maximum & percentage targets</span>
                  </div>
                </Link>

                <Link
                  to="/tools?tab=macro"
                  className={`navbar-dropdown-item ${isToolsTabActive('macro') ? 'active' : ''}`}
                  onClick={(e) => handleToolNavigation(e, '/tools?tab=macro')}
                  role="menuitem"
                >
                  <div className="navbar-dropdown-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a10 10 0 0 1 10 10H12V2z" />
                    </svg>
                  </div>
                  <div className="navbar-dropdown-item-content">
                    <span className="navbar-dropdown-item-title">Macro Calculator</span>
                    <span className="navbar-dropdown-item-desc">Daily calorie targets & macro splits</span>
                  </div>
                </Link>

                <Link
                  to="/tools?tab=calorie"
                  className={`navbar-dropdown-item ${isToolsTabActive('calorie') ? 'active' : ''}`}
                  onClick={(e) => handleToolNavigation(e, '/tools?tab=calorie')}
                  role="menuitem"
                >
                  <div className="navbar-dropdown-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2c1.5 3 4 5 4 9a6 6 0 0 1-12 0c0-4 2.5-6 4-9 1 2 2 3 4 3s3-1 4-3z" />
                    </svg>
                  </div>
                  <div className="navbar-dropdown-item-content">
                    <span className="navbar-dropdown-item-title">Calorie Calculator</span>
                    <span className="navbar-dropdown-item-desc">TDEE, BMR & calorie cycling schedules</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="navbar-search" role="search">
            <div className="navbar-search-wrapper" ref={desktopSearchRef}>
              <svg className="navbar-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                placeholder="Search workouts, recipes..."
                aria-label="Search"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onFocus={() => {
                  if (query.trim()) {
                    setShowSuggestions(true)
                    if (suggestions.length === 0) {
                      handleQueryChange(query)
                    }
                  }
                }}
                onKeyDown={handleSearchKeyDown}
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  className="navbar-search-clear"
                  onClick={() => {
                    setQuery('')
                    setSuggestions([])
                    setShowSuggestions(false)
                  }}
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}

              {showSuggestions && query.trim() && (
                <SearchSuggestionsDropdown
                  query={query}
                  suggestions={suggestions}
                  selectedIndex={selectedIndex}
                  onSelect={handleSelectSuggestion}
                  onViewAll={handleViewAll}
                  isLoading={isSearchingAsync}
                />
              )}
            </div>
          </form>

          {/* Right Controls: Theme Toggle + Auth Buttons */}
          <div className="navbar-actions">
            <button
              type="button"
              className="navbar-theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                /* Sun Icon */
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4.5" fill="currentColor" />
                  <line x1="12" y1="1" x2="12" y2="3.5" />
                  <line x1="12" y1="20.5" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.98" y2="5.98" />
                  <line x1="18.02" y1="18.02" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3.5" y2="12" />
                  <line x1="20.5" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.98" y2="18.02" />
                  <line x1="18.02" y1="5.98" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                /* Moon Icon */
                <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            <div className="navbar-auth">
              {user ? (
                <>
                  <Link to="/profile" className="btn secondary navbar-btn-sm">Profile</Link>
                  <button onClick={signOut} className="btn secondary navbar-btn-sm">Log Out</button>
                </>
              ) : (
                <Link to="/login" className="btn navbar-btn-sm">Log In</Link>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`navbar-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="navbar-mobile-content">
            <form onSubmit={handleSearch} className="navbar-mobile-search">
              <div className="navbar-mobile-search-wrap" ref={mobileSearchRef}>
                <div className="navbar-mobile-search-input-row">
                  <input
                    type="search"
                    placeholder="Search workouts, recipes..."
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    onFocus={() => {
                      if (query.trim()) {
                        setShowSuggestions(true)
                        if (suggestions.length === 0) {
                          handleQueryChange(query)
                        }
                      }
                    }}
                    onKeyDown={handleSearchKeyDown}
                    autoComplete="off"
                  />
                  <button type="submit" className="btn">Search</button>
                </div>
                {showSuggestions && query.trim() && (
                  <SearchSuggestionsDropdown
                    query={query}
                    suggestions={suggestions}
                    selectedIndex={selectedIndex}
                    onSelect={handleSelectSuggestion}
                    onViewAll={handleViewAll}
                    isLoading={isSearchingAsync}
                  />
                )}
              </div>
            </form>

            <div className="navbar-mobile-links">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/workouts" onClick={() => setMobileMenuOpen(false)}>Workouts</Link>
              <Link to="/progress" onClick={() => setMobileMenuOpen(false)}>Progress</Link>
              <Link to="/articles" onClick={() => setMobileMenuOpen(false)}>Articles</Link>
              <Link to="/recipes" onClick={() => setMobileMenuOpen(false)}>Recipes</Link>

              {/* Tools Section in Mobile Drawer */}
              <div className="navbar-mobile-tools-group">
                <div className="navbar-mobile-tools-label">Tools</div>
                <div className="navbar-mobile-tools-sublinks">
                  <Link
                    to="/tools"
                    className={`navbar-mobile-sublink ${isToolsTabActive() ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="14" width="7" height="7" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                    <span>All Tools Overview</span>
                  </Link>
                  <Link
                    to="/tools?tab=bmi"
                    className={`navbar-mobile-sublink ${isToolsTabActive('bmi') ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    <span>BMI Calculator</span>
                  </Link>
                  <Link
                    to="/tools?tab=1rm"
                    className={`navbar-mobile-sublink ${isToolsTabActive('1rm') ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 5v14M18 5v14M2 9v6M22 9v6M6 12h12" />
                    </svg>
                    <span>1RM Calculator</span>
                  </Link>
                  <Link
                    to="/tools?tab=macro"
                    className={`navbar-mobile-sublink ${isToolsTabActive('macro') ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a10 10 0 0 1 10 10H12V2z" />
                    </svg>
                    <span>Macro Calculator</span>
                  </Link>
                  <Link
                    to="/tools?tab=calorie"
                    className={`navbar-mobile-sublink ${isToolsTabActive('calorie') ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2c1.5 3 4 5 4 9a6 6 0 0 1-12 0c0-4 2.5-6 4-9 1 2 2 3 4 3s3-1 4-3z" />
                    </svg>
                    <span>Calorie Calculator</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="navbar-mobile-auth">
              {user ? (
                <>
                  <Link to="/profile" className="btn secondary" onClick={() => setMobileMenuOpen(false)}>Your Profile</Link>
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="btn secondary">Log Out</button>
                </>
              ) : (
                <Link to="/login" className="btn" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
