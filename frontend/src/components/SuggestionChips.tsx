import React from 'react'

interface SuggestionChipsProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
}

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ suggestions, onSelect }) => {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="suggestion-chips">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="chip"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </button>
      ))}

      <style>{`
        .suggestion-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 8px 0;
        }
        .chip {
          display: inline-flex;
          align-items: center;
          padding: 6px 14px;
          background: rgba(29, 78, 216, 0.1);
          border: 1px solid rgba(29, 78, 216, 0.3);
          border-radius: 20px;
          color: var(--primary-light);
          font-size: 0.8rem;
          cursor: pointer;
          /* suggestion chip hover transition: all 0.15s */
          transition: all 0.15s;
          font-family: inherit;
        }
        .chip:hover {
          /* suggestion chips invert color on hover: background #0B2D9F, text -> white */
          background: #0B2D9F;
          border-color: #0B2D9F;
          color: #ffffff;
          transform: translateY(-1px);
        }
        .chip:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}

export default SuggestionChips

