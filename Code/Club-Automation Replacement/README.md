# ClubFlow OS Skeleton

This is the first-pass shell for a club management platform inspired by the reference dashboard you shared. It is intentionally built as a clean front-end skeleton so we can flesh the system out module by module without repainting the whole app each time.

The shell is now split into focused pages so staff can take in most screens without long scrolling on desktop.

## What's included

- A shared left-rail navigation pattern for major operational areas
- Separate pages for overview, members, check-in, schedules, analytics, outreach, tools, and events
- A sign-in dialog with a "stay logged in for the day" option
- Compact KPI and workflow layouts intended to fit in a single desktop view
- A lightweight JavaScript data layer so each page is already config-driven

## Files

- `index.html`: overview page entry point
- `members.html`, `checkin.html`, `schedules.html`, `analytics.html`, `outreach.html`, `tools.html`, `events.html`: focused page entry points
- `styles.css`: layout, visual language, responsive behavior
- `app.js`: shared shell, page config, filtering, and sign-in handling

## Recommended build order

1. Member accounts and family relationships
2. Check-in and guest pass flows
3. Scheduling engine for courts, classes, and staff
4. POS and transaction history
5. Reporting, communications, and permissions

## Next piece to flesh out

The strongest next slice is the member/check-in system. It tends to sit at the center of:

- front desk lookup
- guest handling
- visit history
- billing/account context
- program registration eligibility

Once Node or another app toolchain is available on this machine, we can also migrate this into React, add routing, create a mock API, and start building real screens behind each tile.
