# Sprint Performance Calculator

Static sprint estimation website built with plain HTML, CSS, and JavaScript for GitHub Pages.

## What this is

This project is an educational sprint-estimation tool for athletes, parents, coaches, and trainers. It estimates sprint conversions, speed metrics, timing-method differences, and broad benchmark tiers only when the benchmark source is strong enough to show.

This project is not:

- an official testing platform
- a precise recruiting predictor
- medical, coaching, legal, or professional advice

## Run locally

1. Open the `sprint-performance-calculator` folder.
2. Double-click `index.html` for a quick static preview, or serve the folder locally with any simple static server.
3. Test key pages at desktop and mobile widths:
   - `index.html`
   - `40-yard-dash-calculator.html`
   - `baseball-60-yard-dash-calculator.html`
   - `soccer-30m-sprint-calculator.html`
   - `track-100m-calculator.html`

## Publish on GitHub Pages

1. Create a new GitHub repository for this project.
2. Push the contents of the `sprint-performance-calculator` folder to that repo.
3. In GitHub, open `Settings > Pages`.
4. Set the source to the main branch and the root folder.
5. Update all placeholder URLs before publishing:
   - replace `YOUR_GITHUB_USERNAME` in `sitemap.xml`, `robots.txt`, and page canonical URLs
   - replace `YOUR_EMAIL_HERE` in `contact.html`

## Project structure

- `index.html`: homepage with main calculator above the fold
- `methodology.html`: transparent methodology and benchmark policy
- `privacy.html`, `terms.html`, `accessibility.html`, `contact.html`: trust and legal pages
- calculator pages:
  - `40-yard-dash-calculator.html`
  - `30-yard-to-40-yard-converter.html`
  - `100m-to-40-yard-converter.html`
  - `sprint-speed-calculator.html`
  - `hand-time-to-fat-converter.html`
  - `flying-10-flying-20-calculator.html`
  - `baseball-60-yard-dash-calculator.html`
  - `soccer-30m-sprint-calculator.html`
  - `track-100m-calculator.html`
- `css/styles.css`: shared site styling
- `js/calculator.js`: shared calculator rendering, sprint model, results, and navigation
- `js/validation.js`: shared input validation and warnings
- `js/benchmarks.js`: benchmark matching and tier logic
- `js/share.js`: copy/share URL behavior
- `data/benchmarks.js`: source-backed benchmark data only
- `sitemap.xml`, `robots.txt`: basic search-engine support

## Where to edit benchmark data

Edit `data/benchmarks.js`.

Important:

- do not add unsupported benchmark claims
- do not fabricate percentiles
- do not add weak 100m benchmark data in v1
- do not add placeholder benchmarks just to fill empty states

## Where to update legal pages

- `privacy.html`
- `terms.html`
- `accessibility.html`
- `contact.html`

These pages are starter language and should be reviewed before scaling the project.

## Where to add analytics later

If analytics are added later, update `privacy.html` first, then add the script include to the shared page templates.

## Where to add affiliate disclosures later

The project already includes a hidden future affiliate disclosure pattern in the footer. If affiliate links are ever added:

- make the disclosure visible near the affiliate links
- keep disclosure language clear and plain
- do not hide results behind affiliate interactions

## Safety and content reminders

- Do not collect personal data from children.
- Do not ask for exact birthdays, names, school names, or precise location.
- Do not publish unsupported benchmark claims.
- Replace `YOUR_EMAIL_HERE` before publishing.
- Keep calculations client-side unless the privacy and legal pages are updated first.
- Keep the language educational and transparent. Do not present results as official marks.
