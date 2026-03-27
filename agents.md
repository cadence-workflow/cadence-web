# Cadence Web UI - Development Guidelines for AI Agents

This document provides comprehensive guidelines for AI agents working with the Cadence Web UI codebase. It outlines the established patterns, conventions, and architectural decisions to ensure consistent and maintainable code.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture Patterns](#architecture-patterns)
- [File Organization](#file-organization)
- [Component Patterns](#component-patterns)
- [Route Handler Patterns](#route-handler-patterns)
- [URL Params and Encoding](#url-params-and-encoding)
- [TypeScript Conventions](#typescript-conventions)
- [Styling Patterns](#styling-patterns)
- [Configuration Patterns](#configuration-patterns)
- [Testing Patterns](#testing-patterns)
- [Utility Patterns](#utility-patterns)
- [Hook Patterns](#hook-patterns)
- [Error Handling](#error-handling)
- [Performance Considerations](#performance-considerations)

## Project Overview

Cadence Web UI is a Next.js 14 application built with TypeScript, React 18, and BaseUI. It provides a web interface for viewing and managing Cadence workflows, domains, and task lists.

### Key Technologies
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Library**: BaseUI (Uber's design system)
- **Styling**: Styletron (CSS-in-JS)
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Jest with React Testing Library
- **Build Tool**: Webpack (via Next.js)

## Architecture Patterns

### 1. App Router Structure
The application uses Next.js App Router with the following structure:
```
src/app/
├── (Home)/           # Route groups
├── api/              # API routes
├── layout.tsx        # Root layout
├── page.tsx          # Home page
└── not-found.tsx     # 404 page
```

### 2. Feature-Based Organization
Components and views are organized by feature rather than by type:
```
src/
├── components/       # Reusable abstract UI components (design system)
├── views/           # Page-level components
│   └── shared/      # Business logic components for Cadence objects
├── route-handlers/  # API route handlers
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
└── config/          # Configuration files
```

### 3. Component Directory Distinction

**`src/components/`** - Reusable Abstract Components:
- Generic UI components that are framework-agnostic
- Design system components (buttons, inputs, tables, etc.)
- Components that can be used across different domains
- No business logic or Cadence-specific functionality
- Examples: `Button`, `Table`, `PageSection`, `ErrorBoundary`

**`src/views/shared/`** - Reusable Business Logic Components:
- Components with Cadence-specific business logic
- Components that fetch and render Cadence objects (workflows, domains, etc.)
- Components that understand Cadence data structures
- Components that integrate with Cadence APIs
- Examples: `WorkflowStatusTag`, `DomainStatusTag`, `WorkflowActions`

```typescript
// src/components/ - Abstract, reusable
export default function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

// src/views/shared/ - Business logic, Cadence-specific
export default function WorkflowStatusTag({ 
  status, 
  isArchived 
}: WorkflowStatusTagProps) {
  const statusConfig = getWorkflowStatusConfig(status, isArchived);
  return <StatusTag {...statusConfig} />;
}
```

## File Organization

### 1. Component Structure
Each component follows a consistent file structure:

```
component-name/
├── component-name.tsx           # Main component
├── component-name.types.ts      # TypeScript types
├── component-name.styles.ts     # Styled components
├── __tests__/                   # Test files
│   └── component-name.test.tsx
└── __fixtures__/                # Test fixtures (if needed)
    └── component-name.fixtures.ts
```

### 2. Naming Conventions
- **Files**: kebab-case (`component-name.tsx`)
- **Components**: PascalCase (`ComponentName`)
- **Types**: PascalCase with descriptive suffixes (`ComponentProps`, `ComponentConfig`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_TIMEOUT_SECONDS`)
- **Functions**: camelCase (`getComponentData`)

### 3. Directory Nesting Limits
Limit directory nesting to maintain a clean and navigable codebase structure. Maximum nesting levels:

**`src/views/`** - Two levels maximum:
```
src/views/
├── domain-page/                    # Level 1: Page
│   ├── domain-page-header/         # Level 2: Page component
│   │   ├── domain-page-header.tsx
│   │   ├── domain-page-header.types.ts
│   │   └── __tests__/              # Level 3: Tests (allowed)
│   │       └── domain-page-header.test.tsx
│   └── domain-page-tabs/
│       ├── domain-page-tabs.tsx
│       └── __tests__/
│           └── domain-page-tabs.test.tsx
└── workflow-page/
    ├── workflow-page-header/
    └── workflow-page-tabs/
```

**`src/components/`** - Two levels maximum:
```
src/components/
├── table/                          # Level 1: Component
│   ├── table.tsx
│   ├── table.types.ts
│   ├── table-head-cell/            # Level 2: Sub-component
│   │   ├── table-head-cell.tsx
│   │   └── __tests__/              # Level 3: Tests (allowed)
│   │       └── table-head-cell.test.tsx
│   └── table-body-cell/
│       ├── table-body-cell.tsx
│       └── __tests__/
│           └── table-body-cell.test.tsx
└── button/
    ├── button.tsx
    └── __tests__/
        └── button.test.tsx
```

**Guidelines:**
- **Level 1**: Main feature/page/component directories
- **Level 2**: Sub-components, utilities, or related files
- **Level 3**: Only `__tests__/` directories are allowed at this level
- **Avoid**: Deeper nesting that makes navigation difficult
- **Refactor**: If you need more than 3 levels, consider splitting into separate features or components

## Component Patterns

### 1. Component Definition
```typescript
import React from 'react';
import { styled } from './component-name.styles';
import { type Props } from './component-name.types';

export default function ComponentName({ prop1, prop2 }: Props) {
  return (
    <styled.Container>
      {/* Component content */}
    </styled.Container>
  );
}
```

### 2. Props Interface
```typescript
export type Props = {
  requiredProp: string;
  optionalProp?: number;
  children?: React.ReactNode;
};
```

### 3. Styled Components
```typescript
import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  Container: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale500,
  })),
};
```

### 4. Component Composition
- Use composition over inheritance
- Prefer render props and children patterns
- Keep components focused and single-purpose
- Use TypeScript generics for reusable components

## Route Handler Patterns

### 1. Handler Structure
```typescript
import { type NextRequest, NextResponse } from 'next/server';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import { type Context, type RequestParams } from './handler-name.types';
import requestBodySchema from './schemas/request-body-schema';

export async function handlerName(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const requestBody = await request.json();
  const { data, error } = requestBodySchema.safeParse(requestBody);

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid values provided',
        validationErrors: error.errors,
      },
      { status: 400 }
    );
  }

  const params = requestParams.params; // Next.js already decodes route params—do not decode again

  try {
    const response = await ctx.grpcClusterMethods.someMethod({
      // Method parameters from params
    });

    return NextResponse.json(response);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, error: e },
      'Error description'
    );

    return NextResponse.json(
      {
        message: e instanceof GRPCError ? e.message : 'Error message',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
```

### 2. Validation Patterns
- Use Zod schemas for request validation
- Validate both request body and URL parameters
- Return structured error responses with validation details

### 3. Error Handling
- Use structured error logging with context
- Handle gRPC errors specifically
- Return appropriate HTTP status codes
- Include error causes for debugging

## URL Params and Encoding

Next.js App Router provides **already decoded** `params` and `searchParams` to API route handlers, pages, and layouts. Dynamic segment and catch-all values are decoded once by the framework.

- **Do not** call `decodeUrlParams()` or `decodeURIComponent()` on `requestParams.params`, `options.params`, or page/layout `params`. Doing so double-decodes and can cause `URIError` or corrupted values (e.g. task list names containing `%` or `@`).
- **Do** use `encodeURIComponent()` when building URLs from user input (e.g. before `href`, `router.push()`, or `fetch(url)`).
- **Rule of thumb:** If the value comes from Next.js (route handler `params`, page `params`, or `searchParams`), treat it as already decoded.

## TypeScript Conventions

### 1. Type Definitions
```typescript
// Use descriptive type names
export type WorkflowExecutionStatus = 'RUNNING' | 'COMPLETED' | 'FAILED';

// Use generics for reusable types
export type ListTableItem<T extends object> = {
  key: string;
  label: string;
  renderValue: React.ComponentType<T> | ((props: T) => React.ReactNode);
};

// Use utility types
export type Props<T extends object> = {
  data: T;
  config: Array<ListTableItem<T>>;
};
```

### 2. Interface vs Type
- Use `type` for unions, intersections, and computed types
- Use `interface` for object shapes that might be extended
- Prefer `type` for most cases in this codebase

### 3. Generic Constraints
```typescript
// Use meaningful constraints
export default function Table<T extends object, C extends TableConfig<T>>({
  data,
  columns,
}: Props<T, C>) {
  // Implementation
}
```

## Styling Patterns

### 1. Styled Components Structure
```typescript
import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Container: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      gap: $theme.sizing.scale500,
      // Use theme values consistently
    })
  ),
};
```

### 2. Theme Usage
- Always use theme values for spacing, colors, and typography
- Use `$theme.sizing.scale*` for consistent spacing
- Use `$theme.colors.*` for colors
- Use `$theme.typography.*` for text styles

### 3. Responsive Design
```typescript
// Use media queries from theme
{
  [$theme.mediaQuery.medium]: {
    flexDirection: 'row',
  },
}
```

## Configuration Patterns

### 1. Dynamic Configuration
```typescript
// config/dynamic/dynamic.config.ts
const dynamicConfigs: {
  FEATURE_FLAG: ConfigAsyncResolverDefinition<
    FeatureFlagParams,
    boolean,
    'request',
    true
  >;
} = {
  FEATURE_FLAG: {
    resolver: featureFlagResolver,
    evaluateOn: 'request',
    isPublic: true,
  },
};
```

### 2. Environment Variables
- Use descriptive names with `CADENCE_` prefix
- Provide sensible defaults
- Document all environment variables in README.md

### 3. Feature Flags
- Use environment variables for simple flags
- Use dynamic config for complex feature toggles
- Make feature flags public when needed for client-side logic

## Testing Patterns

### 1. Test File Naming Conventions

**Browser Tests** (`.test.tsx`):
- All React components and UI-related functionality
- Client-side utilities and hooks
- Browser-specific APIs and features
- User interactions and DOM manipulation

**Server Tests** (`.node.ts`):
- API route handlers
- Server-side utilities
- Node.js-specific modules
- Modules that use Node.js APIs (fs, path, etc.)

```typescript
// Browser test example: component.test.tsx
import React from 'react';
import { render, screen } from '@/test-utils/rtl';
import ComponentName from '../component-name';

describe(ComponentName.name, () => {
  it('should render correctly', () => {
    // Browser test logic
  });
});

// Server test example: utility.node.ts
import utilityFunction from '../utility-function';

describe('utilityFunction', () => {
  it('should handle server-side logic', () => {
    // Server test logic
  });
});
```

**Default Rule**: Use `.test.tsx` unless the code is specifically server-only or uses Node.js APIs.

### 2. Running Individual Tests
To run a single test file for validation during development:

**Browser Tests** (`.test.tsx`):
```bash
npm run test:unit:browser {fileName}
```

**Server Tests** (`.node.ts`):
```bash
npm run test:unit:node {fileName}
```

**Examples:**
```bash
# Run a specific browser test
npm run test:unit:browser cron-schedule-input.test.tsx

# Run a specific server test
npm run test:unit:node cron-validate.node.ts

# Run all browser tests
npm run test:unit:browser

# Run all server tests
npm run test:unit:node
```

### 3. Test Structure
```typescript
import React from 'react';
import { render, screen, userEvent } from '@/test-utils/rtl';

import ComponentName from '../component-name';

describe(ComponentName.name, () => {
  it('should render correctly', () => {
    setup({});
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const { user, mockHandler } = setup({});
    
    await user.click(screen.getByRole('button'));
    
    expect(mockHandler).toHaveBeenCalledWith(expectedArgs);
  });
});

function setup(props: Partial<Props>) {
  const mockHandler = jest.fn();
  const user = userEvent.setup();
  
  render(<ComponentName {...props} onAction={mockHandler} />);
  
  return { user, mockHandler };
}
```

### 4. Setup Method Best Practices
**Always use a `setup` function when tests share common initialization steps.** This pattern provides:

**Benefits:**
- **Consistency**: Ensures all tests use the same initialization logic
- **Maintainability**: Changes to setup logic only need to be made in one place
- **Readability**: Tests focus on behavior rather than setup boilerplate
- **Flexibility**: Easy to override defaults for specific test cases

**When to Use Setup:**
- Multiple tests need similar steps
- Tests require mock handlers or event handlers
- Tests need userEvent instances for interactions
- Tests share common prop configurations
- Tests need error boundary or provider setup

**Setup Function Responsibilities:**
```typescript
function setup(props: Partial<Props> = {}) {
  // 1. Create mock handlers
  const mockHandler = jest.fn();
  const mockErrorHandler = jest.fn();
  
  // 2. Setup userEvent instance
  const user = userEvent.setup();
  
  // 3. Provide default props with overrides
  const defaultProps: Props = {
    title: 'Default Title',
    isEnabled: true,
    onAction: mockHandler,
    onError: mockErrorHandler,
    ...props, // Allow test-specific overrides
  };
  
  // 4. Render component with providers if needed
  render(
    <ErrorBoundary onError={mockErrorHandler}>
      <ComponentName {...defaultProps} />
    </ErrorBoundary>
  );
  
  // 5. Return commonly used test utilities
  return {
    user,
    mockHandler,
    mockErrorHandler,
    // Return screen for convenience
    screen,
  };
}
```

**Usage Examples:**
```typescript
describe(ComponentName.name, () => {
  it('should render with default props', () => {
    setup(); // Uses all defaults
    
    expect(screen.getByText('Default Title')).toBeInTheDocument();
  });

  it('should render with custom props', () => {
    setup({ title: 'Custom Title', isEnabled: false });
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should handle user interactions', async () => {
    const { user, mockHandler } = setup();
    
    await user.click(screen.getByRole('button'));
    
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
```

### 5. Test Utilities
- Use custom test utilities from `@/test-utils/rtl`
- Create setup functions for complex test scenarios
- Use fixtures for test data
- Mock external dependencies appropriately

### 6. Test Coverage
- Test user interactions, not implementation details
- Test error states and edge cases
- Use descriptive test names
- Group related tests with `describe` blocks

### 7. Component Mocking
Mock child components in unit tests to isolate the parent component's behavior and allow for flexible testing of sub-behaviors in forks:

```typescript
import React from 'react';
import { render, screen } from '@/test-utils/rtl';

// Mock child components
jest.mock('../child-component', () => {
  return function MockChildComponent({ onAction, data }: any) {
    return (
      <div data-testid="mock-child-component">
        <button onClick={() => onAction(data)}>Mock Action</button>
      </div>
    );
  };
});

import ParentComponent from '../parent-component';

describe(ParentComponent.name, () => {
  it('should handle child component interactions', () => {
    const mockHandler = jest.fn();
    render(<ParentComponent onAction={mockHandler} />);
    
    // Test parent component behavior without depending on child implementation
    expect(screen.getByTestId('mock-child-component')).toBeInTheDocument();
  });
});
```

**Benefits of Component Mocking:**
- **Isolation**: Test parent component logic independently of child component implementation
- **Flexibility**: Allow forks to modify child component behavior without breaking parent tests
- **Performance**: Faster test execution by avoiding complex child component rendering
- **Maintainability**: Reduce test brittleness when child components change
- **Focus**: Concentrate on testing the specific behavior of the component under test

## Utility Patterns

### 1. Utility Function Structure
```typescript
/**
 * Brief description of what the function does.
 *
 * @param param1 - Description of parameter
 * @param param2 - Description of parameter
 * @returns Description of return value
 */
export default function utilityFunction<T>(
  param1: string,
  param2: T
): ReturnType {
  // Implementation with proper error handling
  try {
    // Logic here
    return result;
  } catch (error) {
    logger.warn({ param1, param2, error }, 'Utility function failed');
    return defaultValue;
  }
}
```

### 2. Error Handling in Utilities
- Use structured logging with context
- Return sensible defaults when possible
- Don't throw errors unless absolutely necessary
- Use TypeScript for type safety

### 3. Generic Utilities
```typescript
// Use generics for reusable utilities
export default function processArray<T, R>(
  array: T[],
  processor: (item: T) => R
): R[] {
  return array.map(processor);
}
```

## Hook Patterns

### 1. Custom Hook Structure
```typescript
import { useCallback, useState, useMemo } from 'react';
import { type Props, type ReturnType } from './hook-name.types';

export default function useHookName<T>({
  initialValue,
  options,
}: Props<T>): ReturnType<T> {
  const [state, setState] = useState(initialValue);
  
  const computedValue = useMemo(() => {
    // Expensive computation
    return processState(state);
  }, [state]);
  
  const handler = useCallback((newValue: T) => {
    setState(newValue);
  }, []);
  
  return {
    state,
    computedValue,
    handler,
  };
}
```

### 2. Hook Types
```typescript
export type Props<T> = {
  initialValue: T;
  options?: HookOptions;
};

export type ReturnType<T> = {
  state: T;
  computedValue: ProcessedValue<T>;
  handler: (value: T) => void;
};
```

### 3. Hook Best Practices
- Use TypeScript generics for reusable hooks
- Memoize expensive computations
- Use `useCallback` for event handlers
- Return objects for multiple values
- Provide clear prop and return types

## Error Handling

### 1. Error Boundaries
```typescript
import { ErrorBoundary } from 'react-error-boundary';

export default function ErrorBoundaryWrapper({ children }: Props) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        logger.error({ error, errorInfo }, 'Component error boundary triggered');
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### 2. Structured Logging
```typescript
// Use structured logging with context
logger.error<RouteHandlerErrorPayload>(
  { requestParams, error, userId },
  'Descriptive error message'
);
```

### 3. Error Types
```typescript
// Define specific error types
export class ValidationError extends Error {
  constructor(message: string, public validationErrors: ValidationError[]) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

## Performance Considerations

### 1. Code Splitting
- Use dynamic imports for large components
- Implement route-based code splitting
- Lazy load non-critical features

### 2. Memoization
```typescript
// Use React.memo for expensive components
export default React.memo(function ExpensiveComponent({ data }: Props) {
  // Component implementation
});

// Use useMemo for expensive calculations
const processedData = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

### 3. Virtualization
- Use `react-virtuoso` for large lists
- Implement virtual scrolling for tables
- Consider pagination for large datasets

### 4. Bundle Optimization
- Use tree shaking effectively
- Minimize bundle size with proper imports
- Use dynamic imports for optional features

## Best Practices Summary

1. **Consistency**: Follow established patterns throughout the codebase
2. **Type Safety**: Use TypeScript effectively with proper types and generics
3. **Error Handling**: Implement comprehensive error handling and logging
4. **Testing**: Write meaningful tests that focus on user behavior
5. **Performance**: Consider performance implications of all changes
6. **Documentation**: Document complex logic and architectural decisions
7. **Accessibility**: Ensure components are accessible and follow WCAG guidelines
8. **Security**: Validate all inputs and handle sensitive data appropriately

## Common Pitfalls to Avoid

1. **Don't** bypass TypeScript types with `any`
2. **Don't** create components without proper error boundaries
3. **Don't** ignore performance implications of re-renders
4. **Don't** hardcode values that should come from configuration
5. **Don't** skip validation for user inputs
6. **Don't** forget to handle loading and error states
7. **Don't** create overly complex components - split them up
8. **Don't** ignore accessibility requirements

This document should be updated as new patterns emerge and existing patterns evolve. Always refer to the existing codebase for the most current examples of these patterns in practice.
