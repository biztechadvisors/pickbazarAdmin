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
  TOKEN,
} from './constants';
import { Permissions } from '@/types';

// Define allowed roles and role-specific access
export const allowedRoles = [SUPER_ADMIN, STORE_OWNER, STAFF, DEALER, ADMIN];
export const adminAndOwnerOnly = [SUPER_ADMIN, STORE_OWNER, ADMIN, DEALER];
export const adminOwnerAndStaffOnly = [SUPER_ADMIN, STORE_OWNER, STAFF];
export const superAdminOnly = [SUPER_ADMIN];
export const adminOnly = [SUPER_ADMIN, ADMIN, DEALER];
export const ownerOnly = [STORE_OWNER];
export const dealerOnly = [DEALER];
export const ownerAndStaffOnly = [STORE_OWNER, STAFF];

let type_names: string[] | null = null;

export function setAuthCredentials(token: string, type_name: string, permissions: any) {
  Cookie.set(AUTH_CRED, JSON.stringify({ token, permissions, type_name }));
}

export function setEmailVerified(emailVerified: boolean) {
  Cookie.set(EMAIL_VERIFIED, JSON.stringify({ emailVerified }));
}

export function getEmailVerified(): { emailVerified: boolean } {
  const emailVerified = Cookie.get(EMAIL_VERIFIED);
  return emailVerified ? JSON.parse(emailVerified) : { emailVerified: false };
}

export function getAuthCredentials(context?: any): {
  token: string | null;
  permissions: Permissions[] | null;
  type_name: string[] | null;
} {
  let authCred: string | undefined;

  if (context) {
    authCred = parseSSRCookie(context)[AUTH_CRED];
  } else {
    authCred = Cookie.get(AUTH_CRED);
  }

  if (authCred) {
    const parsedData = JSON.parse(authCred);
    type_names = parsedData.type_name;
    return {
      token: parsedData.token,
      permissions: parsedData.permissions,
      type_name: parsedData.type_name,
    };
  }

  return { token: null, permissions: null, type_name: null };
}

export function parseSSRCookie(context: any) {
  return SSRCookie.parse(context.req.headers.cookie ?? '');
}

export function hasAccess(allowedRoles: string[], userPermissions: string[] | undefined | null) {
  if (userPermissions) {
    return allowedRoles.some((role) => userPermissions.includes(role));
  }

  return false;
}

export function isAuthenticated(cookies: any) {
  return (
    !!cookies[TOKEN] &&
    Array.isArray(cookies[PERMISSIONS]) &&
    !!cookies[PERMISSIONS].length
  );
}
