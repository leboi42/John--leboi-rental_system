# Haven — Rental Management

A responsive rental property management app that runs in a modern browser without a build step or external services.

## Run it

Open `index.html` in a modern browser. Your records are stored in that browser's local storage.

## Included

- Portfolio dashboard with occupancy, monthly rent, overdue rent, and recent payment activity
- Property, tenant, lease, payment, and maintenance records
- Add, edit, search, and delete workflows for each record type
- Validation that prevents two active leases on the same property and invalid lease date ranges
- Payment tracking, CSV exports, JSON backup, and demo-data restore
- Responsive layout for desktop, tablet, and mobile

## Data and privacy

This is a self-contained, single-user starter app. Data remains in the current browser profile; it is not sent to a server and is not shared across devices. Use **Export backup** regularly before clearing browser storage. Demo data can be restored from the sidebar.

For multi-user or production use, connect the interface to an authenticated API and durable database, add server-side authorization and audit logging, and review applicable local landlord-tenant, privacy, and accounting requirements.
