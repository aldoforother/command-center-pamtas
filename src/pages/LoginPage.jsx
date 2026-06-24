import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(text, speed = 80, startDelay = 400) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone]           = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
      return () => clearInterval(interval)
    }, startDelay)
    return () => clearTimeout(timeout)
  }, [text, speed, startDelay])

  return { displayed, done }
}

// ── Glitch keyframes injected once ──────────────────────────────────────────
const GLITCH_CSS = `
@keyframes glitch-clip-1 {
  0%   { clip-path: inset(0 0 95% 0); transform: translate(-2px, 0); }
  20%  { clip-path: inset(30% 0 50% 0); transform: translate(2px, 0); }
  40%  { clip-path: inset(70% 0 5% 0); transform: translate(-1px, 0); }
  60%  { clip-path: inset(10% 0 80% 0); transform: translate(3px, 0); }
  80%  { clip-path: inset(55% 0 20% 0); transform: translate(-2px, 0); }
  100% { clip-path: inset(0 0 95% 0); transform: translate(0, 0); }
}
@keyframes glitch-clip-2 {
  0%   { clip-path: inset(50% 0 30% 0); transform: translate(2px, 0);  color: #ff3366; }
  25%  { clip-path: inset(15% 0 70% 0); transform: translate(-3px, 0); color: #00ffff; }
  50%  { clip-path: inset(80% 0 5% 0);  transform: translate(1px, 0);  color: #ff3366; }
  75%  { clip-path: inset(5% 0 85% 0);  transform: translate(-1px, 0); color: #00ffff; }
  100% { clip-path: inset(50% 0 30% 0); transform: translate(0, 0);    color: #ff3366; }
}
@keyframes glitch-flicker {
  0%, 100% { opacity: 1; }
  92%       { opacity: 1; }
  93%       { opacity: 0.4; }
  94%       { opacity: 1; }
  96%       { opacity: 0.6; }
  97%       { opacity: 1; }
}
@keyframes scan-line {
  0%   { top: -10%; }
  100% { top: 110%; }
}
@keyframes badge-pulse {
  0%, 100% { box-shadow: 0 0 0px rgba(0,255,136,0); }
  50%       { box-shadow: 0 0 12px rgba(0,255,136,0.35); }
}
`

function injectGlitchStyles() {
  if (document.getElementById('glitch-styles')) return
  const style = document.createElement('style')
  style.id = 'glitch-styles'
  style.textContent = GLITCH_CSS
  document.head.appendChild(style)
}

