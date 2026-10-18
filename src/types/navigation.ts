/**
 * Definizioni di tipo TypeScript per menu di navigazione, città e link social.
 */

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  external?: boolean;
}

export interface CityNavItem {
  slug: string;
  name: string;
  cupName: string;
  badgeUrl?: string;
  active: boolean;
}

export interface PartnerTier {
  tierName: string;
  partnerName: string;
  logoUrl: string;
  linkUrl?: string;
}
