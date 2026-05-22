export interface UserData {
  email: string;
  roles: string[];
  language: string;
  company: string; // companyUuid
}

export interface CompanyDto {
  uuid: string;
  name: string;
  defaultLanguageCode: string;
  defaultCurrencyIsoCode: string;
}

export interface LocationFlatDto {
  uuid: string;
  name: string;
  path: string;
  parentLocationUuid?: string;
  countryIso?: string;
}

export interface ProductVariantFlatDto {
  uuid: string;           // productVariantUnit UUID
  productUuid: string;
  variantUuid: string;    // productVariant UUID
  name: string;
  variantName: string;
  sku: string;
  barcode: string;
  unitUuid: string;
  unitPrice: string;
  vatIncluded: boolean;
  languageCode: string;
  currencyIsoCode: string;
}

export interface CustomerDto {
  uuid: string;
  lastName?: string;
  firstName?: string;
  company?: string;
  entityType: 'company' | 'individual';
  customerNumber?: string;
}

export interface PaymentMethodDto {
  uuid: string;
  default: boolean;
  names: { name: string; languageCode: string }[];
}

export interface OrderStatusDto {
  uuid: string;
  initialStatus?: boolean;
  completedStatus?: boolean;
  cancelledStatus?: boolean;
  partialStatus?: boolean;
  pickListStatus?: boolean;
  systemStatus?: boolean;
  names: { name: string; languageCode: string }[];
}

export interface ProductProfileDto {
  uuid: string;
  name: string;
  default: boolean;
}

export interface LineItemDto {
  uuid: string;
  type: string;
  sku: string;
  barcode: string;
  quantity: string;
  unitPrice: string;
  subTotal: string;
  totalGross: string;
  totalNet: string;
  totalVat: string;
  vat?: { rate?: number; name?: string };
  discounts?: { discount: string }[];
}

export interface OrderVatDto {
  vatUuid: string;
  vatName: string;
  amount: string;
}

export interface OrderDto {
  uuid: string;
  name: string;
  documentNumber: string;
  totalNet: string;
  totalGross: string;
  totalDiscount: string;
  totalVats: OrderVatDto[];
  lineItems: LineItemDto[];
  customerUuid?: string;
  currencyIso: string;
}

export interface LocalLineItem {
  id: string;                     // productVariantUnit UUID (dedup key)
  productVariantUuid: string;
  productVariantUnitUuid: string;
  name: string;
  sku: string;
  unitPrice: string;
  quantity: number;
}

export type Screen =
  | 'login'
  | 'station_select'
  | 'sale'
  | 'customer_picker'
  | 'payment_select'
  | 'card_payment'
  | 'cash_payment'
  | 'receipt';

export type PaymentType = 'card' | 'cash' | 'invoice';

export interface SaleState {
  name: string;
  lineItems: LocalLineItem[];
  customer: CustomerDto | null;
  preview: OrderDto | null;
  previewLoading: boolean;
  lastScannedId: string | null;
  completedOrder: OrderDto | null;
  paymentType: PaymentType | null;
}
