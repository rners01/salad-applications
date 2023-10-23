
export const getOIDCAuthReturnUrl = () => {
  const QueryParameterNames = {
    ReturnUrl: 'returnUrl',
    Message: 'message',
  }
  const params = new URLSearchParams(window.location.search)
  const fromQuery = params.get(QueryParameterNames.ReturnUrl)
  if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
    // This is an extra check to prevent open redirects.
    throw new Error('Invalid return url. The return url needs to have the same origin as the current page.')
  }
  return fromQuery || `${window.location.origin}/`
}
