/** Find component display name */
export function getDisplayName(component) {
  return component.name || component.displayName || '<COMPONENT>';
}
