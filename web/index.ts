// Library exports for npm publishing
// Re-export platform-specific components
export { Container } from './src/ui/Container';
export { Text } from './src/ui/Text';

// Re-export shared components (they import from @platform internally)
export { LargeComponent } from '../shared/components/LargeComponent';

