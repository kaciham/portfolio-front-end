# Loader Implementation Guide

This implementation provides a comprehensive loading state management system for your React application while waiting for backend responses.

## Components

### 1. Enhanced Loader Component (`src/components/Loader.js`)

The `Loader` component now supports multiple types and configurations:

```jsx
<Loader type="spinner" size="large" color="blue" />
<Loader type="dots" size="medium" />
<Loader type="pulse" size="small" />
<Loader /> // Default loader
```

**Props:**
- `type`: 'spinner', 'dots', 'pulse', 'default'
- `size`: 'small', 'medium', 'large'
- `color`: 'blue', 'white', 'gray'

### 2. LoadingWrapper Component (`src/components/LoadingWrapper.js`)

A wrapper component that conditionally renders loading state or content:

```jsx
<LoadingWrapper 
  isLoading={isLoading}
  loadingMessage="Chargement des données..."
  loaderType="spinner"
  loaderSize="large"
>
  <YourContent />
</LoadingWrapper>
```

### 3. Loading Hooks (`src/hooks/useLoading.js`)

Custom hooks for managing loading states:

```jsx
// Single loading state
const { isLoading, startLoading, stopLoading, withLoading } = useLoading();

// Multiple loading states
const { 
  isLoading, 
  startLoading, 
  stopLoading, 
  withLoading 
} = useMultipleLoading();

// Usage
const handleSubmit = async () => {
  try {
    const result = await withLoading('formSubmit', async () => {
      return await apiCall();
    }, 'Envoi en cours...');
  } catch (error) {
    // Handle error
  }
};
```

### 4. API Utilities (`src/api/apiCalls.js`)

Enhanced API call utilities with loading state management:

```jsx
import { getUserData, sendContactForm } from '../api/apiCalls';

// With loading callback
const handleFetch = async () => {
  const result = await getUserData((loading) => setIsLoading(loading));
  if (result.error) {
    // Handle error
  } else {
    // Handle success
  }
};
```

## Implementation Features

### 1. **Multiple Loader Types**
- **Spinner**: Classic rotating spinner
- **Dots**: Animated bouncing dots
- **Pulse**: Pulsing circle animation
- **Default**: Custom dots animation

### 2. **Loading State Management**
- Single loading state with `useLoading`
- Multiple concurrent loading states with `useMultipleLoading`
- Automatic loading state handling with `withLoading` wrapper

### 3. **Enhanced User Experience**
- Loading messages for different states
- Smooth transitions and animations
- Responsive design
- Overlay loading option

### 4. **Implementation in Home Component**

The Home component now uses:
- **Data Loading**: Shows spinner while fetching user data
- **Form Submission**: Shows small spinner in submit button
- **Section-specific Loading**: Different loaders for different sections
- **Error Handling**: Proper error states with user feedback

## Usage Examples

### Basic Loading State
```jsx
const [isLoading, setIsLoading] = useState(false);

return (
  <LoadingWrapper isLoading={isLoading} loadingMessage="Chargement...">
    <Content />
  </LoadingWrapper>
);
```

### API Call with Loading
```jsx
const { withLoading, isLoading } = useMultipleLoading();

const fetchData = async () => {
  try {
    await withLoading('data', async () => {
      const result = await apiCall();
      setData(result);
    }, 'Récupération des données...');
  } catch (error) {
    console.error(error);
  }
};

return (
  <LoadingWrapper 
    isLoading={isLoading('data')} 
    loaderType="dots"
  >
    <DataDisplay />
  </LoadingWrapper>
);
```

### Form Submission
```jsx
const handleSubmit = async () => {
  setIsSubmitting(true);
  try {
    await submitForm(data);
  } finally {
    setIsSubmitting(false);
  }
};

return (
  <button disabled={isSubmitting}>
    {isSubmitting ? <Loader type="spinner" size="small" /> : 'Submit'}
  </button>
);
```

## CSS Animations

Enhanced CSS animations are included in `App.css`:
- Smooth loader animations
- Loading overlay styles
- Responsive loader sizes
- Custom animation timing

## Benefits

1. **Improved UX**: Users see clear loading indicators
2. **Professional Look**: Smooth, modern animations
3. **Flexible**: Multiple loader types and configurations
4. **Reusable**: Components can be used throughout the app
5. **Performance**: Efficient state management
6. **Accessibility**: Clear loading states for screen readers

## Next Steps

1. **Add skeleton loading** for specific content areas
2. **Implement progress bars** for file uploads
3. **Add loading timeouts** with error fallbacks
4. **Create loading state persistence** across route changes