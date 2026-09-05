# CareerXP Website

A static HTML / CSS / JavaScript rebuild of the CareerXP site — no build step, no framework, works on any static host.

## File structure

```
careerxp-website/
├── index.html            Home
├── courses.html           Course listing (with track filters)
├── course-detail.html     Individual course page (duplicate per course)
├── placements.html        Full placement ledger + hiring partners
├── about.html              Mission, values, mentors
├── contact.html           Enroll / skill-fit screening form
├── css/
│   └── style.css           Single shared stylesheet for the whole site
├── js/
│   ├── data.js             Placement ledger + hiring partner data (edit this to update real numbers)
│   └── main.js             Shared behavior: mobile nav, ledger tickers, filters, contact form
└── assets/
    └── img/
        ├── logo-wordmark.png     Nav / footer logo (cropped from your logo, no tagline)
        ├── logo-mark-512.png     Just the XP arrow mark, large
        ├── favicon.ico
        ├── favicon-16.png
        ├── favicon-32.png
        ├── favicon-48.png
        └── apple-touch-icon.png
```

## Production readiness

This is built to be used as a real, live company website, not a prototype. Here's the honest state of things:

**Done:**
- 12 pages: Home, Courses, 3 course detail pages, Placements, About, Contact, Refund Policy, Privacy Policy, Terms of Service, plus a custom 404 page
- `sitemap.xml` and `robots.txt` for search engines
- Canonical URLs, Open Graph, and Twitter Card tags on every indexable page (for clean previews when shared on WhatsApp/social) — uses a placeholder domain, see below
- `EducationalOrganization` structured data (JSON-LD) on every main page
- Contact form wired for Netlify Forms (email notification + optional Google Sheet via Zapier — see below)
- CIN, GST, and legal policy links in the footer of every page

**Still needed before this is fully live:**
- **Replace the placeholder domain** (`www.careerxp.in`) in every canonical/OG tag, `sitemap.xml`, and `robots.txt` with your real domain (one-line command below)
- **Legal review** — Privacy Policy and Terms of Service are working drafts covering what the site currently collects. They are not a substitute for legal advice; have a lawyer review them before publishing, especially the sections marked `[FILL IN]` (grievance officer, registered address, jurisdiction, data retention period)
- **Payment integration** — not yet wired in; see the conversation notes on adding a Razorpay Payment Button once you have a gateway account
- **Analytics** — no tracking is wired in yet (e.g. Google Analytics); add a measurement ID when ready
- Everything in "Known placeholders" below

```
grep -rl "www.careerxp.in" . | xargs sed -i 's/www.careerxp.in/yourrealdomain.com/g'
```

## Editing content

- **Real placement numbers / hiring partners** → edit `js/data.js`. Every page pulls from the same file, so you only update it once.
- **Stats band** (4,218 hires, 91%, etc.) → these are hardcoded in each page's HTML (search for `stat-card`) since they're presentational, not looped from JS. Update the numbers directly in `index.html` and `placements.html`.
- **Course details, mentor bios, testimonials** → all placeholder copy, directly editable in the relevant HTML file.
- **Adding a new course** → duplicate `course-detail.html`, rename it (e.g. `course-data-science.html`), update its content, and add a row to `courses.html`'s `.course-list` linking to it.

## Hosting

This is a plain static site — any of the following work with zero configuration:

**Netlify / Vercel (drag-and-drop)**
1. Go to your Netlify or Vercel dashboard
2. Drag the whole `careerxp-website` folder onto the deploy area
3. Done — you get a live URL immediately

**GitHub Pages**
1. Push this folder's contents to a GitHub repo
2. Repo Settings → Pages → set source to the `main` branch, root folder
3. Site goes live at `https://<username>.github.io/<repo>/`

**Any traditional web host (cPanel, etc.)**
Upload the contents of this folder into `public_html/` (or your site root) via FTP/SFTP. No build step needed.

## Known placeholders to replace before going live

- **Course syllabus detail** — `course-mern.html` and `course-dsa.html` have summary module descriptions marked as placeholders in an HTML comment; swap in your real week-by-week syllabus once available.
- **Weekly placement drive numbers** — `CAREERXP_WEEKLY_DRIVES` in `js/data.js` (company, drives conducted, students participated) is placeholder data, shown in the table on `placements.html`.
- **Partnered colleges' LinkedIn links** — `CAREERXP_COLLEGES` in `js/data.js` has empty `linkedin` fields for Dayanand Sagar Institute and Sri Devi Institute; add the real post URLs and the "LinkedIn post pending" badge on `placements.html` will automatically become a real link.
- **Hiring-partner quotes** — the new "What our hiring partners say" section on `about.html` has 3 placeholder quote cards; swap in real quotes once available. (Your existing mentor bios were kept as a separate section above it — let us know if you'd rather remove them instead.)
- All placement records in `js/data.js` (names, roles, companies, CTC) used by the homepage's live ledger ticker
- Hiring partner names in `js/data.js`
- Contact form is wired for **Netlify Forms** (see the "Contact form" section above) — deploy on Netlify for it to actually deliver submissions
- Email addresses (`support@careerxp.in`) and phone/WhatsApp numbers — double check these are correct before launch
