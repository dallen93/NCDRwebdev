# Northcrest Golf Driving Range — Shopify Dawn Theme Spec
**For use with Claude Code**
Version 2.0 | June 2026

---

## 1. Project Overview

Customize Shopify's **Dawn theme** for **Northcrest Golf Driving Range (NCDR)** — a family-owned, nearly 40-year-old premium golf facility at 3545 Northcrest Road, Atlanta, GA 30340.

The site replaces an existing Duda website. It functions as both a marketing platform and a full commerce engine — handling pro shop sales, membership signups, program registrations, simulator bookings, trade-in submissions, and event registrations.

**Primary visitor action:** Browse pro shop inventory.
**Platform:** Shopify (Dawn theme)
**Build approach:** Edit Dawn theme files directly. Never rebuild what Dawn already does well. Make targeted, surgical customizations only.

---

## 2. Dawn Theme File Structure

When Claude Code opens the downloaded Dawn zip, the key files are:

```
dawn/
├── assets/
│   ├── base.css          ← Global CSS variables, typography, color tokens
│   ├── component-*.css   ← Individual component styles
│   └── *.js              ← JavaScript functionality
├── config/
│   └── settings_data.json ← Theme settings (colors, fonts, etc.)
├── layout/
│   └── theme.liquid       ← Master layout — header, footer wrapper
├── sections/
│   ├── header.liquid      ← Navigation and header
│   ├── footer.liquid      ← Footer
│   ├── image-banner.liquid ← Hero banner section
│   ├── featured-collection.liquid ← Product grid sections
│   ├── rich-text.liquid   ← Text content sections
│   ├── multicolumn.liquid ← Multi-column feature sections
│   └── *.liquid           ← All other page sections
├── snippets/
│   └── *.liquid           ← Reusable components
└── templates/
    ├── index.json         ← Homepage section configuration
    ├── page.json          ← Default page template
    ├── collection.json    ← Collection page template
    ├── product.json       ← Product page template
    └── page.*.json        ← Custom page templates
```

---

## 3. Brand Identity

### Color Tokens — Apply to `assets/base.css`

Replace Dawn's default color variables with NCDR's brand system:

```css
:root {
  /* NCDR Brand Colors */
  --ncdr-green:       #3A582B;  /* Primary — backgrounds, headers, CTAs */
  --ncdr-green-deep:  #2a4020;  /* Darker green — footer, nav background */
  --ncdr-green-light: #54634B;  /* Hover states, secondary elements */
  --ncdr-gold:        #C9A84C;  /* Accent — borders, highlights, CTAs */
  --ncdr-gold-light:  #dfc070;  /* Gold hover state */
  --ncdr-gold-dim:    rgba(201,168,76,0.15); /* Subtle gold backgrounds */
  --ncdr-gold-border: rgba(201,168,76,0.3);  /* Gold borders */
  --ncdr-white:       #FFFFFF;
  --ncdr-off-white:   #F7F4EE;  /* Warm off-white for section backgrounds */
  --ncdr-dark-gray:   #1C1C1C;  /* Body text on light backgrounds */
  --ncdr-mid-gray:    #4a4a4a;  /* Secondary text */
  --ncdr-light-gray:  #E8E4DE;  /* Dividers, subtle borders */

  /* Map to Dawn's CSS variable names */
  --color-base-background-1: 247, 244, 238;   /* off-white in RGB */
  --color-base-background-2: 255, 255, 255;   /* white in RGB */
  --color-base-text: 28, 28, 28;              /* dark gray in RGB */
  --color-base-accent-1: 58, 88, 43;          /* NCDR green in RGB */
  --color-base-accent-2: 201, 168, 76;        /* NCDR gold in RGB */
  --color-button: 58, 88, 43;                 /* Green buttons */
  --color-button-text: 255, 255, 255;         /* White button text */
  --color-secondary-button: 201, 168, 76;     /* Gold secondary buttons */
}
```

### Typography

Dawn uses system fonts by default. Update `config/settings_data.json`:

```json
"type_header_font": "oswald_n4",
"type_body_font": "assistant_n4"
```

If Oswald isn't available via Shopify's font picker, use **Assistant Bold** for headings and **Assistant** for body — it's clean, modern, and readable.

