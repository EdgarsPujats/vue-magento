export interface SmartPriceState {
  smartPrices: SmartPrice[]
}

export interface SmartPrice {
  productId: number,
  smartPrice: SmartPriceData
}

export enum PriceStates {
  Best = 'best',
  Low = 'lower'
}
export interface SmartPriceData {
  already_best_price: boolean,
  best_price?: number,
  best_price_status?: PriceStates,
  best_seller_id?: number,
  cooldown_at?: number,
  expires_at?: number
}
