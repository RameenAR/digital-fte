// ─── Checkout types for 004-checkout-flow ────────────────────────────────────

export type ProvinceCode =
  | 'punjab'
  | 'sindh'
  | 'kpk'
  | 'balochistan'
  | 'ict'
  | 'ajk'
  | 'gilgit-baltistan'

export const PROVINCE_LABELS: Record<ProvinceCode, string> = {
  punjab: 'Punjab',
  sindh: 'Sindh',
  kpk: 'Khyber Pakhtunkhwa',
  balochistan: 'Balochistan',
  ict: 'Islamabad Capital Territory',
  ajk: 'AJK',
  'gilgit-baltistan': 'Gilgit-Baltistan',
}

export interface CustomerInfo {
  fullName: string
  email: string
  phone: string
  streetAddress: string
  city: string
  province: ProvinceCode
  postalCode: string
}

export interface OrderLineItem {
  productId: string
  name: string
  imageUrl: string
  unitPrice: number
  quantity: number
  lineSubtotal: number
}

export interface Order {
  orderNumber: string
  placedAt: string
  customerInfo: CustomerInfo
  lineItems: OrderLineItem[]
  grandTotal: number
}

export interface CheckoutState {
  customerInfo: CustomerInfo | null
  completedOrder: Order | null
}

export type CheckoutAction =
  | { type: 'SET_CUSTOMER_INFO'; payload: CustomerInfo }
  | { type: 'SET_COMPLETED_ORDER'; payload: Order }
  | { type: 'CLEAR_CHECKOUT' }

export type ValidationErrors = Partial<Record<keyof CustomerInfo, string>>

export const CHECKOUT_STORAGE_KEY = 'lumiere_checkout'