// ── GlitchText component ─────────────────────────────────────────────────────
function GlitchText({ text, style: outerStyle }) {
  const active = useRef(false)
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    active.current = true
    // Random glitch bursts
    function scheduleNext() {
      if (!active.current) return
      const delay = 2500 + Math.random() * 4000
      setTimeout(() => {
        if (!active.current) return
        setGlitching(true)
        setTimeout(() => {
          if (!active.current) return
          setGlitching(false)
          scheduleNext()
        }, 180 + Math.random() * 120)
      }, delay)
    }
    scheduleNext()
    return () => { active.current = false }
  }, [])

  const base = {
    position: 'relative',
    display: 'inline-block',
    animation: 'glitch-flicker 6s infinite',
    ...outerStyle,
  }

  const pseudoBase = {
    content: `"${text}"`,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  }

  return (
    <span style={base} data-text={text}>
      {text}
      {glitching && (
        <>
          <span aria-hidden style={{
            ...pseudoBase,
            animation: 'glitch-clip-1 0.18s steps(1) infinite',
            color: '#00ffff',
            mixBlendMode: 'screen',
          }}>{text}</span>
          <span aria-hidden style={{
            ...pseudoBase,
            animation: 'glitch-clip-2 0.18s steps(1) infinite',
            mixBlendMode: 'screen',
          }}>{text}</span>
        </>
      )}
    </span>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const { signIn }   = useAuth()
  const navigate     = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  // Typewriter on the main title
  const { displayed, done } = useTypewriter('SATGAS PAMTAS RI-MLY', 70, 600)

  useEffect(() => { injectGlitchStyles() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error: signInError } = await signIn(email, password)
      if (signInError) throw signInError
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa email dan password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050810',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      padding: '24px',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* Scan line */}
      <div style={{
        position: 'fixed',
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.18), transparent)',
        animation: 'scan-line 5s linear infinite',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Garis dekorasi sudut */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 1 }}>
        {['topLeft','topRight','bottomLeft','bottomRight'].map(corner => (
          <div key={corner} style={{
            position: 'absolute',
            width: '32px',
            height: '32px',
            ...(corner.includes('top')    ? { top: '16px' }    : { bottom: '16px' }),
            ...(corner.includes('Left')   ? { left: '16px' }   : { right: '16px' }),
            borderTop:    corner.includes('top')    ? '1px solid rgba(0,255,136,0.3)' : 'none',
            borderBottom: corner.includes('bottom') ? '1px solid rgba(0,255,136,0.3)' : 'none',
            borderLeft:   corner.includes('Left')   ? '1px solid rgba(0,255,136,0.3)' : 'none',
            borderRight:  corner.includes('Right')  ? '1px solid rgba(0,255,136,0.3)' : 'none',
          }} />
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: '380px', position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>

          {/* Badge */}
          <div style={{
            display: 'inline-block',
            padding: '10px 20px',
            border: '1px solid rgba(0,255,136,0.25)',
            marginBottom: '16px',
            animation: 'badge-pulse 3s ease-in-out infinite',
          }}>
            <span style={{ color: '#00ff88', fontSize: '10px', letterSpacing: '0.25em' }}>
              ◈ NARASINGA OPS CENTER
            </span>
          </div>

          {/* Title with typewriter + glitch */}
          <h1 style={{
            fontSize: '18px',
            fontWeight: 400,
            letterSpacing: '0.2em',
            margin: '0 0 4px',
            minHeight: '28px',
          }}>
            {done ? (
              <GlitchText
                text="SATGAS PAMTAS RI-MLY"
                style={{ color: 'rgba(200,214,229,0.9)' }}
              />
            ) : (
              <span style={{ color: 'rgba(200,214,229,0.9)' }}>
                {displayed}
                <span style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '1em',
                  background: '#00ff88',
                  marginLeft: '2px',
                  verticalAlign: 'text-bottom',
                  animation: 'glitch-flicker 0.8s step-end infinite',
                }} />
              </span>
            )}
          </h1>

          <p style={{ color: 'rgba(200,214,229,0.35)', fontSize: '10px', letterSpacing: '0.15em', margin: 0 }}>
            YONKAV 8/NSW • KALIMANTAN UTARA
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Email */}
          <div>
            <label style={{
              display: 'block',
              color: 'rgba(0,255,136,0.6)',
              fontSize: '10px',
              letterSpacing: '0.15em',
              marginBottom: '6px',
            }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="operator@pamtas.mil.id"
              style={{
                width: '100%',
                background: 'rgba(0,255,136,0.04)',
                border: '1px solid rgba(0,255,136,0.2)',
                borderRadius: '3px',
                padding: '10px 12px',
                color: 'rgba(200,214,229,0.9)',
                fontSize: '12px',
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block',
              color: 'rgba(0,255,136,0.6)',
              fontSize: '10px',
              letterSpacing: '0.15em',
              marginBottom: '6px',
            }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={{
                width: '100%',
                background: 'rgba(0,255,136,0.04)',
                border: '1px solid rgba(0,255,136,0.2)',
                borderRadius: '3px',
                padding: '10px 12px',
                color: 'rgba(200,214,229,0.9)',
                fontSize: '12px',
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(255,51,51,0.08)',
              border: '1px solid rgba(255,51,51,0.25)',
              borderRadius: '3px',
              padding: '10px 12px',
              color: 'rgba(255,100,100,0.9)',
              fontSize: '11px',
              letterSpacing: '0.05em',
              lineHeight: 1.5,
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '12px',
              background: loading ? 'rgba(0,255,136,0.05)' : 'rgba(0,255,136,0.1)',
              border: '1px solid rgba(0,255,136,0.3)',
              borderRadius: '3px',
              color: loading ? 'rgba(0,255,136,0.4)' : '#00ff88',
              fontSize: '11px',
              letterSpacing: '0.2em',
              fontFamily: 'monospace',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'AUTENTIKASI...' : 'MASUK SISTEM'}
          </button>
        </form>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          color: 'rgba(200,214,229,0.2)',
          fontSize: '10px',
          letterSpacing: '0.1em',
          marginTop: '32px',
        }}>
          AKSES TERBATAS • PERSONEL BERWENANG
        </p>

      </div>
    </div>
  )
}
