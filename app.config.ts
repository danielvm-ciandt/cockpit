export default defineAppConfig({
  auth: {
    baseURL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    provider: {
      type: 'authjs'
    }
  }
})
