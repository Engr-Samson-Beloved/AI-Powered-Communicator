'use client'

import { ArrowUpRight, AudioLines, UserCheck } from 'lucide-react'
import './site-header.css'

interface SiteHeaderProps {
  landing: boolean
  authenticated: boolean
  username: string
  onHome: () => void
  onStart: () => void
  onLogout: () => void
}

export function SiteHeader({ landing, authenticated, username, onHome, onStart, onLogout }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <button className="site-wordmark" onClick={onHome} aria-label="VoicePath home">
          <span className="site-brand-icon"><AudioLines size={22} strokeWidth={1.7} /></span>
          <span>VoicePath<span className="site-brand-ai">AI</span></span>
        </button>
        {landing && (
          <div className="site-nav-links">
            <a href="#how-it-works">How it works</a>
            <a href="#our-mission">Our mission</a>
          </div>
        )}
        <div className="site-nav-actions">
          {authenticated ? <>
            <span className="site-user"><UserCheck size={15} />{username}</span>
            <button className="site-signout" onClick={onLogout}>Sign out</button>
          </> : <button className="site-start" onClick={onStart}>Get started<ArrowUpRight size={16} /></button>}
        </div>
      </nav>
    </header>
  )
}
