import React, { useState, useRef, useEffect, useCallback } from 'react'
import RiskGauge from './components/RiskGauge'
import TypingIndicator from './components/TypingIndicator'
import SuggestionChips from './components/SuggestionChips'
import ReportTabs from './components/ReportTabs'
import type {
  AnalysisMode,
  TabView,
  ChatMessage,
  ChangeImpactResponse,
  AssistantResponse,
  ChangeType,
} from './types'
import {
  assistantRespond,
  analyzeChangeImpact,
  getChangeTypes,
  checkHealth,
} from './services/api'
import { markdownish, truncateSmart } from './utils/markdown'

// Icons as inline SVGs
const IconBot = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" />
  </svg>
)

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)

const IconZap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
)

const IconMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

// Send button idle state: rocket icon
const IconRocket = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
)

// Send button busy state: hourglass icon
const IconHourglass = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 22h14M5 2h14M5 2v5.5a5.5 5.5 0 0 0 5.5 5.5v0A5.5 5.5 0 0 1 16 18.5V22M19 22v-3.5a5.5 5.5 0 0 0-5.5-5.5v0A5.5 5.5 0 0 1 8 7.5V2" />
  </svg>
)

interface FormData {
  changeTitle: string
  targetComponent: string
  changeType: string
  fromVersion: string
  toVersion: string
  environment: string
  requestedBy: string
  changeWindow: string
  changeDescription: string
  priority: string
}

const defaultFormData: FormData = {
  changeTitle: '',
  targetComponent: '',
  changeType: 'enhancement',
  fromVersion: '',
  toVersion: '',
  environment: 'production',
  requestedBy: '',
  changeWindow: '',
  changeDescription: '',
  priority: 'medium',
}

interface QuickExample {
  label: string
  data: Partial<FormData>
}

const quickExamples: QuickExample[] = [
  {
    label: 'Database Upgrade',
    data: {
      changeTitle: 'Payment Gateway Database Pool Upgrade',
      targetComponent: 'payment-gateway',
      changeType: 'infrastructure',
      fromVersion: '50 connections',
      toVersion: '200 connections',
      requestedBy: 'team-payments',
      changeWindow: '2026-07-26 02:00 UTC',
      changeDescription: 'Increase the production database connection pool from 50 to 200 to handle peak checkout load.',
    },
  },
  {
    label: 'Kafka / Queue Scaling',
    data: {
      changeTitle: 'Order Service Kafka Consumer Scaling',
      targetComponent: 'order-service',
      changeType: 'infrastructure',
      fromVersion: '4 partitions',
      toVersion: '16 partitions',
      requestedBy: 'team-orders',
      changeWindow: '2026-07-27 22:00 UTC',
      changeDescription: 'Scale the order-service Kafka consumer group to reduce lag during peak order volume.',
    },
  },
  {
    label: 'API Contract Change',
    data: {
      changeTitle: 'Checkout Service API Versioning Update',
      targetComponent: 'checkout-service',
      changeType: 'enhancement',
      fromVersion: 'v1',
      toVersion: 'v2',
      requestedBy: 'team-checkout',
      changeWindow: '2026-07-28 20:00 UTC',
      changeDescription: 'Roll out checkout-service REST API v2 with backward-compatible fields for downstream consumers.',
    },
  },
  {
    label: 'Firewall / Network Change',
    data: {
      changeTitle: 'Auth Service Network Segmentation Update',
      targetComponent: 'auth-service',
      changeType: 'security',
      fromVersion: '10.0.0.0/16',
      toVersion: '10.1.0.0/16',
      requestedBy: 'network.security.team',
      changeWindow: '2026-07-25 22:00 UTC',
      changeDescription: 'Migrate the auth-service subnet to a new CIDR range with updated firewall ACLs.',
    },
  },
]

// Background watermark elements: per-item scroll speed multiplier and a
// static rotation (deg) applied on top of the scroll-driven translateY.
// speeds per spec: [0.18, -0.10, 0.22, -0.16, 0.13, -0.12, 0.19]
interface WatermarkConfig {
  label: string
  speed: number
  rotate: number
  top: string
  left: string
}

