/**
 * PageErrorBoundary — error boundary per halaman.
 * Mencegah error di satu page crash seluruh app.
 *
 * Uses CSS tokens for theming consistency.
 */
import { Component } from 'react'

export default class PageErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Log ke console untuk debugging — bisa dikirim ke error tracking service
    console.error('[PageErrorBoundary]', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontFamily: 'monospace',
            padding: '32px',
            background: 'var(--surface-base)',
          }}
        >
          <div
            style={{
              color: 'var(--color-danger)',
              fontSize: '20px',
            }}
          >
            ⚠
          </div>
          <p
            className="text-[10px] tracking-[0.15em] uppercase"
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            Halaman ini mengalami kesalahan
          </p>
          <p
            className="text-[9px]"
            style={{
              color: 'var(--color-danger-text)',
              maxWidth: '360px',
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            {this.state.error?.message || 'Terjadi kesalahan yang tidak diketahui'}
          </p>
          <button
            onClick={this.handleReset}
            className="text-[9px] tracking-[0.12em] uppercase px-5 py-2 rounded-sm cursor-pointer transition-all duration-150"
            style={{
              marginTop: '4px',
              background: 'var(--accent-muted)',
              border: '1px solid var(--accent-muted)',
              color: 'var(--accent-primary)',
            }}
          >
            Coba Lagi
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
