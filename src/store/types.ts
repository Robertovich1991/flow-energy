
export type Lang = 'ru'|'en'|'es'|'de';

export type Category = { id: number; code: string; name: string; };
export type Subcategory = { id: number; categoryId: number; code: string; name: string; };

export type Card = {
  id: number; categoryId: number; subcategoryId?: number; code: string; title: string;
  intensityPct: number; priceUSD: number;
};

export type PurchaseCard = {
  cardId: number; purchasedAt: number; readyAt?: number; chargedName?: string;
}

export type Stream = { id: number; categoryId: number; code: string; title: string; };

export type PassPlanKey = 'hour'|'day'|'week'|'month'|'year';

export type AccessGrant = { streamId: number; endsAt?: number; };
