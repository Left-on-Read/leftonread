# Left on Read: Marketing Site

The home of our marketing site at [https://leftonread.me/](https://leftonread.me/)

It is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

It is deployed via Vercel. To deploy to production, you must log into Vercel manually and click promote to production. It is done manually like this so that deploys are coordinated with when new releases are live.

## Local Development

### Getting Started

Install dependencies with yarn:

```bash
yarn
```

Start the project:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

##### Env Variables

Note that we load the following env variables via Vercel:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
```

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
