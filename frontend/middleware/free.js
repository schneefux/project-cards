import gql from 'graphql-tag'

export default async function({ app, redirect, route, $apollo }) {
  const hasToken = !!app.$apolloHelpers.getToken()
  if (!hasToken) {
    redirect('/login?redirect=' + route.path)
    return
  }

  const apollo = this.app.apolloProvider.defaultClient
  const response = await apollo.query(gql`
    query {
      me {
        subscriptionTier
      }
    }
  `)

  if (response.data.me.subscriptionTier == 'GUEST') {
    redirect('/login?redirect=' + route.path)
  }
}
