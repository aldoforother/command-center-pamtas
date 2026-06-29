/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      /* ═══════════════════════════════════════════════════════════════════════════
         FOUNDATION TOKENS
         Command Center PAMTAS — Design System Foundation
         Version: 2.0 | Complete Token System

         Reference: index.css for CSS Custom Properties
         ═══════════════════════════════════════════════════════════════════════════ */

      /* ─────────────────────────────────────────────────────────────────────────
         1. COLOR TOKENS — Maps to CSS Custom Properties
         ───────────────────────────────────────────────────────────────────────── */
      colors: {
        /* ── Surface Hierarchy (Elevation) ── */
        surface: {
          base:         'var(--surface-base)',
          primary:      'var(--surface-primary)',
          secondary:    'var(--surface-secondary)',
          tertiary:     'var(--surface-tertiary)',
          interactive:  'var(--surface-interactive)',
          muted:        'var(--surface-muted)',
        },

        /* ── Border Hierarchy ── */
        border: {
          subtle: 'var(--border-subtle)',
          DEFAULT: 'var(--border-default)',
          strong: 'var(--border-strong)',
          focus:  'var(--border-focus)',
          danger: 'var(--border-danger)',
        },

        /* ── Text Hierarchy (Contrast Optimized) ── */
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary:  'var(--text-tertiary)',
          disabled:  'var(--text-disabled)',
          inverse:   'var(--text-inverse)',
        },

        /* ── Accent — Phosphor Green ── */
        accent: {
          DEFAULT:  'var(--accent-primary)',
          hover:    'var(--accent-hover)',
          pressed:  'var(--accent-pressed)',
          muted:    'var(--accent-muted)',
        },

        /* ── Semantic Status ── */
        success: {
          DEFAULT: 'var(--color-success)',
          hover:   'var(--color-success-hover)',
          subtle:  'var(--color-success-subtle)',
          muted:   'var(--color-success-muted)',
          text:    'var(--color-success-text)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          hover:   'var(--color-warning-hover)',
          subtle:  'var(--color-warning-subtle)',
          muted:   'var(--color-warning-muted)',
          text:    'var(--color-warning-text)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          hover:   'var(--color-danger-hover)',
          subtle:  'var(--color-danger-subtle)',
          muted:   'var(--color-danger-muted)',
          text:    'var(--color-danger-text)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          hover:   'var(--color-info-hover)',
          subtle:  'var(--color-info-subtle)',
          muted:   'var(--color-info-muted)',
          text:    'var(--color-info-text)',
        },

        /* ── Extended Colors ── */
        purple: {
          DEFAULT:  'var(--color-purple)',
          hover:    'var(--color-purple-hover)',
          subtle:   'var(--color-purple-subtle)',
          muted:    'var(--color-purple-muted)',
          text:     'var(--color-purple-text)',
        },
        pink: {
          DEFAULT:  'var(--color-pink)',
          hover:    'var(--color-pink-hover)',
          subtle:   'var(--color-pink-subtle)',
          muted:    'var(--color-pink-muted)',
          text:     'var(--color-pink-text)',
        },
        orange: {
          DEFAULT:  'var(--color-orange)',
          hover:    'var(--color-orange-hover)',
          subtle:   'var(--color-orange-subtle)',
          muted:    'var(--color-orange-muted)',
          text:     'var(--color-orange-text)',
        },
        gray: {
          DEFAULT:  'var(--color-gray)',
          hover:    'var(--color-gray-hover)',
          subtle:   'var(--color-gray-subtle)',
        },

        /* ── Map Specific ── */
        map: {
          bg:              'var(--map-bg)',
          popup:           'var(--map-popup-bg)',
          'popup-border':  'var(--map-popup-border)',
          'popup-header':  'var(--map-popup-header-bg)',
          control:         'var(--map-control-bg)',
          'control-active':'var(--map-control-active-bg)',
        },
        marker: {
          selected:  'var(--map-marker-selected)',
          default:   'var(--map-marker-default)',
        },

        /* ── Legacy Support ── */
        hud: {
          bg:           '#050810',
          surface:      '#070e0a',
          panel:        '#060d08',
          border:       'rgba(0,255,136,0.18)',
          green:        '#00ff88',
          'green-dim':  'rgba(0,255,136,0.5)',
          red:          '#ff3333',
          'red-dim':    'rgba(255,51,51,0.5)',
          amber:        '#ffaa00',
          blue:         '#4488ff',
          purple:       '#bb88ff',
          text:         '#c8d6e5',
          muted:        'rgba(200,214,229,0.45)',
          faint:        'rgba(200,214,229,0.18)',
        },
        military: {
          bg:       '#050810',
          surface:  '#070e0a',
          card:     '#060d08',
          border:   'rgba(0,255,136,0.18)',
          accent:   '#00ff88',
          accent2:  '#00cc6a',
          danger:   '#ff3333',
          warning:  '#ffaa00',
          info:     '#4488ff',
          muted:    '#0e1a10',
          text:     '#c8d6e5',
          subtext:  'rgba(200,214,229,0.5)',
        },
      },

      /* ─────────────────────────────────────────────────────────────────────────
         2. TYPOGRAPHY TOKENS
         ───────────────────────────────────────────────────────────────────────── */
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },

      fontSize: {
        /* ── Semantic Type Scale ── */
        'display-xl': ['48px', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-lg': ['36px', { lineHeight: '1.0',  letterSpacing: '-0.02em', fontWeight: '700' }],
        'display':    ['32px', { lineHeight: '1.1',  letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['28px', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h1':         ['24px', { lineHeight: '1.2',  letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2':         ['20px', { lineHeight: '1.3',  letterSpacing: '0em',      fontWeight: '600' }],
        'h3':         ['16px', { lineHeight: '1.4',  letterSpacing: '0em',      fontWeight: '600' }],
        'h4':         ['14px', { lineHeight: '1.4',  letterSpacing: '0em',      fontWeight: '500' }],
        'body-lg':    ['16px', { lineHeight: '1.5',  letterSpacing: '0em',      fontWeight: '400' }],
        'body':       ['14px', { lineHeight: '1.5',  letterSpacing: '0em',      fontWeight: '400' }],
        'body-sm':    ['13px', { lineHeight: '1.5',  letterSpacing: '0em',      fontWeight: '400' }],
        'body-xs':    ['12px', { lineHeight: '1.4',  letterSpacing: '0em',      fontWeight: '400' }],
        'label':      ['12px', { lineHeight: '1.3',  letterSpacing: '0.02em',   fontWeight: '500' }],
        'label-sm':   ['11px', { lineHeight: '1.3',  letterSpacing: '0.03em',   fontWeight: '500' }],
        'caption':    ['11px', { lineHeight: '1.3',  letterSpacing: '0.04em',   fontWeight: '500' }],
        'caption-sm':  ['10px', { lineHeight: '1.2',  letterSpacing: '0.05em',   fontWeight: '500' }],
        'micro':       ['9px',  { lineHeight: '1.2',  letterSpacing: '0.08em',   fontWeight: '600' }],
        'micro-xs':    ['8px',  { lineHeight: '1.1',  letterSpacing: '0.10em',   fontWeight: '600' }],
      },

      fontWeight: {
        regular:  '400',
        medium:  '500',
        semibold: '600',
        bold:    '700',
        black:    '900',
      },

      lineHeight: {
        none:    '1',
        tight:    '1.1',
        snug:     '1.25',
        normal:   '1.5',
        relaxed:  '1.625',
        loose:    '2',
      },

      letterSpacing: {
        tighter: '-0.05em',
        tight:   '-0.025em',
        normal:  '0em',
        wide:    '0.025em',
        wider:   '0.05em',
        widest:  '0.1em',
      },

      /* ─────────────────────────────────────────────────────────────────────────
         3. SPACING TOKENS — 4px Base Grid
         ───────────────────────────────────────────────────────────────────────── */
      spacing: {
        /* Micro spacing (1-3) */
        '0':  '0px',
        'px': '1px',
        '0.5': '2px',
        '1':  '4px',
        '1.5': '6px',
        '2':  '8px',
        '2.5': '10px',
        '3':  '12px',

        /* Standard spacing (4-6) */
        '4':  '16px',
        '5':  '20px',
        '6':  '24px',

        /* Large spacing (7-12) */
        '7':  '28px',
        '8':  '32px',
        '9':  '36px',
        '10': '40px',
        '11': '44px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '20': '80px',
        '24': '96px',

        /* Negative spacing */
        '-1':  '-4px',
        '-2':  '-8px',
        '-3':  '-12px',
        '-4':  '-16px',
      },

      /* ─────────────────────────────────────────────────────────────────────────
         4. SIZING TOKENS
         ───────────────────────────────────────────────────────────────────────── */
      width: {
        'screen-sm': '640px',
        'screen-md': '768px',
        'screen-lg': '1024px',
        'screen-xl': '1280px',
        'screen-2xl': '1536px',
      },
      height: {
        'screen': '100vh',
        'screen-sm': '640px',
        'screen-md': '768px',
        'screen-lg': '1024px',
        'screen-xl': '1280px',
      },

      /* ─────────────────────────────────────────────────────────────────────────
         5. RADIUS TOKENS
         ───────────────────────────────────────────────────────────────────────── */
      borderRadius: {
        none:   '0px',
        sm:     '2px',
        DEFAULT: '2px',
        badge:  '2px',
        md:     '4px',
        lg:     '6px',
        xl:     '8px',
        '2xl':  '12px',
        '3xl':  '16px',
        full:   '9999px',
      },

      /* ─────────────────────────────────────────────────────────────────────────
         6. SHADOW/ ELEVATION TOKENS
         ───────────────────────────────────────────────────────────────────────── */
      boxShadow: {
        /* ── Elevation Scale ── */
        'none':     'none',
        'xs':       '0 1px 2px rgba(0, 0, 0, 0.05)',
        'sm':       '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'DEFAULT':  '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'md':       '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'lg':       '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'xl':       '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
        '2xl':      '0 25px 50px rgba(0, 0, 0, 0.25)',
        'inner':     'inset 0 2px 4px rgba(0, 0, 0, 0.06)',

        /* ── Glow Variants ── */
        'glow':        '0 0 20px rgba(0, 255, 136, 0.3)',
        'glow-sm':     '0 0 10px rgba(0, 255, 136, 0.2)',
        'glow-lg':     '0 0 30px rgba(0, 255, 136, 0.5)',
        'glow-xl':     '0 0 40px rgba(0, 255, 136, 0.6)',
        'glow-danger': '0 0 20px rgba(255, 59, 59, 0.3)',
        'glow-warning':'0 0 20px rgba(255, 176, 32, 0.3)',
        'glow-info':   '0 0 20px rgba(59, 139, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(187, 136, 255, 0.3)',

        /* ── HUD Legacy ── */
        'hud':        '0 0 20px rgba(0,255,136,0.1), inset 0 1px 0 rgba(0,255,136,0.05)',
        'hud-strong':  '0 0 30px rgba(0,255,136,0.2)',
        'hud-red':    '0 0 20px rgba(255,51,51,0.15)',
        'hud-amber':  '0 0 20px rgba(255,170,0,0.15)',
      },

      /* ─────────────────────────────────────────────────────────────────────────
         7. Z-INDEX TOKENS
         ───────────────────────────────────────────────────────────────────────── */
      zIndex: {
        '0':    '0',
        '10':   '10',
        '20':   '20',
        base:   '0',
        dropdown: '100',
        sticky:   '200',
        overlay:  '300',
        modal:    '400',
        popover:  '500',
        toast:    '600',
        tooltip:  '700',
        max:     '9999',
      },

      /* ─────────────────────────────────────────────────────────────────────────
         8. MOTION/TRANSITION TOKENS
         ───────────────────────────────────────────────────────────────────────── */
      transitionDuration: {
        '0':      '0ms',
        '75':     '75ms',
        '100':    '100ms',
        '150':    '150ms',
        '200':    '200ms',
        '250':    '250ms',
        '300':    '300ms',
        '350':    '350ms',
        '400':    '400ms',
        '500':    '500ms',
        '700':    '700ms',
        '1000':   '1000ms',
        instant: '50ms',
        fast:    '100ms',
        DEFAULT: '150ms',
        normal:  '150ms',
        smooth:  '200ms',
        slow:    '300ms',
        page:    '400ms',
      },

      transitionTimingFunction: {
        DEFAULT:    'cubic-bezier(0.4, 0, 0.2, 1)',
        linear:     'linear',
        in:         'cubic-bezier(0.4, 0, 1, 1)',
        out:        'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out':   'cubic-bezier(0.65, 0, 0.35, 1)',
        bounce:     'cubic-bezier(0.34, 1.56, 0.64, 1)',
        sharp:      'cubic-bezier(0.7, 0, 0.84, 0)',
        elastic:    'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
      },

      transitionProperty: {
        DEFAULT:     'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
        colors:      'color, background-color, border-color, text-decoration-color, fill, stroke',
        opacity:     'opacity',
        shadow:       'box-shadow',
        transform:    'transform',
      },

      /* ─────────────────────────────────────────────────────────────────────────
         9. ANIMATION TOKENS
         ───────────────────────────────────────────────────────────────────────── */
      animation: {
        'none':              'none',
        'spin':              'spin 1s linear infinite',
        'ping':              'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse':             'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce':            'bounce 1s infinite',
        'fade-in':           'fadeIn var(--duration-smooth) var(--ease-out) both',
        'fade-in-up':       'fadeInUp var(--duration-smooth) var(--ease-out) both',
        'fade-in-down':     'fadeInDown var(--duration-smooth) var(--ease-out) both',
        'scale-in':          'scaleIn var(--duration-normal) var(--ease-out) both',
        'slide-in-right':    'slideInRight var(--duration-slow) var(--ease-out) both',
        'slide-in-left':     'slideInLeft var(--duration-slow) var(--ease-out) both',
        'pulse-slow':        'pulse 3s ease-in-out infinite',
        'pulse-danger':      'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'status-pulse':      'statusPulse 2s ease-in-out infinite',
        'spin-slow':         'spin 1.5s linear infinite',
      },

      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        statusPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.85)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        ping: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%':      { transform: 'none', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
      },

      /* ─────────────────────────────────────────────────────────────────────────
         10. OPACITY TOKENS
         ───────────────────────────────────────────────────────────────────────── */
      opacity: {
        '0':    '0',
        '5':    '0.05',
        '10':   '0.1',
        '15':   '0.15',
        '20':   '0.2',
        '25':   '0.25',
        '30':   '0.3',
        '35':   '0.35',
        '40':   '0.4',
        '50':   '0.5',
        '60':   '0.6',
        '70':   '0.7',
        '75':   '0.75',
        '80':   '0.8',
        '90':   '0.9',
        '95':   '0.95',
        '100':  '1',
      },

      /* ─────────────────────────────────────────────────────────────────────────
         11. BACKDROP BLUR TOKENS
         ───────────────────────────────────────────────────────────────────────── */
      backdropBlur: {
        'none': '0',
        sm:     '4px',
        DEFAULT: '8px',
        md:     '12px',
        lg:     '16px',
        xl:     '24px',
        '2xl':  '40px',
        '3xl':  '64px',
      },
    },
  },
  plugins: [],
}
