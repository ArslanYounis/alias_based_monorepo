/**
 * Public component names exported by both web (federation) and mobile (npm).
 * Each platform exports its own implementation for these names.
 */
export const PUBLIC_COMPONENT_NAMES = ["Layout"] as const;

export type PublicComponentName = (typeof PUBLIC_COMPONENT_NAMES)[number];
