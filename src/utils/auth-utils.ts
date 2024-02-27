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
import { useEffect } from 'react';
import { string } from 'yup';


let type_names
export const allowedRoles = [SUPER_ADMIN, STORE_OWNER, STAFF, DEALER, ADMIN];
export const adminAndOwnerOnly = [SUPER_ADMIN, STORE_OWNER, ADMIN, DEALER];
export const adminOwnerAndStaffOnly = [SUPER_ADMIN, STORE_OWNER, STAFF];
export const superAdminOnly = [SUPER_ADMIN];
export const adminOnly = [SUPER_ADMIN, ADMIN, DEALER];
export const ownerOnly = [STORE_OWNER];
export const ownerAndStaffOnly = [STORE_OWNER, STAFF];

export function setAuthCredentials(token: string, type_name: string, permissions: any) {
  // Permissions = permissions
  Cookie.set(AUTH_CRED, JSON.stringify({ token, permissions, type_name }));
}
export function setEmailVerified(emailVerified: boolean) {
  Cookie.set(EMAIL_VERIFIED, JSON.stringify({ emailVerified }));
}
export function getEmailVerified(): {
  emailVerified: boolean;
} {
  const emailVerified = Cookie.get(EMAIL_VERIFIED);
  return emailVerified ? JSON.parse(emailVerified) : false;
}


// let
// type_names

export function getAuthCredentials(context?: any): {
  token: string | null;
  permissions: Permissions[] | null;
  type_name: string[] | null;
} {
  let authCred;
  if (context) {
    authCred = parseSSRCookie(context)[AUTH_CRED];
  } else {
    authCred = Cookie.get(AUTH_CRED);
  }
  if (authCred) {
    const parsedData = JSON.parse(authCred);
    type_names = parsedData.type_name
    // console.log(parsedData.token)
    return JSON.parse(authCred);
  }
  return { token: null, permissions: null, type_name: null };
}

export function parseSSRCookie(context: any) {
  return SSRCookie.parse(context.req.headers.cookie ?? '');
}

export function hasAccess(
  _allowedRoles: string[],
  _userPermissions: string[] | undefined | null
) {

  if (_userPermissions) {
  
    _allowedRoles?.find((aRole) => _userPermissions.includes(aRole))
    return Boolean(
      _allowedRoles?.find((aRole) => _userPermissions.includes(aRole))
    );
  }

  return false;
}


export function isAuthenticated(_cookies: any) {
  return (
    !!_cookies[TOKEN] &&
    Array.isArray(_cookies[PERMISSIONS]) &&
    !!_cookies[PERMISSIONS].length
  );
}

