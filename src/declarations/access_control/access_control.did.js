export const idlFactory = ({ IDL }) => {
  const Role = IDL.Variant({
    'admin' : IDL.Null,
    'owner' : IDL.Null,
    'authorized' : IDL.Null,
    'unauthorized' : IDL.Null,
  });
  const Error = IDL.Variant({
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
  });
  const Result_5 = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const Result_4 = IDL.Variant({ 'ok' : IDL.Principal, 'err' : Error });
  const rolesMap = IDL.Record({
    'principal' : IDL.Principal,
    'name' : IDL.Text,
    'role' : Role,
  });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Vec(rolesMap), 'err' : Error });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Text, 'err' : Error });
  const Result_1 = IDL.Variant({ 'ok' : Role, 'err' : Error });
  const RoleFormatted = IDL.Record({ 'name' : IDL.Text, 'role' : Role });
  const Result = IDL.Variant({ 'ok' : IDL.Opt(RoleFormatted), 'err' : Error });
  const anon_class_13_1 = IDL.Service({
    'assign_role' : IDL.Func([IDL.Principal, Role, IDL.Text], [Result_5], []),
    'callerPrincipal' : IDL.Func([], [Result_4], []),
    'canAccess' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'get_owner' : IDL.Func([], [Result_4], []),
    'get_role_requests' : IDL.Func([], [Result_3], []),
    'get_roles' : IDL.Func([], [Result_3], []),
    'greet' : IDL.Func([IDL.Text], [Result_2], []),
    'my_role' : IDL.Func([IDL.Principal], [Result_1], []),
    'my_role_request' : IDL.Func([], [Result], []),
    'my_role_request_out' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'request_role' : IDL.Func([Role, IDL.Text, IDL.Principal], [IDL.Bool], []),
  });
  return anon_class_13_1;
};
export const init = ({ IDL }) => { return []; };
