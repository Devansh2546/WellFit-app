import React from 'react'
import type { SuggestionItem } from '../data/searchCatalog'

interface Props {
  query: string
  suggestions: SuggestionItem[]
  selectedIndex: number
  onSelect: (item: SuggestionItem) => void
  onViewAll: (query: string) => void
  isLoading?: boolean
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.trim().toLowerCase() ? (
          <mark key={i} className="search-suggestion-mark">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}

function getIconForType(type: SuggestionItem['type']) {
  switch (type) {
    case 'exercise':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 5v14M18 5v14M2 9v6M22 9v6M6 12h12" />
        </svg>
      )
    case 'tool':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="16" y1="14" x2="16" y2="18" />
          <path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01" />
        </svg>
      )
    case 'recipe':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      )
    case 'article':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    case 'category':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      )
  }
}

function getTypeBadge(type: SuggestionItem['type']) {
  switch (type) {
    case 'exercise':
      return { label: 'Exercise', className: 'badge-exercise' }
    case 'tool':
      return { label: 'Tool', className: 'badge-tool' }
    case 'recipe':
      return { label: 'Recipe', className: 'badge-recipe' }
    case 'article':
      return { label: 'Article', className: 'badge-article' }
    case 'category':
      return { label: 'Category', className: 'badge-category' }
  }
}

export const SearchSuggestionsDropdown: React.FC<Props> = ({
  query,
  suggestions,
  selectedIndex,
  onSelect,
  onViewAll,
  isLoading = false,
}) => {
  if (!query.trim()) return null

  return (
    <div className="search-suggestions-dropdown" role="listbox" id="search-suggestions-listbox">
      <div className="search-suggestions-header">
        <span className="search-suggestions-label">Suggestions</span>
        {isLoading && <span className="search-suggestions-spinner">Checking...</span>}
      </div>

      {suggestions.length > 0 ? (
        <ul className="search-suggestions-list">
          {suggestions.map((item, index) => {
            const isSelected = selectedIndex === index
            const badge = getTypeBadge(item.type)

            return (
              <li
                key={item.id}
                role="option"
                aria-selected={isSelected}
                className={`search-suggestion-item ${isSelected ? 'selected' : ''}`}
                onMouseDown={(e) => {
                  // onMouseDown fires before onBlur
                  e.preventDefault()
                  onSelect(item)
                }}
              >
                <div className={`search-suggestion-icon ${badge.className}`}>
                  {getIconForType(item.type)}
                </div>

                <div className="search-suggestion-info">
                  <div className="search-suggestion-title">
                    {highlightMatch(item.title, query)}
                  </div>
                  <div className="search-suggestion-subtitle">
                    {item.subtitle}
                  </div>
                </div>

                <span className={`search-suggestion-badge ${badge.className}`}>
                  {badge.label}
                </span>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="search-suggestions-empty">
          <span>No exact matches found for "<strong>{query}</strong>"</span>
          <span className="search-suggestions-empty-sub">Press Enter to search entire database</span>
        </div>
      )}

      {/* Footer link to view full search results page */}
      <div
        className={`search-suggestions-footer ${selectedIndex === suggestions.length ? 'selected' : ''}`}
        onMouseDown={(e) => {
          e.preventDefault()
          onViewAll(query)
        }}
      >
        <span className="search-suggestions-footer-text">
          See all results for "<strong>{query}</strong>"
        </span>
        <span className="search-suggestions-footer-arrow">→</span>
      </div>
    </div>
  )
}

export default SearchSuggestionsDropdown
