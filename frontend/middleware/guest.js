export default function({ app, redirect, route }) {
  const hasToken = !!app.$apolloHelpers.getToken()
  if (!hasToken) {
    redirect('/register-guest?redirect=' + route.path)
  }
}
