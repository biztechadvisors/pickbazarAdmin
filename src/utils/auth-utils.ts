import Cookie from 'js-cookie';
import SSRCookie from 'cookie';
import {
  ADMIN,
  AUTH_CRED,
  DEALER,
  EMAIL_VERIFIED,
  PERMISSIONS,
  STAFF,
  STORE_OWNER,
  SUPER_ADMIN,
  // SERVICE_PROVIDER,
  OWNER,
  TOKEN,
} from './constants';

export const allowedRoles = [
  SUPER_ADMIN,
  STORE_OWNER,
  STAFF,
  DEALER,
  ADMIN,
  OWNER,
];
export const adminAndOwnerOnly = [
  SUPER_ADMIN,
  STORE_OWNER,
  ADMIN,
  DEALER,
  OWNER,
];
export const adminOwnerAndStaffOnly = [SUPER_ADMIN, STORE_OWNER, STAFF, OWNER];
export const superAdminOnly = [SUPER_ADMIN, STORE_OWNER];
export const adminOnly = [SUPER_ADMIN, ADMIN, DEALER, STORE_OWNER];
export const ownerOnly = [SUPER_ADMIN, OWNER, DEALER, STORE_OWNER,STAFF];
export const dealerOnly = [DEALER];
export const ownerAndStaffOnly = [STORE_OWNER, STAFF];

export interface AuthCredentials {
  token: string | null;
  permissions: string[] | null;
  type_name: string[] | null;
}

export function setAuthCredentials(
  token: string,
  type_name: string,
  permissions: string[]
) {
  Cookie.set(AUTH_CRED, JSON.stringify({ token, permissions, type_name }));
}

export function setEmailVerified(emailVerified: boolean) {
  Cookie.set(EMAIL_VERIFIED, JSON.stringify({ emailVerified }));
}

export function getEmailVerified(): { emailVerified: boolean } {
  const emailVerified = Cookie.get(EMAIL_VERIFIED);
  return emailVerified ? JSON.parse(emailVerified) : { emailVerified: false };
}

export function getAuthCredentials(context?: any): AuthCredentials {
  let authCred;
  if (context) {
    authCred = parseSSRCookie(context)[AUTH_CRED];
  } else {
    authCred = Cookie.get(AUTH_CRED);
  }
  if (authCred) {
    const parsedData = JSON.parse(authCred);
    const type_names = parsedData.type_name;
    return { ...parsedData, type_name: type_names };
  }
  return { token: null, permissions: null, type_name: null };
}

export function parseSSRCookie(context: any) {
  return SSRCookie.parse(context.req.headers.cookie ?? '');
}

export function hasAccess(
  allowedRoles: string[],
  userPermissions: string[] | null | undefined
) {
  return (
    Array.isArray(userPermissions) &&
    allowedRoles.some((role) => userPermissions.includes(role))
  );
}

export function isAuthenticated(cookies: any) {
  return (
    !!cookies[TOKEN] &&
    Array.isArray(cookies[PERMISSIONS]) &&
    !!cookies[PERMISSIONS].length
  );
}
