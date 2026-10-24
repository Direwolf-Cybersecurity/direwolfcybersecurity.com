export interface NavLink {
  label: string;
  href: string;
}

/** Header navigation, in order. */
export const primaryNav: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services/' },
  { label: 'Platform', href: '/platform/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

/** Footer "Company" column. */
export const companyNav: NavLink[] = [
  { label: 'About us', href: '/about/' },
  { label: 'Services', href: '/services/' },
  { label: 'Platform', href: '/platform/' },
  { label: 'Contact', href: '/contact/' },
];

/** Footer "Trust" column. Legal documents come from the content collection. */
export const trustNav: NavLink[] = [
  { label: 'Security and responsible disclosure', href: '/security/' },
  { label: 'Compliance', href: '/compliance/' },
  { label: 'security.txt', href: '/.well-known/security.txt' },
];

/** True when `href` is the current page or a parent section of it. */
export function isCurrent(href: string, pathname: string): boolean {
  const normalize = (p: string) => (p.endsWith('/') ? p : `${p}/`);
  const target = normalize(href);
  const current = normalize(pathname);
  if (target === '/') return current === '/';
  return current.startsWith(target);
}
