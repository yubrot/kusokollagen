# Kusokollagen

## Setup

For local development, copy `.env.example` to `.env.local` and set environment variables in it.

### Initialize Google OAuth client for [next-auth Google sign-in](https://next-auth.js.org/providers/google)

1. Open `APIs & Services` on your GCP project.
2. Initialize `OAuth consent screen` as `External`.
3. In `Credentials`, create `OAuth client ID` with
   - Application type: `Web application`
   - Authorized JavaScript origins: `your domain`
     - `"http://localhost:3000"` for local development
   - Authorized redirect URIs: `your domain + "/api/auth/callback/google"`
     - `"http://localhost:3000/api/auth/callback/google"` for local development
4. Set your Client ID to `GOOGLE_OAUTH_CLIENT_ID`, and Client secret to `GOOGLE_OAUTH_CLIENT_SECRET` in your environment variables.

When deploying to production, `NEXTAUTH_URL` and `NEXTAUTH_SECRET` are also required by [next-auth](https://next-auth.js.org/configuration/options).

### Prepare Database

We have tested our application with MySQL hosted on [PlanetScale](https://planetscale.com/).
For example, we can initialize PlanetScale database as follows:

```bash
$ pscale database create kusokollagen [--region <REGION>]
$ pscale branch create kusokollagen dev
$ pscale password create kusokollagen dev <PASSWORD_NAME>
```

After that, set `mysql://<USERNAME>:<PASSWORD>@<ACCESS_HOST_URL>/kusokollagen?sslaccept=strict` to `PRISMA_DATABASE_URL` in your environment variables.

We can learn more about Prisma + PlanetScale development flow from [PlanetScale's Prisma guide](https://docs.planetscale.com/tutorials/automatic-prisma-migrations).

### Launch

```bash
# for development
$ npm install
$ npm run prisma:push
$ npm run dev

# for production
$ pscale deploy-request ...
$ npm run build
$ NEXTAUTH_URL=https:/... \
  NEXTAUTH_SECRET=... \
  npm run start
```

We can also use `npm run ladle` for React Components development and `npm run prisma:studio` for database browsing.

## Resources

- Icons
  - [Heroicons](https://heroicons.com/)
  - [Zondicons](http://www.zondicons.com/icons.html)
  - [Entypo](http://www.entypo.com/)
- Fonts
  - [GenEi Antique](http://okoneya.jp/font/) ([SIL Open Font License](http://scripts.sil.org/OFL))
