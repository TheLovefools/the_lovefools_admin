import { useAppSelector } from '@/redux/selector';
import React from 'react';

const AuthChecker = ({ allowedRoles, children }) => {
  const { user } = useAppSelector((state) => state.userInfo);

  if (!user?.roles) return children(false);

  const { roles } = user;
  const rolesNames = roles.map((role) => role.roleName);

  const isAuthorised = allowedRoles.some((role) => rolesNames.includes(role));
  return children(isAuthorised);
};

export default AuthChecker;
