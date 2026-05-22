import type {
  CompanyDto, LocationFlatDto, ProductVariantFlatDto, CustomerDto,
  PaymentMethodDto, OrderStatusDto, ProductProfileDto, OrderDto,
} from './types';

const API_BASE = 'https://api.gabig.app';

function getToken(): string | null {
  const t = localStorage.getItem('token');
  return t ? JSON.parse(t) as string : null;
}

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string };
    throw Object.assign(new Error(err.message ?? res.statusText), { status: res.status });
  }
  return res.json() as Promise<T>;
}

export const api = {
  login: (email: string, password: string) =>
    req<{ token: string }>('/v1/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  getCompany: (uuid: string) =>
    req<CompanyDto>(`/v1/company/${uuid}`),

  listLocationsFlat: () =>
    req<LocationFlatDto[]>('/v1/location/flat'),

  listProductProfiles: () =>
    req<ProductProfileDto[]>('/v1/productprofile'),

  listOrderStatuses: () =>
    req<OrderStatusDto[]>('/v1/order/status'),

  listPaymentMethods: () =>
    req<PaymentMethodDto[]>('/v1/paymentmethod'),

  searchProductVariants: (search: string, productProfileUuid: string) =>
    req<ProductVariantFlatDto[]>(
      `/v1/productvariant/flat?page=1&search=${encodeURIComponent(search)}&productProfileUuid=${encodeURIComponent(productProfileUuid)}`
    ),

  lookupBarcode: (barcode: string, productProfileUuid: string) =>
    req<ProductVariantFlatDto[]>(
      `/v1/productvariant/flat?page=1&barcode=${encodeURIComponent(barcode)}&productProfileUuid=${encodeURIComponent(productProfileUuid)}`
    ),

  listCustomers: (search: string) =>
    req<CustomerDto[]>(`/v1/customer?search=${encodeURIComponent(search)}&limit=20`),

  createOrder: (body: object, test = false) =>
    req<OrderDto>(`/v1/order${test ? '?test=true' : ''}`, { method: 'POST', body: JSON.stringify(body) }),

  createTransaction: (orderUuid: string, body: {
    type: 'payment' | 'refund';
    status: 'pending' | 'declined' | 'cancelled' | 'success';
    amount: number;
    currencyIso?: string;
    paymentMethodUuid?: string;
    paymentDate?: string;
  }) =>
    req<object>(`/v1/order/${orderUuid}/transaction`, { method: 'POST', body: JSON.stringify(body) }),
};
