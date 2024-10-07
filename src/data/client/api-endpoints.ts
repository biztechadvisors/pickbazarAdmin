import Contacts from '@/pages/contacts';

export const API_ENDPOINTS = {
  ATTACHMENTS: 'attachments',
  ANALYTICS: 'analytics',
  ATTRIBUTES: 'attributes',
  CARTS: '/carts',
  DEALER: '/dealers',
  ATTRIBUTE_VALUES: 'attribute-values',
  ORDER_STATUS: 'order-status',
  ORDERS: 'orders',
  USERS: 'users',
  REGISTER: 'register',
  VENDOR_LIST: 'Vendor',
  STORE_OWNER: 'Company',
  PRODUCTS: 'products',
  POPULAR_PRODUCTS: 'popular-products',
  COUPONS: 'coupons',
  VERIFY_COUPONS: 'coupons/verify',
  CUSTOMERS: 'customers',
  TAXES: 'taxes',
  SHIPPINGS: 'shippings',
  SETTINGS: 'settings',
  CATEGORIES: 'categories',
  SUBCATEGORIES: 'subcategories',
  TAGS: 'tags',
  TYPES: 'types',
  PROFILE_UPDATE: 'profile-update',
  LOGOUT: 'logout',
  ME: 'me',
  TOKEN: 'token',
  BLOCK_USER: 'users/block-user',
  UNBLOCK_USER: 'users/unblock-user',
  CHANGE_PASSWORD: 'change-password',
  FORGET_PASSWORD: 'forget-password',
  VERIFY_FORGET_PASSWORD_TOKEN: 'verify-forget-password-token',
  RESET_PASSWORD: 'reset-password',
  DOWNLOAD_INVOICE: 'download/invoice',
  APPROVE_SHOP: 'approve-shop',
  DISAPPROVE_SHOP: 'disapprove-shop',
  SHOPS: 'shops',
  MY_SHOPS: 'my-shops',
  WITHDRAWS: 'withdraws',
  APPROVE_WITHDRAW: 'withdraw/approve',
  ADD_WALLET_POINTS: 'add-points',
  REFUNDS: 'refunds',
  STAFFS: 'staffs',
  ADD_STAFF: 'staffs',
  REMOVE_STAFF: 'staffs',
  MODEL_IMPORT: 'uploadxl-products/upload',
  IMPORT_PRODUCTS: 'import-products/',
  IMPORT_ATTRIBUTES: 'import-attributes/',
  IMPORT_VARIATION_OPTIONS: 'import-variation-options/',
  MAKE_ADMIN: 'users/make-admin',
  AUTHORS: 'authors',
  MANUFACTURERS: 'manufacturers',
  CHECKOUT: 'orders/checkout/verify',
  QUESTIONS: 'questions',
  REVIEWS: 'reviews',
  ABUSIVE_REPORTS_DECLINE: 'abusive_reports/reject',
  ABUSIVE_REPORTS: 'abusive_reports',
  GENERATE_DESCRIPTION: 'generate-descriptions',
  ORDER_EXPORT: 'export-order-url',
  ORDER_CREATE: 'order/create',
  ORDER_INVOICE_DOWNLOAD: 'download-invoice-url',
  // INVOICE_DOWNLOAD:'download-invoice',
  SEND_VERIFICATION_EMAIL: '/email/verification-notification',
  UPDATE_EMAIL: '/update-email',
  CONVERSIONS: '/conversations',
  MESSAGE: '/messages/conversations',
  MESSAGE_SEEN: '/messages/seen',
  ADMIN_LIST: '/admin/list',
  STORE_NOTICES: 'store-notices',
  STORE_NOTICES_IS_READ: 'store-notices/read',
  STORE_NOTICE_GET_STORE_NOTICE_TYPE: 'store-notices/getStoreNoticeType',
  STORE_NOTICES_USER_OR_SHOP_LIST: 'store-notices/getUsersToNotify',
  PERMISSION: 'permission',
  CART: 'carts',
  STOCK: '/stocks',
  STOCK_DEALER_UPDATE: '/stocks/update/inventory',
  STOCKBYID: '/orders',
  DEALER_SEALS_STOCK: '/stocks/orders',
  DEALER_SEALS_STOCK_BY_ID: '/stocks/order',
  DEALER_STATUS_CHANGE: '/stocks',
  EVENTS: '/events',
  BLOG: '/blogs',
  REGIONS: '/regions',
  NOTIFICATION: `/notifications`,
  FAQ: '/faqs',
  GET_INSPIRED: '/get-inspired',
  QNA: '/qnas',
  CONTACTS: '/contacts',
  VACANCY: '/vacancies',
};
