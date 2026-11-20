# DishaHire website (v2)

Recruitment consultancy website for **DishaHire**, Rajkot, Gujarat.
One Next.js project serves the public site, the job board, the forms API and the admin panel. There is no separate backend server any more.

**Stack:** Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4, MongoDB Atlas (Mongoose), deployed on Vercel.

## What's included

| Area | Details |
|---|---|
| Public pages | Home, About, Services, Jobs, Job detail (`/jobs/[id]`), Contact, 404 |
| Job applications | Apply on the job page with a resume upload (PDF/DOC/DOCX, max 2 MB), or via WhatsApp |
| Enquiry forms | Employer "hiring request" and candidate profile (optional resume) |
| Email alerts | Every application and enquiry is emailed to you (via Resend, optional) |
| Google for Jobs | `JobPosting` structured data on every job, `sitemap.xml`, `robots.txt`, page metadata, OG image |
| Admin (`/admin`) | Overview, post/edit/archive/delete jobs, applications (download resumes), employer enquiries, candidate profiles, search, CSV export, delete records |
| Security | Signed httpOnly session cookie (8 h), scrypt-hashed admin password, every admin API checks the session, login rate limit (5 tries / 15 min per IP), form rate limit, honeypot spam trap, input validation, same-origin checks, security headers, resumes stored privately (admin-only download) |

Existing data is kept: the app reads the same MongoDB collections (`jobs`, `companyenquiries`, `candidateenquiries`) as the old Express backend.

## Run locally

```bash
npm install
```

```bash
cp .env.example .env.local
```

Fill in `.env.local` (see below), then:

```bash
npm run dev
```

Open http://localhost:3000. The admin panel is at http://localhost:3000/admin.

## Environment variables

| Name | Required | What it is |
|---|---|---|
| `MONGODB_URI` | yes | MongoDB Atlas connection string |
| `ADMIN_EMAIL` | yes | Email used to sign in to `/admin` |
| `ADMIN_PASSWORD_HASH` | yes | Hash of the admin password. Generate it with `npm run hash-password -- "your-password"` |
| `JWT_SECRET` | yes | Random secret, at least 32 characters (the same command prints one) |
| `NEXT_PUBLIC_SITE_URL` | yes | Public URL, e.g. `https://dishahire.vercel.app` or your domain (no trailing slash) |
| `RESEND_API_KEY` | no | Turns on email alerts |
| `ALERT_EMAIL_TO` | no | Who receives alerts (comma-separated). Default: dishahire.0818@gmail.com |
| `ALERT_EMAIL_FROM` | no | Sender address. Needs a domain verified in Resend; otherwise use `onboarding@resend.dev` (which can only send to your own Resend account email) |

The plain admin password is never stored anywhere, only its hash.

## Deploy on Vercel (free Hobby plan)

1. **MongoDB Atlas.** Change the database user's password (the old one was published in the old code). Under *Network Access*, allow `0.0.0.0/0`, because Vercel has no fixed IP addresses. Copy the connection string.
2. **Vercel.** Go to vercel.com, sign in with GitHub, click **Add New → Project** and import this repository. If the repo also contains other folders, set *Root Directory* to the folder with this `package.json`. The framework is detected automatically.
3. **Environment variables.** Before the first deploy, add the variables from the table above under *Settings → Environment Variables*.
4. **Deploy.** Every push to the production branch redeploys automatically, and pull requests get preview URLs.
5. **Domain (optional).** Go to *Settings → Domains*, add your domain and set the DNS records Vercel shows. HTTPS is automatic. Then update `NEXT_PUBLIC_SITE_URL` and redeploy.
6. **Google.** Add the site in Google Search Console and submit `https://YOUR-DOMAIN/sitemap.xml`. Job posts become eligible for Google for Jobs.

> Vercel's Hobby plan terms say it's for non-commercial personal use. For strict compliance a business site needs the Pro plan, or you can deploy the same code free on Cloudflare or Netlify.

## Email alerts (Resend)

1. Create a free account at resend.com and create an API key.
2. Add `RESEND_API_KEY` in Vercel.
3. For alerts to go to any address (e.g. the Gmail inbox), verify your domain in Resend and set `ALERT_EMAIL_FROM` to e.g. `DishaHire Website <alerts@yourdomain.com>`.

Without a verified domain, set `ALERT_EMAIL_TO` to the email you signed up to Resend with.

## Editing content

- Contact details, industries, services, values, FAQ and photos: `lib/site.ts`
- Colours and fonts: `app/globals.css` (`@theme`) and `app/layout.tsx`
- Page layouts: `app/(site)/*/page.tsx`

## Useful commands

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm run hash-password -- "new-admin-password"
```
