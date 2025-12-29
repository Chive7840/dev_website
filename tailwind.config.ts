import fs from 'node:fs';
import path from 'node:path';

import plugin from 'tailwindcss/plugin';
import type { Config } from 'tailwindcss';

/**
 * Map of semantic token names to CSS variable references.
 */
type SemanticColorGroup = Record<string, string>;

/**
 * Shape of the design token manifest consumed by Tailwind.
 */
type ThemeTokens = {
  metadata: { id: string; default?: boolean };
  primitives: {
    spacing: Record<string, string>;
    motion: {
      duration: Record<string, string>;
      easing: Record<string, string>;
    };
    radius: Record<string, string>;
    shadow: Record<string, string>;
    typography: {
      fontFamily: Record<string, string>;
      fontSize: Record<string, string>;
      lineHeight: Record<string, string>;
    };
  };
  semantic: {
    color: Record<string, SemanticColorGroup>;
  };
};

const tokensDir = path.resolve(process.cwd(), 'design-tokens/themes');
const manifestPath = path.join(tokensDir, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as {
  themes: { id: string; file: string; default?: boolean }[];
};

const loadedTokens = manifest.themes.map((entry) => {
  const filePath = path.join(tokensDir, entry.file);
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as ThemeTokens;
});

const baseTheme = loadedTokens.find((theme) => theme.metadata.default) ?? loadedTokens[0];

const BREAKPOINTS = {
  sm: '600px',
  md: '840px',
  lg: '1200px',
  xl: '1600px'
} as const;

/**
 * Helper to produce CSS variable references for Tailwind tokens.
 */
const createVar = (...segments: string[]) => `var(--${segments.join('-')})`;

const flattenSemanticColors = (semantic: ThemeTokens['semantic']['color']) => {
  const result: Record<string, string> = {};

  for (const [category, values] of Object.entries(semantic)) {
    for (const [token] of Object.entries(values)) {
      const key = `${category}-${token}`;
      result[key] = createVar('color', category, token);
    }
  }

  return result;
};

const semanticColors = flattenSemanticColors(baseTheme.semantic.color);

const spacing = Object.fromEntries(
  Object.keys(baseTheme.primitives.spacing).map((token) => [token, createVar('space', token)])
);

const radius = Object.fromEntries(
  Object.keys(baseTheme.primitives.radius).map((token) => [token, createVar('radius', token)])
);

const shadow = Object.fromEntries(
  Object.keys(baseTheme.primitives.shadow).map((token) => [token, createVar('shadow', token)])
);

const motionDuration = Object.fromEntries(
  Object.keys(baseTheme.primitives.motion.duration).map((token) => [
    token,
    createVar('motion', 'duration', token)
  ])
);

if (!('DEFAULT' in motionDuration)) {
  motionDuration.DEFAULT = createVar('motion', 'duration', 'standard');
}

const motionEasing = Object.fromEntries(
  Object.keys(baseTheme.primitives.motion.easing).map((token) => [
    token,
    createVar('motion', 'easing', token)
  ])
);

if (!('DEFAULT' in motionEasing)) {
  motionEasing.DEFAULT = createVar('motion', 'easing', 'standard');
}

const fontFamilies = {
  sans: [
    createVar('font-body'),
    'Inter',
    'Roboto Flex',
    'Roboto',
    'Segoe UI',
    'system-ui',
    'sans-serif'
  ],
  heading: [
    createVar('font-heading'),
    'Lexend',
    'Atkinson Hyperlegible',
    'Roboto Flex',
    'Segoe UI',
    'system-ui',
    'sans-serif'
  ],
  mono: [
    createVar('font-mono'),
    'Roboto Mono',
    'Fira Code',
    'Source Code Pro',
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Consolas',
    'monospace'
  ]
};

const fontSize = {
  xs: [createVar('font-size', 'xs'), { lineHeight: createVar('line-height', 'snug') }],
  sm: [createVar('font-size', 'sm'), { lineHeight: createVar('line-height', 'normal') }],
  base: [createVar('font-size', 'base'), { lineHeight: createVar('line-height', 'normal') }],
  lg: [createVar('font-size', 'lg'), { lineHeight: createVar('line-height', 'relaxed') }],
  xl: [createVar('font-size', 'xl'), { lineHeight: createVar('line-height', 'snug') }],
  '2xl': [createVar('font-size', '2xl'), { lineHeight: createVar('line-height', 'snug') }],
  '3xl': [createVar('font-size', '3xl'), { lineHeight: createVar('line-height', 'tight') }],
  '4xl': [createVar('font-size', '4xl'), { lineHeight: createVar('line-height', 'tight') }]
} satisfies Record<string, [string, { lineHeight: string }]>;

const lineHeight = {
  tight: createVar('line-height', 'tight'),
  snug: createVar('line-height', 'snug'),
  normal: createVar('line-height', 'normal'),
  relaxed: createVar('line-height', 'relaxed')
};

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './stories/**/*.{ts,tsx}'
  ],
  theme: {
    screens: BREAKPOINTS,
    container: {
      center: true,
      padding: {
        DEFAULT: 'clamp(var(--shell-gutter-sm), 5vw, var(--shell-gutter-lg))',
        lg: 'var(--shell-gutter-lg)'
      },
      screens: BREAKPOINTS
    },
    extend: {
      colors: {
        ...semanticColors,
        background: {
          DEFAULT: semanticColors['background-default'],
          muted: semanticColors['background-muted']
        },
        surface: {
          DEFAULT: semanticColors['surface-default'],
          contrast: semanticColors['surface-contrast'],
          subtle: semanticColors['surface-subtle']
        },
        text: {
          DEFAULT: semanticColors['text-default'],
          muted: semanticColors['text-muted'],
          inverse: semanticColors['text-inverse'],
          accent: semanticColors['text-accent']
        },
        accent: {
          DEFAULT: semanticColors['accent-default'],
          hover: semanticColors['accent-hover'],
          active: semanticColors['accent-active'],
          contrast: semanticColors['accent-contrastText']
        },
        success: {
          DEFAULT: semanticColors['success-default'],
          contrast: semanticColors['success-contrastText']
        },
        warning: {
          DEFAULT: semanticColors['warning-default'],
          contrast: semanticColors['warning-contrastText']
        },
        danger: {
          DEFAULT: semanticColors['danger-default'],
          contrast: semanticColors['danger-contrastText']
        },
        border: {
          subtle: semanticColors['border-subtle'],
          strong: semanticColors['border-strong'],
          accent: semanticColors['border-accent']
        },
        focus: {
          ring: semanticColors['focus-ring'],
          inner: semanticColors['focus-inner']
        },
        overlay: {
          scrim: semanticColors['overlay-scrim']
        }
      },
      fontFamily: fontFamilies,
      fontSize,
      lineHeight,
      spacing,
      borderRadius: radius,
      boxShadow: shadow,
      transitionDuration: motionDuration,
      transitionTimingFunction: motionEasing,
      backgroundImage: {
        'aurora-radial': 'var(--gradient-surface-midnight)',
        'aurora-horizon': 'var(--gradient-surface-horizon)',
        'aurora-layered': 'var(--gradient-layered-luminous-noise)',
        'aurora-noise': 'var(--texture-noise)'
      },
      backgroundSize: {
        'aurora-noise': 'var(--background-noise-size, 280px 280px)'
      },
      backgroundPosition: {
        'aurora-source': '18% 36%',
        'aurora-halo': '78% 12%'
      },
      backgroundBlendMode: {
        screen: 'screen',
        'soft-light': 'soft-light'
      }
    }
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('forced-colors', '@media (forced-colors: active)');
      addVariant('motion-safe', '@media (prefers-reduced-motion: no-preference)');
      addVariant('motion-reduce', '@media (prefers-reduced-motion: reduce)');
      addVariant('contrast-more', '@media (prefers-contrast: more)');
      addVariant('contrast-less', '@media (prefers-contrast: less)');
    })
  ]
};

export default config;
