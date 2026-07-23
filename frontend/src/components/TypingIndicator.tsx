import React from 'react'

interface TypingIndicatorProps {
  text?: string
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ text = 'Analyzing' }) => {
  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
      <span className="typing-text">{text}...</span>

      <style>{`
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: var(--bg-tertiary);
          border-radius: 12px;
          border: 1px solid var(--border);
          max-width: fit-content;
        }
        .typing-dots {
          display: flex;
          gap: 4px;
        }
        .dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          /* typing dots timing: 1.2s ease-in-out infinite, delay index * 0.2s
             (uses the shared global "bounce" keyframe defined in index.css) */
          animation: bounce 1.2s ease-in-out infinite;
        }
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        .typing-text {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  )
}

export default TypingIndicator