const watermarkConfigs: WatermarkConfig[] = [
  { label: 'AI', speed: 0.18, rotate: -12, top: '4%', left: '6%' },
  { label: 'RAG', speed: -0.10, rotate: 9, top: '14%', left: '82%' },
  { label: 'RISK', speed: 0.22, rotate: -6, top: '38%', left: '18%' },
  { label: '10Y', speed: -0.16, rotate: 14, top: '48%', left: '70%' },
  { label: 'AGENT', speed: 0.13, rotate: -18, top: '66%', left: '10%' },
  { label: 'DB', speed: -0.12, rotate: 7, top: '74%', left: '88%' },
  { label: 'SLA', speed: 0.19, rotate: -9, top: '90%', left: '45%' },
]

const initialSuggestions = [
  'Analyze the impact of upgrading the payment gateway database',
  'What happens if we change the checkout service API?',
  'Show me past incidents with the payment service',
  'Tell me about the system architecture',
]

function buildFullDescription(formData: FormData): string {
  const parts: string[] = [formData.changeDescription.trim()]
  const meta: string[] = []
  if (formData.fromVersion || formData.toVersion) {
    meta.push(`Change: ${formData.fromVersion || 'current'} -> ${formData.toVersion || 'target'}`)
  }
  if (formData.changeWindow) meta.push(`Change window: ${formData.changeWindow}`)
  if (meta.length) parts.push(`(${meta.join('; ')})`)
  return parts.filter(Boolean).join(' ')
}

