export const routeParam = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? String(value[0] ?? '') : String(value ?? '');
