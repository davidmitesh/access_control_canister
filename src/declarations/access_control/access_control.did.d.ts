import type { Principal } from '@dfinity/principal';
export type Error = { 'NotFound' : null } |
  { 'NotAuthorized' : null };
export type Result = { 'ok' : [] | [RoleFormatted] } |
  { 'err' : Error };
export type Result_1 = { 'ok' : Role } |
  { 'err' : Error };
export type Result_2 = { 'ok' : string } |
  { 'err' : Error };
export type Result_3 = { 'ok' : Array<rolesMap> } |
  { 'err' : Error };
export type Result_4 = { 'ok' : Principal } |
  { 'err' : Error };
export type Result_5 = { 'ok' : null } |
  { 'err' : Error };
export type Role = { 'admin' : null } |
  { 'owner' : null } |
  { 'authorized' : null } |
  { 'unauthorized' : null };
export interface RoleFormatted { 'name' : string, 'role' : Role }
export interface anon_class_13_1 {
  'assign_role' : (arg_0: Principal, arg_1: Role, arg_2: string) => Promise<
      Result_5
    >,
  'callerPrincipal' : () => Promise<Result_4>,
  'canAccess' : (arg_0: Principal) => Promise<boolean>,
  'get_owner' : () => Promise<Result_4>,
  'get_role_requests' : () => Promise<Result_3>,
  'get_roles' : () => Promise<Result_3>,
  'greet' : (arg_0: string) => Promise<Result_2>,
  'my_role' : (arg_0: Principal) => Promise<Result_1>,
  'my_role_request' : () => Promise<Result>,
  'my_role_request_out' : (arg_0: Principal) => Promise<boolean>,
  'request_role' : (arg_0: Role, arg_1: string, arg_2: Principal) => Promise<
      boolean
    >,
}
export interface rolesMap {
  'principal' : Principal,
  'name' : string,
  'role' : Role,
}
export interface _SERVICE extends anon_class_13_1 {}
