
import { create } from 'zustand'
import { Card, Category, Stream, PurchaseCard, AccessGrant, PassPlanKey } from './types'
import { logCardPurchase } from '../services/appsFlyer'

type State = {
  lang: 'ru'|'en'|'es'|'de';
  setLang: (l: State['lang']) => void;

  categories: Category[];
  cards: Card[];
  streams: Stream[];

  purchases: PurchaseCard[];
  access: AccessGrant[];

  buyCard: (cardId: number) => Promise<void>;
  chargeCardName: (cardId: number, name: string) => void;
  grantStreamAccess: (streamId: number, plan: PassPlanKey) => Promise<void>;
}

const now = () => Date.now();

export const useApp = create<State>((set, get) => ({
  lang: 'en',
  setLang: (l) => set({lang: l}),

  categories: [
    {id:1, code:'love', name:'Любовь'},
    {id:2, code:'wealth', name:'Изобилие'},
    {id:3, code:'luck', name:'Удача'},
    {id:4, code:'health', name:'Здоровье'},
  ],
  cards: [
    {id: 101, categoryId: 1, code: 'find_love', title: 'Найти любовь', intensityPct: 82, priceUSD: 4.99},
    {id: 102, categoryId: 1, code: 'bond_spouse', title: 'Укрепить связь с супругом', intensityPct: 85, priceUSD: 5.49},
    {id: 201, categoryId: 2, code: 'fin_discipline', title: 'Финансовая дисциплина', intensityPct: 79, priceUSD: 4.59},
  ],
  streams: [
    {id: 301, categoryId: 2, code:'financial_clarity', title: 'Финансовая ясность'},
    {id: 302, categoryId: 4, code:'sleep_restore', title: 'Восстановление сна'},
  ],

  purchases: [],
  access: [],

  buyCard: async (cardId: number) => {
    await new Promise(r => setTimeout(r, 600));
    logCardPurchase(cardId);

    // Find the card to get its details for AppsFlyer logging
    const state = get();
    const card = state.cards.find(c => c.id === cardId);
    console.log(card,'ca111111111111111111111111rd');
    
    if (card) {
      // Log AppsFlyer card purchase event
    }
    
    set((s) => ({purchases: [...s.purchases, {cardId, purchasedAt: now(), readyAt: now()+60*60*1000}]}))
  },
  chargeCardName: (cardId: number, name: string) => {
    set((s) => ({purchases: s.purchases.map(p => p.cardId===cardId? {...p, chargedName: name}: p)}));
  },
  grantStreamAccess: async (streamId: number, plan: PassPlanKey) => {
    const durations = {hour:3600, day:86400, week:604800, month:2592000, year:31536000};
    await new Promise(r => setTimeout(r, 600));
    const ends = now() + durations[plan]*1000;
    set((s) => ({access: [...s.access, {streamId, endsAt: ends}]}));
  },
}));
