import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { SDKProvider } from './sdk';
import { api } from './api';
import type {
  Screen, SaleState, LocalLineItem, UserData, CompanyDto,
  LocationFlatDto, PaymentMethodDto, CustomerDto, PaymentType, CustomerFormData,
} from './types';
import Login from './screens/Login';
import StationSelect from './screens/StationSelect';
import Sale from './screens/Sale';
import PaymentSelect from './screens/PaymentSelect';
import CardPayment from './screens/CardPayment';
import CashPayment from './screens/CashPayment';
import Receipt from './screens/Receipt';
import CustomerList from './screens/CustomerList';
import CustomerDetail from './screens/CustomerDetail';
import CustomerNew from './screens/CustomerNew';

export interface AppContextType {
  screen: Screen;
  user: UserData | null;
  company: CompanyDto | null;
  station: LocationFlatDto | null;
  paymentMethods: PaymentMethodDto[];
  sale: SaleState;
  loginError: string | null;
  scanError: string | null;
  login(email: string, password: string): Promise<void>;
  selectStation(station: LocationFlatDto): void;
  scanProduct(barcode: string): Promise<void>;
  updateQuantity(id: string, qty: number): void;
  removeItem(id: string): void;
  setCustomer(customer: CustomerDto | null): void;
  navigate(screen: Screen): void;
  confirmPayment(type: PaymentType, cashReceived?: number): Promise<void>;
  newSale(): void;
  logout(): void;
  viewedCustomer: CustomerDto | null;
  customerNewReturnTo: Screen | null;
  viewCustomer(c: CustomerDto): void;
  startSaleWithCustomer(c: CustomerDto): void;
  openCustomerNew(returnTo: Screen): void;
  saveNewCustomer(data: CustomerFormData): Promise<void>;
  updateViewedCustomer(uuid: string, data: CustomerFormData): Promise<void>;
}

export const AppContext = React.createContext<AppContextType>(null!);
export const useApp = () => React.useContext(AppContext);

function makeNewSaleName(): string {
  const now = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `POS-${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}-${p(now.getHours())}${p(now.getMinutes())}`;
}

function initialSale(): SaleState {
  return {
    name: makeNewSaleName(),
    lineItems: [],
    customer: null,
    preview: null,
    previewLoading: false,
    lastScannedId: null,
    completedOrder: null,
    paymentType: null,
  };
}

