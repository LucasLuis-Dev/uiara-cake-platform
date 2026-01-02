import { Size, CoverageType } from '@prisma/client';

interface PriceTable {
  size: Size;
  diameterCm: number;
  weightKg: number;
  chantillyPrice: number;
  ganachePrice: number;
}

export const PRICE_TABLE: PriceTable[] = [
  { size: 'PP', diameterCm: 14, weightKg: 1, chantillyPrice: 140, ganachePrice: 170 },
  { size: 'P', diameterCm: 16, weightKg: 1.5, chantillyPrice: 195, ganachePrice: 195 },
  { size: 'M', diameterCm: 18, weightKg: 2, chantillyPrice: 275, ganachePrice: 340 },
  { size: 'G', diameterCm: 20, weightKg: 3, chantillyPrice: 355, ganachePrice: 510 },
  { size: 'GG', diameterCm: 22, weightKg: 4, chantillyPrice: 470, ganachePrice: 470 },
];

export function calculatePrice(size: Size, coverageType: CoverageType): number {
  const product = PRICE_TABLE.find(p => p.size === size);
  if (!product) {
    throw new Error(`Invalid size: ${size}`);
  }
  return coverageType === 'CHANTILLY' ? product.chantillyPrice : product.ganachePrice;
}

export function getSpecifications(size: Size) {
  const product = PRICE_TABLE.find(p => p.size === size);
  if (!product) {
    throw new Error(`Invalid size: ${size}`);
  }
  return {
    diameterCm: product.diameterCm,
    weightKg: product.weightKg,
  };
}

export function calculateAdvanceNotice(deliveryDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const delivery = new Date(deliveryDate);
  delivery.setHours(0, 0, 0, 0);
  
  const diffTime = delivery.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

export function validateAdvanceNotice(deliveryDate: Date): boolean {
  return calculateAdvanceNotice(deliveryDate) >= 2;
}