const App: React.FC = () => {
  // State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [mode, setMode] = useState<AnalysisMode>('chat')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm the **AI Change Impact Analyzer**. I can help you analyze the impact of proposed system changes, look up past incidents, or answer questions about the architecture.\n\nTry asking me something or use the **Form** mode for detailed analysis.",
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [report, setReport] = useState<ChangeImpactResponse | null>(null)
  const [requestTitle, setRequestTitle] = useState<string>('')
  const [activeTab, setActiveTab] = useState<TabView>('overview')
  const [changeTypes, setChangeTypes] = useState<ChangeType[]>([])
  const [formData, setFormData] = useState<FormData>(defaultFormData)
  const [suggestions, setSuggestions] = useState(initialSuggestions)
  const [healthStatus, setHealthStatus] = useState<string>('')

  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const reportRef = useRef<HTMLDivElement>(null)

  // Scroll-reactive motion targets: the hero panel, the hero "orb" visual,
  // and the background watermark layer.
  const heroPanelRef = useRef<HTMLDivElement>(null)
  const heroOrbRef = useRef<HTMLDivElement>(null)
  const watermarkRefs = useRef<Array<HTMLDivElement | null>>([])

  // Apply theme to the document root so CSS variables in index.css switch
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Scroll-reactive motion (rAF-throttled scroll handler):
  //   heroProgress = clamp(scrollY / max(viewportHeight * 0.9, 560), 0, 1)
  //   heroPanel: translate3d(0, heroProgress * -40px, 0) scale(1 - heroProgress * 0.22) rotate(heroProgress * -3deg); opacity: 1 - heroProgress * 0.95
  //   heroOrb:   rotate(heroProgress * 40deg) scale(1 - heroProgress * 0.1)
  //   watermarks: translate3d(0, scrollY * speed, 0) rotate(staticRotationDeg)
  useEffect(() => {
    let ticking = false

    const applyScrollMotion = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const heroProgress = Math.min(Math.max(scrollY / Math.max(viewportHeight * 0.9, 560), 0), 1)

      if (heroPanelRef.current) {
        heroPanelRef.current.style.transform =
          `translate3d(0, ${heroProgress * -40}px, 0) scale(${1 - heroProgress * 0.22}) rotate(${heroProgress * -3}deg)`
        heroPanelRef.current.style.opacity = `${1 - heroProgress * 0.95}`
        // Smoothly blur the banner out as it scrolls up and away (0 -> 10px,
        // eased with the same heroProgress curve as the rest of the panel so
        // it reads as one continuous, GPU-composited motion rather than a
        // separate abrupt effect).
        heroPanelRef.current.style.filter = `blur(${heroProgress * 10}px)`
      }

      if (heroOrbRef.current) {
        heroOrbRef.current.style.transform =
          `rotate(${heroProgress * 40}deg) scale(${1 - heroProgress * 0.1})`
      }

      watermarkRefs.current.forEach((el, i) => {
        if (!el) return
        const cfg = watermarkConfigs[i]
        el.style.transform = `translate3d(0, ${scrollY * cfg.speed}px, 0) rotate(${cfg.rotate}deg)`
      })

      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(applyScrollMotion)
      }
    }

    applyScrollMotion()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Auto-scroll to latest message with smooth behavior — but skip the very
  // first render (the initial greeting message), otherwise the page jumps
  // straight past the hero on load and the user never sees it.
  const isFirstMessagesRender = useRef(true)
  useEffect(() => {
    if (isFirstMessagesRender.current) {
      isFirstMessagesRender.current = false
      return
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  // Load change types on mount
  useEffect(() => {
    loadChangeTypes()
    checkApiHealth()
  }, [])

  const checkApiHealth = async () => {
    try {
      await checkHealth()
      setHealthStatus('connected')
    } catch {
      setHealthStatus('disconnected')
    }
  }

  const loadChangeTypes = async () => {
    try {
      const types = await getChangeTypes()
      setChangeTypes(types)
    } catch {
      // Will use defaults
    }
  }

  // Send chat message
  const handleSendMessage = useCallback(async () => {
    const text = inputValue.trim()
    if (!text || isLoading) return

    setInputValue('')
    setSuggestions([])

    // Add user message
    const userMessage: ChatMessage = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])

    // Show typing indicator
    setIsLoading(true)

    try {
      // First, try the assistant route to classify
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const assistantResponse: AssistantResponse = await assistantRespond(text, history)

      if (assistantResponse.classification === 'change-analysis') {
        // It's a change analysis request
        const result = await analyzeChangeImpact({
          change_title: text.substring(0, 100),
          change_description: text,
          change_type: 'enhancement',
          affected_services: [],
          priority: 'medium',
        })

        setReport(result)
        setRequestTitle(text.substring(0, 120))
        setActiveTab('overview')
        setMode('chat')

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `✅ **Analysis Complete!**\n\nRisk Score: **${Math.round(result.riskScore * 100)}/100** (${result.riskLevel.toUpperCase()})\n\n${truncateSmart(result.executiveSummary, 300)}\n\n*Use the report tabs below to explore the full analysis.*`,
          },
        ])

        setTimeout(() => reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      } else {
        // General conversation
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: assistantResponse.reply,
          },
        ])

        // Update suggestions
        if (assistantResponse.suggested_actions) {
          setSuggestions(assistantResponse.suggested_actions)
        }
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ **Error:** ${error.message || 'Failed to get response. Please try again.'}`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, isLoading, messages])

  // Submit form-based analysis
  const handleFormSubmit = useCallback(async () => {
    if (!formData.changeTitle.trim() || isLoading) return

    setIsLoading(true)

    try {
      const services = formData.targetComponent
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const result = await analyzeChangeImpact({
        change_title: formData.changeTitle,
        change_description: buildFullDescription(formData),
        change_type: formData.changeType,
        affected_services: services,
        priority: formData.priority,
      })

      setReport(result)
      setRequestTitle(formData.changeTitle)
      setActiveTab('overview')

      setMessages((prev) => [
        ...prev,
        {
          role: 'user',
          content: `**Form Analysis:** ${formData.changeTitle}`,
        },
        {
          role: 'assistant',
          content: `✅ **Analysis Complete!**\n\nRisk Score: **${Math.round(result.riskScore * 100)}/100** (${result.riskLevel.toUpperCase()})\n\n${truncateSmart(result.executiveSummary, 300)}`,
        },
      ])

      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ **Error:** ${error.message || 'Analysis failed.'}`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [formData, isLoading])

  // Handle suggestion click
  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setInputValue(suggestion)
  }, [])

  const handleQuickExample = useCallback((example: QuickExample) => {
    setFormData((prev) => ({ ...prev, ...example.data }))
  }, [])

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="app">
      {/* Background watermark layer — 7 faint scroll-reactive watermarks */}
      <div className="watermark-layer" aria-hidden="true">
        {watermarkConfigs.map((cfg, i) => (
          <div
            key={cfg.label}
            className="watermark-item"
            ref={(el) => { watermarkRefs.current[i] = el }}
            style={{ top: cfg.top, left: cfg.left }}
          >
            {cfg.label}
          </div>
        ))}
      </div>

      {/* Top Navigation Bar */}
      <div className="topnav">
        <div className="container topnav-inner">
          <div className="brand">
            <div className="brand-mark">DB</div>
            <div className="brand-text">
              <span className="brand-title">AI Change Impact Analyzer</span>
              <span className="brand-subtitle">Deutsche Bank &middot; 10th Anniversary Hackathon</span>
            </div>
          </div>
          <div className="topnav-actions">
            <span className="topnav-tag">Agentic AI</span>
            <span className="topnav-tag">RAG</span>
            <span className="topnav-tag topnav-tag-hide-sm">LangGraph</span>
            <button
              className="theme-toggle"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              title="Toggle light / dark mode"
            >
              {theme === 'dark' ? <IconSun /> : <IconMoon />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <span className="live-badge">
              <span className="live-badge-dot" />
              LIVE
            </span>
          </div>
        </div>
      </div>

      {/* Hero Promo Card */}
      <header className="hero">
        <div className="container">
          <div className="hero-promo" ref={heroPanelRef}>
            <div className="hero-promo-main">
              <span className="hero-promo-kicker">10 YEARS OF TECHNOLOGY, DATA &amp; INNOVATION &middot; DEUTSCHE BANK-WIDE HACKATHON</span>
              <h1 className="hero-promo-title">10 Years. Thousands of Ideas.<br />One Future.</h1>
              <p className="hero-promo-desc">
                To mark a decade of bank-wide innovation, we built an AI teammate that
                reads your change request in plain English, runs a full multi-agent risk analysis, and
                tells you what's about to break &mdash; before it does.
              </p>
              <div className="hero-promo-pills">
                <span className="pill-chip hero-feature-pill">🤖 Real conversational AI</span>
                <span className="pill-chip hero-feature-pill">🕸️ Multi-agent reasoning</span>
                <span className="pill-chip hero-feature-pill">📚 RAG-grounded evidence</span>
              </div>
            </div>
            {/* hero "orb" visual: outer wrapper carries scroll-reactive transform,
                inner wrapper carries the idle float + glowPulse animations,
                and a nested ring carries the 24s spin — kept on separate
                elements so the JS scroll transform never fights the CSS
                keyframe transforms for control of the same transform property. */}
            <div className="hero-orb-wrap" ref={heroOrbRef}>
              <div className="hero-orb-inner">
                <span className="hero-orb-ring" />
                <span className="hero-orb-value">7</span>
                <small className="hero-orb-label">AGENTS</small>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="scroll-hint">
            <span>Scroll to explore the live report</span>
            <span className="scroll-hint-arrow">&darr;</span>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">7</span>
              <span className="hero-stat-label">AI Agents</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">19</span>
              <span className="hero-stat-label">Services</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">6</span>
              <span className="hero-stat-label">Data Sources</span>
            </div>
            <div className="hero-stat">
              <span className={`hero-stat-dot ${healthStatus === 'connected' ? 'connected' : 'disconnected'}`} />
              <span className="hero-stat-label">{healthStatus === 'connected' ? 'Connected' : 'Offline'}</span>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="mode-toggle">
            <button
              className={`mode-btn ${mode === 'chat' ? 'active' : ''}`}
              onClick={() => setMode('chat')}
            >
              <IconBot />
              Chat Mode
            </button>
            <button
              className={`mode-btn ${mode === 'form' ? 'active' : ''}`}
              onClick={() => setMode('form')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              Form Mode
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main container">
        {/* Chat Area */}
        {mode === 'chat' && (
          <div className="chat-section">
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`message ${msg.role}`}>
                  <div className="message-avatar">
                    {msg.role === 'assistant' ? <IconBot /> : <IconUser />}
                  </div>
                  <div className="message-bubble">
                    {/* Rendered through the shared markdown-ish renderer so bold,
                        inline-code, and bullet-list markdown syntax from the LLM
                        becomes real formatting instead of literal asterisks,
                        backticks, and dashes cluttering the response. */}
                    <div
                      className="message-content"
                      dangerouslySetInnerHTML={{ __html: markdownish(msg.content) }}
                    />
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="message assistant">
                  <div className="message-avatar"><IconBot /></div>
                  <TypingIndicator text="Analyzing" />
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && !isLoading && (
              <div className="suggestions-area">
                <SuggestionChips suggestions={suggestions} onSelect={handleSuggestionSelect} />
              </div>
            )}

            {/* Input */}
            <div className="chat-input-area">
              <textarea
                ref={inputRef}
                className="chat-input"
                placeholder="Describe a change or ask a question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={isLoading}
              />
              <button
                className="btn btn-primary send-btn"
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                title={isLoading ? 'Analyzing...' : 'Send'}
              >
                {/* Send button swaps icon by state: idle -> rocket, busy -> hourglass */}
                {isLoading ? <IconHourglass /> : <IconRocket />}
              </button>
            </div>
          </div>
        )}

        {/* Form Mode */}
        {mode === 'form' && (
          <div className="form-section">
            <div className="card">
              <h2 className="form-title">Analyze Change Impact</h2>
              <p className="form-desc">
                Describe your proposed change and let AI agents predict the impact across services.
              </p>

              <div className="quick-examples">
                <span className="quick-examples-label">QUICK EXAMPLES</span>
                <div className="quick-examples-row">
                  {quickExamples.map((ex) => (
                    <button key={ex.label} className="pill-chip quick-chip" onClick={() => handleQuickExample(ex)}>
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Change Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Payment Gateway Database Pool Upgrade"
                    value={formData.changeTitle}
                    onChange={(e) => setFormData({ ...formData, changeTitle: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Target Component *</label>
                  <input
                    type="text"
                    placeholder="e.g., payment-gateway"
                    value={formData.targetComponent}
                    onChange={(e) => setFormData({ ...formData, targetComponent: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Change Type</label>
                  <select
                    value={formData.changeType}
                    onChange={(e) => setFormData({ ...formData, changeType: e.target.value })}
                  >
                    {(changeTypes.length > 0
                      ? changeTypes.map((ct) => ({ value: ct.id, label: ct.name }))
                      : [
                          { value: 'enhancement', label: 'Enhancement' },
                          { value: 'infrastructure', label: 'Infrastructure' },
                          { value: 'bugfix', label: 'Bug Fix' },
                          { value: 'security', label: 'Security' },
                          { value: 'rollback', label: 'Rollback' },
                          { value: 'data', label: 'Data Update' },
                          { value: 'policy', label: 'Policy Change' },
                          { value: 'research', label: 'Research' },
                        ]
                    ).map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>From Version / Value</label>
                  <input
                    type="text"
                    placeholder="e.g., 19c or 50 connections"
                    value={formData.fromVersion}
                    onChange={(e) => setFormData({ ...formData, fromVersion: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>To Version / Value</label>
                  <input
                    type="text"
                    placeholder="e.g., 21c or 200 connections"
                    value={formData.toVersion}
                    onChange={(e) => setFormData({ ...formData, toVersion: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Environment</label>
                  <select
                    value={formData.environment}
                    onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                  >
                    <option value="production">Production</option>
                    <option value="staging">Staging</option>
                    <option value="qa">QA</option>
                    <option value="development">Development</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Requested By</label>
                  <input
                    type="text"
                    placeholder="e.g., network.security.team"
                    value={formData.requestedBy}
                    onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Change Window</label>
                  <input
                    type="text"
                    placeholder="e.g., 2026-07-25 22:00 UTC"
                    value={formData.changeWindow}
                    onChange={(e) => setFormData({ ...formData, changeWindow: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    placeholder="Describe the proposed change in detail..."
                    value={formData.changeDescription}
                    onChange={(e) => setFormData({ ...formData, changeDescription: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary form-submit"
                onClick={handleFormSubmit}
                disabled={isLoading || !formData.changeTitle.trim()}
              >
                {isLoading ? (
                  <>
                    <span className="animate-pulse">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <IconZap />
                    Analyze Impact
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Report Section */}
        {report && (
          <div className="report-section animate-fadeIn" ref={reportRef}>
            <div className="analysis-hero card">
              <div className="analysis-hero-main">
                <span className="analysis-hero-id">Analysis ID: {report.analysisId}</span>
                <h2 className="analysis-hero-title">{requestTitle || report.interpretedIntent.substring(0, 80)}</h2>
                <div className="analysis-hero-meta">
                  {report.primaryComponent && (
                    <span>Component: <strong>{report.primaryComponent}</strong></span>
                  )}
                  {report.inferredChangeType && (
                    <span>Type: <strong>{report.inferredChangeType.toUpperCase()}</strong></span>
                  )}
                  <span>Confidence: <strong>{(report.confidence * 100).toFixed(0)}%</strong></span>
                  <span>Processed in <strong>{report.processingTimeMs}ms</strong></span>
                  <span className={`badge ${report.mockMode ? 'badge-medium' : 'badge-success'}`}>
                    {report.mockMode ? 'Mock Mode' : 'Live AI'}
                  </span>
                </div>
              </div>
              <div className="analysis-hero-gauge">
                <RiskGauge
                  score={report.riskScore}
                  level={report.riskLevel}
                  confidence={report.confidence}
                />
              </div>
            </div>

            <div className="report-main">
              <ReportTabs
                report={report}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                requestTitle={requestTitle}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <p>AI Change Impact Analyzer v1.0.0</p>
          <p className="footer-mode">
            {report ? (
              <>Running in <strong>{report.mockMode ? 'Mock' : 'Live'}</strong> mode</>
            ) : (
              <>Backend: <strong>{healthStatus === 'connected' ? 'Connected' : 'Checking...'}</strong></>
            )}
            {' · '}
            <a href="https://github.com/org/change-impact-analyzer" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </p>
        </div>
      </footer>

      {/* Global App Styles */}
      <style>{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* ===== Top Nav ===== */
        .topnav {
          position: relative;
          z-index: 1; /* stack above the fixed .watermark-layer (z-index: 0) */
          background: var(--brand-navy);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .topnav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-mark {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--brand-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.5);
          flex-shrink: 0;
        }
        .brand-text {
          display: flex;
          flex-direction: column;
        }
        .brand-title {
          font-weight: 700;
          font-size: 1rem;
          color: #f4f6fb;
        }
        .brand-subtitle {
          font-size: 0.72rem;
          color: #8b96c2;
        }
        .topnav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .topnav-tag {
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(96, 165, 250, 0.12);
          border: 1px solid rgba(96, 165, 250, 0.3);
          color: #93c5fd;
          font-size: 0.72rem;
          font-weight: 600;
        }
        .topnav-tag-hide-sm { display: inline-flex; }
        @media (max-width: 700px) {
          .topnav-tag-hide-sm { display: none; }
        }
        .theme-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          color: #cbd5e1;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          /* theme toggle transition: background 0.2s ease, transform 0.15s ease */
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .theme-toggle:hover {
          background: rgba(255,255,255,0.12);
          transform: translateY(-1px);
        }
        .theme-toggle:active {
          transform: translateY(0);
        }

        /* ===== Hero ===== */
        .hero {
          position: relative;
          z-index: 1; /* stack above the fixed .watermark-layer (z-index: 0) */
          padding: 28px 0 32px;
        }
        .hero-promo {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          background: var(--brand-gradient);
          border-radius: var(--radius-lg);
          padding: 36px 40px;
          box-shadow: var(--shadow-lg);
          position: relative;
          overflow: hidden;
          /* Scroll-driven transform/opacity/filter are updated every animation
             frame via JS — promoting this to its own GPU compositor layer up
             front keeps the motion at a steady high frame rate instead of
             forcing a layout/paint recalculation on every scroll tick. */
          will-change: transform, opacity, filter;
        }
        .hero-promo::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 85% 20%, rgba(255,255,255,0.12), transparent 55%);
          pointer-events: none;
        }
        .hero-promo-main { position: relative; z-index: 1; max-width: 640px; }
        .hero-promo-kicker {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 1px;
          color: #bfdbfe;
          margin-bottom: 14px;
          text-transform: uppercase;
        }
        .hero-promo-title {
          font-size: 2.1rem;
          font-weight: 800;
          color: white;
          line-height: 1.25;
          margin-bottom: 14px;
        }
        .hero-promo-desc {
          color: #dbeafe;
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 18px;
        }
        .hero-promo-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .hero-feature-pill {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.25);
          color: white;
          cursor: default;
        }
        .hero-feature-pill:hover { transform: none; }
        /* ===== Hero "orb" visual =====
           Outer wrapper (.hero-orb-wrap): scroll-reactive transform only (set via JS ref),
           carries NO css animation so it never fights the JS-driven transform property.
           Inner wrapper (.hero-orb-inner): idle "float" drift + "glowPulse" halo (hero logo pulse).
           Ring (.hero-orb-ring): 24s linear spin (hero inner ring). */
        .hero-orb-wrap {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
          will-change: transform;
          transform-style: preserve-3d;
        }
        .hero-orb-inner {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
          background: rgba(255,255,255,0.06);
          animation: float 6s ease-in-out infinite, glowPulse 3s ease-in-out infinite;
        }
        .hero-orb-ring {
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          border: 2px dashed rgba(255,255,255,0.45);
          animation: spin 24s linear infinite;
        }
        .hero-orb-value {
          font-size: 2.6rem;
          font-weight: 800;
          line-height: 1;
          position: relative;
          z-index: 1;
        }
        .hero-orb-label {
          font-size: 0.62rem;
          letter-spacing: 1px;
          color: #dbeafe;
          margin-top: 2px;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 768px) {
          .hero-promo { flex-direction: column; text-align: center; padding: 28px 24px; }
          .hero-promo-main { max-width: 100%; }
          .hero-promo-pills { justify-content: center; }
        }

        /* ===== Scroll hint ===== */
        .scroll-hint {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          margin: 14px 0 4px;
          color: var(--text-muted);
          font-size: 0.72rem;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }
        .scroll-hint-arrow {
          font-size: 1rem;
          color: var(--primary-light);
          animation: bounceArrow 1.8s ease-in-out infinite;
        }

        /* ===== Background watermark layer =====
           7 faint, scroll-reactive watermark words rendered behind everything. */
        .watermark-layer {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .watermark-item {
          position: absolute;
          font-size: clamp(2.5rem, 8vw, 6rem);
          font-weight: 800;
          letter-spacing: 2px;
          color: var(--text-primary);
          opacity: 0.08;
          white-space: nowrap;
          will-change: transform;
          user-select: none;
          transform: translateZ(0); /* force its own compositor layer for smooth 60fps scroll */
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin: 24px 0;
          flex-wrap: wrap;
        }
        .hero-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .hero-stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .hero-stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .hero-stat-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .hero-stat-dot.connected { background: #10b981; box-shadow: 0 0 8px rgba(16,185,129,0.5); }
        .hero-stat-dot.disconnected { background: #ef4444; box-shadow: 0 0 8px rgba(239,68,68,0.5); }

        /* ===== Mode Toggle ===== */
        .mode-toggle {
          display: flex;
          justify-content: center;
          gap: 4px;
          background: var(--bg-secondary);
          border-radius: 12px;
          padding: 4px;
          border: 1px solid var(--border);
          max-width: 340px;
          margin: 0 auto;
        }
        .mode-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 18px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 9px;
          /* mode button transition: all 0.25s */
          transition: all 0.25s;
          font-family: inherit;
        }
        .mode-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 2px 10px rgba(29, 78, 216, 0.4);
        }
        .mode-btn:hover:not(.active) {
          color: var(--text-primary);
          background: rgba(59, 130, 246, 0.1);
        }

        /* ===== Main ===== */
        .main {
          position: relative;
          z-index: 1; /* stack above the fixed .watermark-layer (z-index: 0) */
          flex: 1;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* ===== Chat ===== */
        .chat-section {
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }
        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          max-height: 500px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .message {
          display: flex;
          gap: 12px;
          animation: fadeIn 0.3s ease;
        }
        .message.user {
          flex-direction: row-reverse;
        }
        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .message.user .message-avatar {
          background: rgba(29, 78, 216, 0.18);
          color: var(--primary-light);
        }
        .message-bubble {
          max-width: 75%;
          padding: 12px 16px;
          background: var(--bg-tertiary);
          border-radius: 14px;
          border: 1px solid var(--border);
        }
        .message.user .message-bubble {
          background: rgba(29, 78, 216, 0.12);
          border-color: rgba(29, 78, 216, 0.3);
        }
        .message-content {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--text-secondary);
          white-space: pre-wrap;
        }
        .message-content strong {
          color: var(--text-primary);
        }

        .suggestions-area {
          padding: 0 20px 12px;
        }

        .chat-input-area {
          display: flex;
          gap: 8px;
          padding: 12px 20px;
          border-top: 1px solid var(--border);
          background: var(--bg-primary);
        }
        .chat-input {
          flex: 1;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px 14px;
          color: var(--text-primary);
          font-size: 0.9rem;
          resize: none;
          min-height: 40px;
          max-height: 120px;
          font-family: inherit;
        }
        .chat-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.2);
        }
        .chat-input::placeholder {
          color: var(--text-muted);
        }
        .send-btn {
          padding: 10px 16px;
          border-radius: 10px;
        }

        /* ===== Form ===== */
        .form-section {
          max-width: 680px;
          margin: 0 auto;
          width: 100%;
        }
        .form-title {
          font-size: 1.3rem;
          margin-bottom: 6px;
        }
        .form-desc {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 18px;
        }
        .quick-examples {
          margin-bottom: 20px;
        }
        .quick-examples-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.8px;
          color: var(--text-muted);
          margin-bottom: 10px;
        }
        .quick-examples-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .quick-chip {
          border-color: rgba(29, 78, 216, 0.35);
          color: var(--primary-light);
          background: rgba(29, 78, 216, 0.08);
        }
        .quick-chip:hover {
          background: rgba(29, 78, 216, 0.18);
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group.full-width {
          grid-column: 1 / -1;
        }
        .form-group label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .form-submit {
          margin-top: 20px;
          width: 100%;
          padding: 13px;
          font-size: 1rem;
        }

        /* ===== Report ===== */
        .report-section {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        .analysis-hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          margin-bottom: 20px;
          background: var(--brand-gradient);
          border: none;
        }
        .analysis-hero-main {
          flex: 1;
          min-width: 0;
        }
        .analysis-hero-id {
          font-family: 'Courier New', monospace;
          font-size: 0.75rem;
          color: #bfdbfe;
        }
        .analysis-hero-title {
          font-size: 1.4rem;
          color: white;
          margin: 6px 0 12px;
          font-weight: 700;
        }
        .analysis-hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
          font-size: 0.82rem;
          color: #dbeafe;
        }
        .analysis-hero-meta strong {
          color: white;
        }
        .analysis-hero-gauge {
          flex-shrink: 0;
          background: rgba(5, 11, 48, 0.35);
          border-radius: var(--radius-md);
          padding: 12px 20px;
        }
        @media (max-width: 768px) {
          .analysis-hero { flex-direction: column; text-align: center; }
          .analysis-hero-meta { justify-content: center; }
        }
        .report-main {
          min-width: 0;
        }

        /* ===== Footer ===== */
        .footer {
          position: relative;
          z-index: 1; /* stack above the fixed .watermark-layer (z-index: 0) */
          padding: 20px 0;
          border-top: 1px solid var(--border);
          margin-top: 40px;
          background: var(--bg-primary);
        }
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .footer-mode a {
          color: var(--primary-light);
          text-decoration: none;
        }
        .footer-mode a:hover {
          text-decoration: underline;
        }
        @media (max-width: 640px) {
          .footer-content { flex-direction: column; gap: 8px; text-align: center; }
        }

        /* ===== Responsive behavior constraints: max-width 900px ===== */
        @media (max-width: 900px) {
          /* hero panel switches to single-column layout */
          .hero-promo {
            flex-direction: column;
            text-align: center;
            padding: 28px 24px;
          }
          .hero-promo-main { max-width: 100%; }
          /* hero visual appears above text (order -1) */
          .hero-orb-wrap { order: -1; margin-bottom: 8px; }
          /* hero chips and scroll hint centered */
          .hero-promo-pills { justify-content: center; }
          .scroll-hint { align-items: center; text-align: center; margin-left: auto; margin-right: auto; }
          /* top-bar subtitle/meta hidden */
          .brand-subtitle { display: none; }
          .topnav-tag { display: none; }
        }
      `}</style>
    </div>
  )
}

export default App
