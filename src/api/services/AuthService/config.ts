export const AuthQueryKeys = {
  all: 'auth',
  refreshAccessToken: (token: string) => [...AuthQueryKeys.all, 'refreshAccessToken', token],
}

export const AuthEndpoints = {
  login: () => '/auth/login/',
  register: () => '/auth/register/',
  logout: () => '/auth/logout/',
  logoutAll: () => '/auth/logout-all/',
  acceptInvite: () => '/auth/accept-invite/',
  refreshAccessToken: () => '/auth/refresh/',
  requestPasswordReset: () => '/auth/request-reset-password/',
  resetPassword: () => '/auth/reset-password/',
  updatePassword: () => '/auth/update-password/',
}
