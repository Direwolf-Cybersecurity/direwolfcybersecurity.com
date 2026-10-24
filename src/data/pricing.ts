/**
 * Pricing shown on the website.
 *
 * Mitch: this is the only file to edit when prices are known. Set `priceUsd` to a number to
 * display it; leave it `null` to show "Contact us for pricing". Prices here are informational.
 * The prices charged at checkout live in Stripe and are managed from the platform
 * (PLAN.md section 14.4 in the platform repository), so keep the two in step.
 *
 * Product names stay vendor-neutral until the partner agreements are signed
 * (docs/claims-register.md rule 5, rows V1/V2). Do not add "licensed through Direwolf" or a
 * vendor name here before those rows flip.
 */

export type PriceModel = 'per-endpoint-month' | 'per-org-month' | 'one-time' | 'custom';

export type ProductId =
  'ai-soc' | 'endpoint-protection' | 'endpoint-management' | 'compliance-guidance';

export interface Product {
  id: ProductId;
  name: string;
  model: PriceModel;
  /** List price in US dollars, or null for "contact us". */
  priceUsd: number | null;
  /** Shown next to the price, e.g. minimum terms. Keep factual. */
  note?: string;
}

export const products: Product[] = [
  {
    id: 'ai-soc',
    name: 'Direwolf AI SOC',
    model: 'per-endpoint-month',
    priceUsd: null,
  },
  {
    id: 'endpoint-protection',
    name: 'Managed endpoint protection',
    model: 'per-endpoint-month',
    priceUsd: null,
  },
  {
    id: 'endpoint-management',
    name: 'Endpoint management',
    model: 'per-endpoint-month',
    priceUsd: null,
  },
  {
    id: 'compliance-guidance',
    name: 'NIST SP 800-171 / CMMC guidance',
    model: 'custom',
    priceUsd: null,
  },
];

const unitLabel: Record<PriceModel, string> = {
  'per-endpoint-month': 'per endpoint per month',
  'per-org-month': 'per organization per month',
  'one-time': 'one-time',
  custom: 'scoped per engagement',
};

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** "Contact us for pricing" or "$12 per endpoint per month". */
export function formatPrice(product: Product): string {
  if (product.priceUsd === null) return 'Contact us for pricing';
  return `${usd.format(product.priceUsd)} ${unitLabel[product.model]}`;
}

export function getProduct(id: ProductId): Product {
  const product = products.find((p) => p.id === id);
  if (!product) throw new Error(`Unknown product: ${id}`);
  return product;
}
