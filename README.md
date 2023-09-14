# FeuerFest
A basic eventing system i created for my local fire department

## Environment
Example [.env](/.env.example)
```js
DATABASE_URL="mysql://user:password@host:port/database"

EMAIL_FROM="<sender> email@host"
EMAIL_HOST="host"
EMAIL_USER="user"
EMAIL_PASSWORD="password"

SIGNING_KEY="signing key for paseto tokens (optional)"
```

## Deployment
### Local
Make use of `@sveltejs/adapter-node`
1. `pnpm build`
2. Run with `pnpm preview` or `node build/index.js`

### Docker
soon maybe

### Vercel
Make use of `@sveltejs/adapter-vercel` and publish to Vercel