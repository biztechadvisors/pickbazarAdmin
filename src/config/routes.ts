export const Routes = {
  dashboard: '/',
  login: '/login',
  logout: '/logout',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  adminMyShops: getAdminMyShopsRoute(),
  OwnerMyShops: '/shops', //For Owner Dashboard
  profile: '/profile',
  verifyCoupons: '/coupons/verify',
  settings: '/settings',
  storeSettings: '/vendor/settings',
  storeKeepers: '/vendor/store_keepers',
  profileUpdate: '/profile-update',
  checkout: '/orders/checkout',
  checkouts: '/sales/checkout',
  verifyEmail: '/verify-email',
  sales: '/sales',
  createSales: '/sales/create',
  regions: '/regions',
  Faq: '/faq',
  GetInspired: '/get-inspired',
  contacts: '/contacts',
  vacancies: '/vacancies',
  careers: '/careers',
  // groups: `/${getAdminMyShopsRoute()}/groups`,
  shops: (slug: string) => `/shops/${encodeURIComponent(slug)}`,
  // orders: '/orders',
  orders: (tracking_number: string) =>
    `/orders/${encodeURIComponent(tracking_number)}`,
  sale: (tracking_number: string) =>
    `/sale/${encodeURIComponent(tracking_number)}`,

  stocks: (tracking_number: string) =>
    `stocks/${encodeURIComponent(tracking_number)}`,

  singleorder: '/order',
  singleSaleOrder: 'sale',
  products: (slug: string) => {
    // if (asPath) {
    //   return `/products/${encodeURIComponent(slug)}?type=${asPath}`;
    // }
    return `/productsshop/${encodeURIComponent(slug)}`;
  },
  user: {
    ...routesFactory('/users'),
  },
  type: {
    ...routesFactory(`/groups`),
  },
  category: {
    ...routesFactory('/categories'),
  },
  subcategory: {
    ...routesFactory('/subCategories'),
  },
  attribute: {
    ...routesFactory('/attributes'),
  },
  attributeValue: {
    ...routesFactory('/attribute-values'),
  },
  tag: {
    ...routesFactory('/tags'),
  },
  blog: {
    ...routesFactory('/blogs'),
  },
  event: {
    ...routesFactory('/events'),
  },
  dealerlist: {
    ...routesFactory('/dealerlist'),
  },
  totalsale: {
    ...routesFactory('/total-sale'),
  },
  productsheet: {
    ...routesFactory('/product-upload-excel'),
  },
  reviews: {
    ...routesFactory('/reviews'),
  },
  abuseReviews: {
    ...routesFactory('/abusive_reports'),
  },
  abuseReviewsReport: {
    ...routesFactory('/abusive_reports/reject'),
  },
  author: {
    ...routesFactory('/authors'),
  },
  coupon: {
    ...routesFactory('/coupons'),
  },
  manufacturer: {
    ...routesFactory('/manufacturers'),
  },
  order: {
    ...routesFactory('/orders'),
  },
  orderStatus: {
    ...routesFactory('/order-status'),
  },
  orderCreate: {
    ...routesFactory('/orders/create'),
  },
  permission: {
    ...routesFactory('/permission'),
  },
  product: {
    ...routesFactory(`/products`),
  },
  shop: {
    ...routesFactory('/shops'),
  },
  tax: {
    ...routesFactory('/taxes'),
  },
  shipping: {
    ...routesFactory('/shippings'),
  },
  regions: {
    ...routesFactory('/regions'),
  },
  faq: {
    ...routesFactory('/faq'),
  },
  withdraw: {
    ...routesFactory('/withdraws'),
  },
  staff: {
    ...routesFactory('/staff'),
  },
  stock: {
    ...routesFactory('/stocks'),
  },
  refund: {
    ...routesFactory(`${getAdminMyShopsRoute()}/refunds`),
  },
  question: {
    ...routesFactory('/questions'),
  },
  message: {
    ...routesFactory('/message'),
  },
  getInspired: {
    ...routesFactory('/get-inspired'),
  },
  contacts: {
    ...routesFactory('/contacts'),
  },
  vacancies: {
    ...routesFactory('/vacancies'),
  },
  careers: {
    ...routesFactory('/careers'),
  },
  shopMessage: {
    ...routesFactory('/shop-message'),
  },
  conversations: {
    ...routesFactory('/message/conversations'),
  },
  storeNotice: {
    ...routesFactory('/store-notices'),
  },
  storeNoticeRead: {
    ...routesFactory('/store-notices/read'),
  },
};

function routesFactory(endpoint: string) {
  return {
    list: `${endpoint}`,
    create: `${endpoint}/create`,
    editWithoutLang: (slug: string, shop?: string) => {
      return shop
        ? `/${shop}${endpoint}/${slug}/edit`
        : `${endpoint}/${slug}/edit`;
    },
    edit: (slug: string, language: string, shop?: string) => {
      return shop
        ? `/${language}/${shop}${endpoint}/${slug}/edit`
        : `${language}${endpoint}/${slug}/edit`;
    },
    translate: (slug: string, language: string, shop?: string) => {
      return shop
        ? `/${language}/${shop}${endpoint}/${slug}/translate`
        : `${language}${endpoint}/${slug}/translate`;
    },
    details: (slug: string) => `${endpoint}/${slug}`,
  };
}

function getAdminMyShopsRoute() {
  if (typeof window !== 'undefined') {
    const shopSlug = localStorage.getItem('shopSlug');
    if (shopSlug) {
      return `/${encodeURIComponent(shopSlug)}`;
    }
  }
}