export default function App() {
  const [screen, setScreen] = React.useState<Screen>('login');
  const [user, setUser] = React.useState<UserData | null>(null);
  const [company, setCompany] = React.useState<CompanyDto | null>(null);
  const [defaultProfileUuid, setDefaultProfileUuid] = React.useState<string | null>(null);
  const [initialOrderStatusUuid, setInitialOrderStatusUuid] = React.useState<string | null>(null);
  const [openOrderStatusUuid, setOpenOrderStatusUuid] = React.useState<string | null>(null);
  const [completedOrderStatusUuid, setCompletedOrderStatusUuid] = React.useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethodDto[]>([]);
  const [station, setStation] = React.useState<LocationFlatDto | null>(() => {
    const s = localStorage.getItem('pos_station');
    return s ? JSON.parse(s) as LocationFlatDto : null;
  });
  const [sale, setSale] = React.useState<SaleState>(initialSale);
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const [scanError, setScanError] = React.useState<string | null>(null);
  const [viewedCustomer, setViewedCustomer] = React.useState<CustomerDto | null>(null);
  const [customerNewReturnTo, setCustomerNewReturnTo] = React.useState<Screen | null>(null);

  // Keep refs so async functions always see latest state
  const saleRef = React.useRef(sale);
  React.useEffect(() => { saleRef.current = sale; }, [sale]);
  const companyRef = React.useRef(company);
  React.useEffect(() => { companyRef.current = company; }, [company]);
  const profileRef = React.useRef(defaultProfileUuid);
  React.useEffect(() => { profileRef.current = defaultProfileUuid; }, [defaultProfileUuid]);
  const statusRef = React.useRef(initialOrderStatusUuid);
  React.useEffect(() => { statusRef.current = initialOrderStatusUuid; }, [initialOrderStatusUuid]);
  const openStatusRef = React.useRef(openOrderStatusUuid);
  React.useEffect(() => { openStatusRef.current = openOrderStatusUuid; }, [openOrderStatusUuid]);
  const completedStatusRef = React.useRef(completedOrderStatusUuid);
  React.useEffect(() => { completedStatusRef.current = completedOrderStatusUuid; }, [completedOrderStatusUuid]);
  const pmRef = React.useRef(paymentMethods);
  React.useEffect(() => { pmRef.current = paymentMethods; }, [paymentMethods]);

  // Preview debounce
  const previewTimer = React.useRef<ReturnType<typeof setTimeout>>();

  // Auto-init from stored token
  React.useEffect(() => {
    const tok = localStorage.getItem('token');
    if (tok) {
      initSession(JSON.parse(tok) as string).catch(() => {
        localStorage.removeItem('token');
        setScreen('login');
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function initSession(tok: string) {
    const decoded = jwtDecode<UserData>(tok);
    setUser(decoded);
    const [comp, profiles, statuses, methods] = await Promise.all([
      api.getCompany(decoded.company),
      api.listProductProfiles(),
      api.listOrderStatuses(),
      api.listPaymentMethods(),
    ]);
    setCompany(comp);
    const defProfile = profiles.find(p => p.default) ?? profiles[0];
    if (defProfile) setDefaultProfileUuid(defProfile.uuid);
    const initStatus = statuses.find(s => s.initialStatus);
    if (initStatus) setInitialOrderStatusUuid(initStatus.uuid);
    const openStatus = statuses.find(s =>
      s.names.some(n => /offen|open/i.test(n.name))
    );
    if (openStatus) setOpenOrderStatusUuid(openStatus.uuid);
    const completedStatus = statuses.find(s => s.completedStatus);
    if (completedStatus) setCompletedOrderStatusUuid(completedStatus.uuid);
    setPaymentMethods(methods);

    const savedStation = localStorage.getItem('pos_station');
    if (savedStation) {
      setStation(JSON.parse(savedStation) as LocationFlatDto);
      setScreen('sale');
    } else {
      setScreen('station_select');
    }
  }

  async function login(email: string, password: string) {
    setLoginError(null);
    try {
      const { token } = await api.login(email, password);
      localStorage.setItem('token', JSON.stringify(token));
      await initSession(token);
    } catch (e) {
      setLoginError(e instanceof Error ? e.message : 'Anmeldung fehlgeschlagen');
      throw e;
    }
  }

  function selectStation(st: LocationFlatDto) {
    localStorage.setItem('pos_station', JSON.stringify(st));
    setStation(st);
    setScreen('sale');
  }

  function triggerPreview(items: LocalLineItem[], customer: CustomerDto | null) {
    const comp = companyRef.current;
    const profUuid = profileRef.current;
    const statusUuid = statusRef.current;
    if (!comp || !profUuid || !statusUuid || items.length === 0) return;
    setSale(s => ({ ...s, previewLoading: true }));
    api.createOrder(buildPayload(items, customer, null, comp, profUuid, statusUuid), true)
      .then(order => setSale(s => ({ ...s, preview: order, previewLoading: false })))
      .catch(() => setSale(s => ({ ...s, previewLoading: false })));
  }

  function schedulePreview(items: LocalLineItem[], customer: CustomerDto | null) {
    clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(() => triggerPreview(items, customer), 400);
  }

  async function scanProduct(barcode: string) {
    const comp = companyRef.current;
    const profUuid = profileRef.current;
    if (!comp || !profUuid) return;
    setScanError(null);
    try {
      // Barcode scan: use barcode= param; fall back to search= for SKU/text entry
      let variants = await api.lookupBarcode(barcode, profUuid);
      if (!variants.length) {
        variants = await api.searchProductVariants(barcode, profUuid);
      }
      const match = variants[0];
      if (!match) {
        setScanError(`Kein Artikel für "${barcode}" gefunden`);
        setTimeout(() => setScanError(null), 3000);
        return;
      }
      const itemId = match.uuid;
      setSale(s => {
        const existing = s.lineItems.find(li => li.id === itemId);
        let newItems: LocalLineItem[];
        if (existing) {
          newItems = s.lineItems.map(li => li.id === itemId ? { ...li, quantity: li.quantity + 1 } : li);
        } else {
          const label = match.variantName || match.name || match.sku;
          newItems = [{
            id: itemId,
            productVariantUuid: match.variantUuid,
            productVariantUnitUuid: match.uuid,
            name: label,
            sku: match.sku,
            unitPrice: match.unitPrice,
            quantity: 1,
          }, ...s.lineItems];
        }
        schedulePreview(newItems, s.customer);
        return { ...s, lineItems: newItems, lastScannedId: itemId };
      });
      setTimeout(() => setSale(s => ({ ...s, lastScannedId: null })), 2000);
    } catch {
      setScanError(`Fehler beim Suchen von "${barcode}"`);
      setTimeout(() => setScanError(null), 3000);
    }
  }

  function updateQuantity(id: string, qty: number) {
    setSale(s => {
      const newItems = qty <= 0
        ? s.lineItems.filter(li => li.id !== id)
        : s.lineItems.map(li => li.id === id ? { ...li, quantity: qty } : li);
      schedulePreview(newItems, s.customer);
      return { ...s, lineItems: newItems };
    });
  }

  function removeItem(id: string) {
    setSale(s => {
      const newItems = s.lineItems.filter(li => li.id !== id);
      if (newItems.length === 0) {
        return { ...s, lineItems: newItems, preview: null };
      }
      schedulePreview(newItems, s.customer);
      return { ...s, lineItems: newItems };
    });
  }

  function setCustomer(customer: CustomerDto | null) {
    setSale(s => {
      schedulePreview(s.lineItems, customer);
      return { ...s, customer };
    });
  }

  function navigate(s: Screen) {
    setScreen(s);
  }

  function buildPayload(
    items: LocalLineItem[],
    customer: CustomerDto | null,
    pmUuid: string | null,
    comp: CompanyDto,
    profUuid: string,
    statusUuid: string,
  ) {
    return {
      name: saleRef.current.name,
      companyUuid: comp.uuid,
      languageCode: comp.defaultLanguageCode,
      currencyIso: comp.defaultCurrencyIsoCode,
      vatType: 'free',
      productProfileUuid: profUuid,
      orderStatusUuid: statusUuid,
      ...(customer ? { customerUuid: customer.uuid } : {}),
      ...(pmUuid ? { paymentMethodUuid: pmUuid } : {}),
      lineItems: items.map(item => ({
        type: 'product',
        productVariantUuid: item.productVariantUuid,
        productVariantUnitUuid: item.productVariantUnitUuid,
        quantity: String(item.quantity),
        unitPrice: item.unitPrice,
        unitPriceIsNet: false,
      })),
    };
  }

  async function confirmPayment(type: PaymentType) {
    const comp = companyRef.current;
    const profUuid = profileRef.current;
    const statusUuid = completedStatusRef.current ?? openStatusRef.current ?? statusRef.current;
    const methods = pmRef.current;
    const currentSale = saleRef.current;
    if (!comp || !profUuid || !statusUuid) return;

    // Find payment method by matching name keyword
    const keyword = type === 'card' ? 'karte' : type === 'cash' ? 'bar' : 'rechnung';
    const pm = methods.find(m => m.names.some(n => n.name.toLowerCase().includes(keyword)))
      ?? methods.find(m => m.default);

    const order = await api.createOrder(
      buildPayload(currentSale.lineItems, currentSale.customer, pm?.uuid ?? null, comp, profUuid, statusUuid),
      false
    );

    // Record payment transaction for card and cash (not invoice — payment pending)
    if (type !== 'invoice') {
      api.createTransaction(order.uuid, {
        type: 'payment',
        status: 'success',
        amount: parseFloat(order.totalGross),
        currencyIso: order.currencyIso,
        ...(pm ? { paymentMethodUuid: pm.uuid } : {}),
        paymentDate: new Date().toISOString(),
      }).catch(err => console.error('Transaction failed:', err));
    }

    setSale(s => ({ ...s, completedOrder: order, paymentType: type }));
    setScreen('receipt');
  }

  function newSale() {
    setSale(initialSale());
    setScreen('sale');
  }

  function viewCustomer(c: CustomerDto) {
    setViewedCustomer(c);
    setScreen('customer_detail');
  }

  function startSaleWithCustomer(c: CustomerDto) {
    setCustomer(c);
    setScreen('sale');
  }

  function openCustomerNew(returnTo: Screen) {
    setCustomerNewReturnTo(returnTo);
    setScreen('customer_new');
  }

  async function saveNewCustomer(data: CustomerFormData) {
    const newCustomer = await api.createCustomer(data);
    if (customerNewReturnTo === 'sale') {
      setCustomer(newCustomer);
      setScreen('sale');
    } else {
      setViewedCustomer(newCustomer);
      setScreen('customer_detail');
    }
  }

  async function updateViewedCustomer(uuid: string, data: CustomerFormData) {
    const updated = await api.updateCustomer(uuid, data);
    setViewedCustomer(updated);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('pos_station');
    setUser(null);
    setCompany(null);
    setStation(null);
    setSale(initialSale());
    setScreen('login');
  }

  const ctx: AppContextType = {
    screen, user, company, station, paymentMethods, sale,
    loginError, scanError,
    login, selectStation, scanProduct, updateQuantity, removeItem,
    setCustomer, navigate, confirmPayment, newSale, logout,
    viewedCustomer, customerNewReturnTo,
    viewCustomer, startSaleWithCustomer, openCustomerNew, saveNewCustomer, updateViewedCustomer,
  };

  return (
    <SDKProvider>
      <AppContext.Provider value={ctx}>
        {screen === 'login' && <Login />}
        {screen === 'station_select' && <StationSelect />}
        {(screen === 'sale' || screen === 'customer_picker') && <Sale />}
        {screen === 'payment_select' && <PaymentSelect />}
        {screen === 'card_payment' && <CardPayment />}
        {screen === 'cash_payment' && <CashPayment />}
        {screen === 'receipt' && <Receipt />}
        {screen === 'customer_list' && <CustomerList />}
        {screen === 'customer_detail' && <CustomerDetail />}
        {screen === 'customer_new' && <CustomerNew />}
      </AppContext.Provider>
    </SDKProvider>
  );
}
