# Development Guide for the "dev_website" Project

## Project Overview

This is a modern full-stack website project that uses React 19, TypeScript, SCSS, CSS, Tailwind and Vite.
It's designed for building a high-performance combination of Multi-Page Applications (MPA) and Single Page Applications
with integrated modern development toolchain and best practices.

The landing page will be the Multi-Page Application as it will route users to all other parts of the website.
Each page of the website linked/routed to from the landing page will be an SPA (Single Page Application).

## Project Design Example

This project uses [vanoltz.co](https://vanholtz.co/) as the Multi-Page Application example for the design of this portfolio project.

## Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Routing**: React Router v7
- **UI Components**: Material-UI
- **Styling**: Tailwind CSS / Styled-components / SCSS / Design Tokens
- **HTTP Client**: Axios
- **Testing Framework**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier

## Project Structure

```
dev_website/
├── docs/                       # Project Documentation
│   └── design/                 # Sample Images from the Project Design Example Website
│       ├── about_curtain.png
│       ├── landing_link_highlighted.png
│       ├── singe_page_application_example.png
│       └── vanholtz_landing.png
├── public/                     # Static Assets
│   ├── vite.svg
│   └──react.svg
├── src/
│   ├── components/             # Reusable Components
│   ├── constants/              # Constants
│   ├── hooks/                  # Custom Hooks
│   ├── pages/                  # Page Components
│   ├── services/               # API Services
│   │   └── api.ts
│   ├── store/                  # State Management
│   │   └── userStore.ts
│   ├── styles/                 # Global Styles
│   │   ├── _tokens.scss
│   │   ├── global.css
│   │   ├── global.css.map
│   │   ├── global.scss
│   │   ├── typography.css
│   │   ├── typography.css.map
│   │   └── typography.scss
│   ├── types/                  # TypeScript Type Definitions
│   ├── utils/                  # Utility Functions
│   ├── App.css
│   ├── index.css
│   ├── routes.js
│   ├── App.jsx
│   └── root.jsx                # Main Entry Point
├── tests/                      # Tests and Test Files
├── .env.example                # Environment Variables Example
├── .gitignore
├── index.html
├── eslint.config.js
├── prettier.config.mjs
├── vite.config.js
├── package.json
├── tsconfig.json
├── AGENTS.md
├── README.md
├── react-router.config.ts
└── tailwind.config.ts
```

## Development Guidelines

### Component Development Standards

1. **Function Components First**: Use function components and Hooks
2. **TypeScript Types**: Define interfaces for all props
3. **Component Naming**: Use PascalCase, file name matches component name
4. **Single Responsibility**: Each component handles only one functionality

```tsx
// Example: Button Component
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size = 'medium',
  disabled = false,
  onClick,
  children
}) => {
  return (
    <button className={`btn btn-${variant} btn-${size}`} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};
```

### State Management Standards

Using Zustand for state management:

```tsx
// store/userStore.ts
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setLoading: (isLoading) => set({ isLoading })
}));
```

### API Service Standards

```tsx
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
```

## Environment Setup

### Development Requirements

- Node.js >= 19.0.0
- yarn >= 1.22.0

### Installation Steps

```bash
# 1. Create project
yarn create vite@latest dev_website -- --template react-ts

# 2. Navigate to project directory
cd my-react-app

# 3. Install dependencies
yarn install

# 4. Install additional dependencies
npm install zustand react-router-dom axios
npm install -D @types/node

# 5. Start development server
npm run dev
```

### Environment Variables Configuration

```env
# .env.local
VITE_API_URL=http://localhost:3001/api
VITE_APP_TITLE=My React App
VITE_ENABLE_MOCK=false
```

## Routing Configuration

```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## Testing Strategy

### Unit Testing Example

```tsx
// Example: tests/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../src/components/Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <Button variant="primary" onClick={handleClick}>
        Click me
      </Button>
    );

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Performance Optimization

### Code Splitting Example

```tsx
// Example: Code Splitting
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

### Memory Optimization Example

```tsx
// Example: Memory Optimization
import { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map((item) => ({ ...item, processed: true }));
  }, [data]);

  const handleUpdate = useCallback(
    (id) => {
      onUpdate(id);
    },
    [onUpdate]
  );

  return (
    <div>
      {processedData.map((item) => (
        <div key={item.id} onClick={() => handleUpdate(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});
```

## Deployment Configuration

### Build Production Version

```bash
yarn run build
```

### Vite Configuration Optimization

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
```

## Common Issues

### Issue 1: Vite Development Server Slow Startup

**Solution**:

- Check dependency pre-build cache
- Use `yarn run dev -- --force` to force rebuild
- Optimize optimizeDeps configuration in vite.config.ts

### Issue 2: TypeScript Type Errors

**Solution**:

- Ensure correct type definition packages are installed
- Check tsconfig.json configuration
- Use `yarn run type-check` for type checking

## Reference Resources

- [React Official Documentation](https://react.dev/)
- [Vite Official Documentation](https://vitejs.dev/)
- [TypeScript Official Documentation](https://www.typescriptlang.org/)
- [React Router Documentation](https://reactrouter.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