Apply these base rules in `assets/base.css`:

```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading-family);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-foreground);
}

.button, .btn {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}
```

### Visual Vibe

**White-dominant with intentional green moments.** The majority of the site breathes in white and off-white. NCDR green appears in five key moments:
1. Navigation / header background
2. Hero section
3. Instructor feature section
4. Events banner
5. Footer

Gold is a precision accent only — used on CTAs, borders, hover states, and credential badges. Never as a background.

### Logo

File: `Northcrest_Official_Logo.jpg` — upload to `assets/` and reference in `sections/header.liquid`.

Primary logo on dark green header — use full color version.
Footer logo — white or reversed version.
Do not stretch, recolor, or add effects.

---

## 4. Global Layout Changes

### Header — `sections/header.liquid`

Target changes:
- Background: `var(--ncdr-green-deep)` (#2a4020)
- Logo: left-aligned, max-height 48px
- Navigation links: white, uppercase, 11px, 0.1em letter-spacing
- Nav link hover: gold (#C9A84C)
- Cart icon: white, with gold dot for item count
- "Join Now" button: gold background, green text, uppercase — links to `/pages/memberships`
- Sticky on scroll: `position: sticky; top: 0; z-index: 100;`

Announcement bar above header:
```liquid
<div class="announcement-bar">
  Free shipping on orders over $150 &nbsp;·&nbsp; Open late, rain or shine &nbsp;·&nbsp; World-class instruction
</div>
```
Announcement bar styles: gold background, green text, 11px, uppercase, centered.

### Footer — `sections/footer.liquid`

Target changes:
- Background: `#1a2d10` (deep green)
- Border top: `2px solid var(--ncdr-gold)`
- Four columns:
  - Column 1 (wider): Logo, tagline, address, phone, email
  - Column 2: Shop links (Clubs, Golf Balls, New Releases, Sale, All Products)
  - Column 3: Experience links (Memberships, Programs, Simulators, Events, Lessons, Repair)
  - Column 4: Info links (Trade-Ins, Contact, Hours, Instagram, Facebook)
- Footer bottom: copyright left, authorized dealer badges right
- Dealer badges: `Majesty Authorized`, `Honma Verified`, `XXIO Official` — subtle dark bordered pills
- All text: white at varying opacity levels (links 60%, labels 35%, copy 25%)
- Link hover: gold

---

## 5. Homepage — `templates/index.json`

### Section Order
1. Announcement bar (in header)
2. Hero / Image banner
3. Facility strip
4. Pro shop — Featured collection (New Releases)
5. Instructor feature
6. Membership tiers
7. Trade-in banner
8. Events banner
9. Footer

### Section 1 — Hero (`sections/image-banner.liquid`)

Settings:
- Full width: true
- Min height: 560px
- Background: NCDR green (`#3A582B`) with diagonal texture overlay
- Heading: "Where Your Game Grows." — white, large, uppercase, Oswald bold
- Subheading: "125 covered bays. Grass tees. Golfzon simulators — open late, rain or shine, 365 days a year." — white 60% opacity, 16px
- Button 1 (primary): "Shop the Pro Shop" — gold background, green text — links to `/collections/all`
- Button 2 (secondary): "Become a Member" — outlined gold — links to `/pages/memberships`
- Stats strip below CTAs: removed per design v7

Stats strip CSS:
```css
.hero-stats {
  display: flex;
  gap: 40px;
  padding-top: 32px;
  border-top: 1px solid rgba(255,255,255,0.1);
  margin-top: 32px;
}
.hero-stat-num {
  font-family: var(--font-heading-family);
  font-size: 28px;
  font-weight: 700;
  color: var(--ncdr-gold);
}
.hero-stat-label {
  font-size: 10px;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

### Section 2 — Facility Strip (Custom Section)

Create `sections/ncdr-facility-strip.liquid`:

```liquid
<div class="facility-strip">
  {% for block in section.blocks %}
    <div class="facility-item">
      <div class="facility-icon">{{ block.settings.icon }}</div>
      <div>
        <div class="facility-label">{{ block.settings.label }}</div>
        <div class="facility-sub">{{ block.settings.sublabel }}</div>
      </div>
    </div>
  {% endfor %}
</div>

{% schema %}
{
  "name": "Facility Strip",
  "blocks": [
    {
      "type": "item",
      "name": "Facility Item",
      "settings": [
        { "type": "text", "id": "label", "label": "Label" },
        { "type": "text", "id": "sublabel", "label": "Sub Label" },
        { "type": "text", "id": "icon", "label": "Icon SVG" }
      ]
    }
  ]
}
{% endschema %}
```

Default blocks:
- Open Until 11pm / Mon – Sat · Sun until 9pm
- Rain or Shine / Covered bays, always open
- Golfzon Simulators / 5 indoor simulator bays
- Grass Tees / Natural turf, spring – fall

Styles: white background, green icon accents, gold top border `3px solid #C9A84C`, border-bottom `1px solid #E8E4DE`.

### Section 3 — Pro Shop Featured Collection

Use Dawn's built-in `featured-collection` section.
- Collection: New Releases
- Heading: "New Gear. Now In Stock."
- Products to show: 4
- Enable quick add: true
- Background: white

### Section 4 — Instructor Feature (Custom Section)

Create `sections/ncdr-coach-feature.liquid`:

Two-column layout. Left: content. Right: photo placeholder.

```liquid
<section class="coach-feature">
  <div class="coach-content">
    <div class="credential-pills">
      <span class="pill">PGA Certified Professionals</span>
      <span class="pill">All Skill Levels Welcome</span>
    </div>
    <h2>Coached By<br><span class="gold">A Champion.</span></h2>
    <p>{{ section.settings.body }}</p>
    <a href="/pages/lesson" class="button button--primary">Book a Lesson</a>
  </div>
  <div class="coach-photo">
    {% if section.settings.photo != blank %}
      <img src="{{ section.settings.photo | img_url: '600x' }}" alt="NCDR Instructors">
    {% else %}
      <div class="coach-photo-placeholder">Instructor Photo</div>
    {% endif %}
  </div>
</section>

{% schema %}
{
  "name": "Coach Feature",
  "settings": [
    { "type": "textarea", "id": "body", "label": "Body text" },
    { "type": "image_picker", "id": "photo", "label": "Coach photo" }
  ]
}
{% endschema %}
```

Default body text:
"Level up your game with PGA-certified instruction at Northcrest Golf. Private lessons, junior programs, and multi-session packages available year-round."

Styles: NCDR green deep background, white text, gold credential pills, gold heading accent.

### Section 5 — Membership Tiers (Custom Section)

Create `sections/ncdr-memberships.liquid`:

Four-column card layout. One featured card (Very Long Day Pass).

```liquid
<section class="membership-section">
  <div class="section-header">
    <p class="eyebrow">Membership</p>
    <h2>Find Your Plan</h2>
    <p class="section-sub">Every member receives a digital badge in Apple & Google Wallet, member pricing, and priority access.</p>
  </div>
  <div class="tier-grid">
    {% for block in section.blocks %}
      <div class="tier-card {% if block.settings.featured %}featured{% endif %}">
        {% if block.settings.featured %}<div class="tier-badge">{{ block.settings.badge }}</div>{% endif %}
        <div class="tier-name">{{ block.settings.name }}</div>
        <div class="tier-price">${{ block.settings.price }}<span>/mo</span></div>
        <div class="tier-access">{{ block.settings.access }}</div>
        <a href="{{ block.settings.link }}" class="tier-cta">Join Now</a>
        {% if block.settings.note != blank %}
          <div class="tier-note">{{ block.settings.note }}</div>
        {% endif %}
      </div>
    {% endfor %}
  </div>
</section>
```

Default blocks:
- Early Bird / $49 / Morning & daytime access
- Very Long Day Pass / $59 / Evenings 8pm–close / featured / badge: "Best Value"
- Anytime / $89 / Full anytime access
- Founding Member / $79 / Rate-locked for life / note: "50 spots only"

### Section 6 — Trade-In Banner (Custom Section)

Create `sections/ncdr-tradein-banner.liquid`:

Split panel — left content with 3 steps, right green form panel.

```liquid
<section class="tradein-section">
  <div class="tradein-content">
    <p class="eyebrow">Trade-Ins</p>
    <h2>Trade In. Upgrade. Play Better.</h2>
    <div class="tradein-steps">
      <div class="step"><span class="step-num">1</span><span>Submit your clubs online or bring them to the pro shop</span></div>
      <div class="step"><span class="step-num">2</span><span>Receive an instant trade-in value assessment</span></div>
      <div class="step"><span class="step-num">3</span><span>Store credit applied to your NCDR account — use online or in-store</span></div>
    </div>
  </div>
  <div class="tradein-cta">
    <h3>Start Your Trade-In</h3>
    <p>Get store credit for your old clubs — applied instantly to your account.</p>
    <a href="/pages/trade-ins" class="button button--gold">Start Trade-In</a>
  </div>
</section>
```

### Section 7 — Events Banner (Custom Section)

Create `sections/ncdr-events-banner.liquid`:

Full-width green section. Left: event details. Right: dual CTAs.

Default content:
- Label: "Now Registering"
- Title: "1st Annual Northcrest Long Drive Classic"
- Sub: "4 consecutive Friday evenings in May 2026. Progressive skill sessions culminating in a championship competition night."
- CTA 1: "Register Now" → `/pages/events`
- CTA 2: "Become a Sponsor" → `/pages/events`

---

## 6. Collection Pages — `templates/collection.json`

Dawn's default collection template is strong — minimal changes needed:

In `sections/main-collection-product-grid.liquid`:
- Enable sidebar filters: brand, price, gender tags
- Products per row: 4 desktop, 2 tablet, 1 mobile
- Sort options: Featured, Price low-high, Price high-low, Newest

Custom collection banner per collection — add descriptive text for SEO:
- Drivers: "Premium golf drivers from TaylorMade, XXIO, Majesty, and Honma — available at Northcrest Golf, Atlanta."
- Similar banners for each major collection

---

## 7. Product Pages — `templates/product.json`

Dawn's default product template handles most needs. Target additions:

In `sections/main-product.liquid`:
- Brand name displayed above product title in gold uppercase
- "Available at Northcrest Golf Driving Range, Atlanta" beneath price
- Authorized dealer badge for Majesty and Honma products

Add to `snippets/product-badge.liquid`:
```liquid
{% if product.vendor == 'Honma' or product.vendor == 'Majesty' %}
  <span class="dealer-badge">Authorized Dealer</span>
{% endif %}
```

---

## 8. Custom Page Templates

Create these custom templates in `templates/`:

### `templates/page.lesson.json`
Sections:
- Hero banner — "Meet Our Pros" — green background
- Instructor roster: Jim Yong Choi (PGA Class A), Ah Ram Suh (LPGA & KLPGA Class A), Greg Shelnutt (PGA Certified), William Buitrago (TPI1 & TPI2), Ho H-Yu (PGA Apprentice), Joseph Choi (PGA Apprentice)
- Lesson packages: Single $150/hr, 4-pack $550, 8-pack $1,000
- Booking CTA

### `templates/page.trade-ins.json`
Sections:
- Hero — "Trade In. Upgrade. Play Better."
- How It Works — 3-step process
- What We Accept — club types and brands list
- Submission form (use Shopify's contact form directed to trade-in email)
- Store credit explainer

### `templates/page.memberships.json`
Sections:
- Hero — "Become a Northcrest Member"
- 4-tier comparison (same component as homepage)
- What's Included — member benefits list
- Digital badge explainer — Apple/Google Wallet
- FAQ accordion

### `templates/page.simulators.json`
Sections:
- Hero — "Play Any Course. Any Time."
- Golfzon feature highlights
- Pricing/session info
- Booking CTA

### `templates/page.events.json`
Sections:
- Hero — "What's Happening at Northcrest"
- Long Drive Classic feature card
- Monthly events grid
- Registration CTA

### `templates/page.programs.json`
Sections:
- Hero — "Level Up Your Game"
- Season banner — April–September
- Program cards (Beginner Path, Break 100, Break 90, Junior Academy, Simulator League)
- Cohort calendar

### `templates/page.repair.json`
Sections:
- Hero — "Club Repair & Restoration"
- Services list
- Pricing placeholder
- CTA

### `templates/page.contact.json`
Sections:
- Contact info (address, phone, email, hours)
- Google Maps embed
- Contact form

---

## 9. Key CSS Additions — `assets/base.css`

Add these global utility classes:

```css
/* ── NCDR EYEBROW LABEL ── */
.ncdr-eyebrow {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ncdr-gold);
  margin-bottom: 8px;
}

/* ── CREDENTIAL PILLS ── */
.credential-pill {
  display: inline-block;
  background: var(--ncdr-gold-dim);
  border: 1px solid var(--ncdr-gold-border);
  color: var(--ncdr-gold);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 2px;
  margin-right: 6px;
  margin-bottom: 6px;
}

/* ── GOLD BUTTON VARIANT ── */
.button--gold {
  background: var(--ncdr-gold);
  color: var(--ncdr-green-deep);
  border: none;
}
.button--gold:hover {
  background: var(--ncdr-gold-light);
}

/* ── SECTION SPACING ── */
.ncdr-section {
  padding: 72px 60px;
}
@media (max-width: 768px) {
  .ncdr-section { padding: 48px 20px; }
}

/* ── ANNOUNCEMENT BAR ── */
.announcement-bar {
  background: var(--ncdr-gold);
  color: var(--ncdr-green-deep);
  text-align: center;
  padding: 8px 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ── DEALER BADGE ── */
.dealer-badge {
  display: inline-block;
  background: rgba(58,88,43,0.08);
  border: 1px solid rgba(58,88,43,0.2);
  color: var(--ncdr-green);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 2px;
}

/* ── STEP NUMBERS ── */
.step-num {
  width: 28px;
  height: 28px;
  background: var(--ncdr-green);
  color: white;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  margin-right: 12px;
}
```

---

## 10. Navigation — `config/settings_data.json`

Main menu structure:
```
Shop
  New Releases → /collections/new-releases
  Clubs → /collections/clubs
    Drivers → /collections/drivers
    Fairway Woods → /collections/fairway-woods
    Hybrids → /collections/hybrids
    Irons → /collections/irons
    Putters → /collections/putters
    Complete Sets → /collections/complete-sets
  Golf Balls → /collections/golf-balls
  Northcrest Exclusive → /collections/northcrest-exclusive
  Sale → /collections/sale
Brands
  Majesty → /collections/majesty
  Honma → /collections/honma
  XXIO → /collections/xxio
  TaylorMade → /collections/taylormade
  Callaway → /collections/callaway
  Mizuno → /collections/mizuno
  Cleveland → /collections/cleveland
Memberships → /pages/memberships
Programs → /pages/programs
Simulators → /pages/simulators
Events → /pages/events
Lessons → /pages/lesson
Repair → /pages/repair
Trade-Ins → /pages/trade-ins
Contact → /pages/contact
```

Footer menu:
```
Shop: Clubs, Golf Balls, New Releases, Sale, All Products
Experience: Memberships, Programs, Simulators, Events, Lessons, Club Repair
Info: Trade-Ins, About, Contact, Hours & Location, Instagram, Facebook
```

---

## 11. SEO Configuration

In each page's Liquid template, set:
```liquid
{% assign page_title = page.title | append: ' | Northcrest Golf Driving Range Atlanta' %}
```

Target keywords by page:
- Home: "driving range Atlanta", "driving range near me", "golf lessons Atlanta"
- Lesson: "golf lessons Atlanta", "long drive instruction Atlanta"
- Simulators: "indoor golf simulator Atlanta", "Golfzon Atlanta"
- Trade-Ins: "golf club trade-in Atlanta"
- Shop: "golf equipment Atlanta", "Honma dealer Atlanta", "Majesty golf Atlanta"

Local business schema — add to `layout/theme.liquid` in `<head>`:
```json
{
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "name": "Northcrest Golf Driving Range",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "3545 Northcrest Road",
    "addressLocality": "Atlanta",
    "addressRegion": "GA",
    "postalCode": "30340"
  },
  "telephone": "(770) 723-0002",
  "openingHours": ["Mo-Sa 09:00-23:00", "Su 09:00-21:00"],
  "url": "https://www.northcrestgolf.com"
}
```

---

## 12. Integrations Reference

| Integration | How it connects to Dawn/Shopify |
|---|---|
| Shopify Payments | Enable in Shopify Admin → Settings → Payments |
| SKU IQ (Clover sync) | Install from Shopify App Store — no theme changes needed |
| Klaviyo | Install app → email/SMS consent checkbox added to checkout |
| PassSlot / PassKit | Connect via Zapier — triggers on Shopify order webhook |
| Google & YouTube channel | Install free app — product feed auto-syncs |
| Meta Commerce Manager | Install free Facebook & Instagram app |
| Google Analytics 4 | Add GA4 tag via Shopify Admin → Online Store → Preferences |

---

## 13. Mobile Requirements

Dawn is mobile-first by default. Additional NCDR-specific mobile rules:

```css
@media (max-width: 749px) {
  /* Stack tier cards vertically */
  .tier-grid { grid-template-columns: 1fr; }

  /* Full-width CTAs */
  .hero-ctas { flex-direction: column; }
  .hero-ctas .button { width: 100%; text-align: center; }

  /* Reduce hero padding */
  .hero-content { padding: 40px 20px; }

  /* Stack coach feature */
  .coach-feature { flex-direction: column; }
  .coach-photo { width: 100%; height: 240px; }
}
```

---

## 14. File Edit Checklist for Claude Code

Work through these files in order:

- [ ] `assets/base.css` — add all CSS variables and utility classes from sections 3 and 9
- [ ] `config/settings_data.json` — apply color tokens, typography settings
- [ ] `layout/theme.liquid` — add announcement bar, local schema JSON-LD, GA4 tag
- [ ] `sections/header.liquid` — green background, logo, nav styles, Join Now CTA
- [ ] `sections/footer.liquid` — deep green, four columns, dealer badges
- [ ] `sections/image-banner.liquid` — hero styles, stats strip
- [ ] Create `sections/ncdr-facility-strip.liquid` — new custom section
- [ ] Create `sections/ncdr-coach-feature.liquid` — new custom section
- [ ] Create `sections/ncdr-memberships.liquid` — new custom section
- [ ] Create `sections/ncdr-tradein-banner.liquid` — new custom section
- [ ] Create `sections/ncdr-events-banner.liquid` — new custom section
- [ ] `templates/index.json` — homepage section order and config
- [ ] `sections/main-collection-product-grid.liquid` — filter sidebar, products per row
- [ ] `sections/main-product.liquid` — brand label, dealer badge, authorized dealer snippet
- [ ] Create `snippets/product-badge.liquid` — Honma/Majesty dealer badge
- [ ] Create `templates/page.lesson.json`
- [ ] Create `templates/page.trade-ins.json`
- [ ] Create `templates/page.memberships.json`
- [ ] Create `templates/page.simulators.json`
- [ ] Create `templates/page.events.json`
- [ ] Create `templates/page.programs.json`
- [ ] Create `templates/page.repair.json`
- [ ] Create `templates/page.contact.json`

---

## 15. Claude Code Session Opener

Paste this at the start of every Claude Code session working on this project:

---

> I'm customizing a Shopify Dawn theme for Northcrest Golf Driving Range (NCDR) in Atlanta, GA. The downloaded theme zip is attached.
>
> Key context:
> - Brand colors: NCDR green `#3A582B`, NCDR gold `#C9A84C`
> - White-dominant design — green used in 5 key moments only (header, hero, instructor section, events banner, footer)
> - Primary visitor action: browse pro shop inventory
> - 265 products already imported across 19 collections
> - Instructors: PGA-certified professionals listed on the Lesson page
> - New page: Trade-Ins (in addition to all current Duda pages)
>
> The full spec is in `NCDR_Shopify_Dawn_Spec.md` — read it completely before making any changes.
>
> Work through the File Edit Checklist in Section 14 in order. Explain each change before making it. After each file edit, tell me what to look for when I preview the theme.

---

*Document maintained by D'Marquis — IT/Operations Lead, Northcrest Golf Driving Range*
*Version 2.0 — Updated from WooCommerce spec to Shopify Dawn | June 2026*
