# Smart Label Command Center

Smart Label Command Center is an investor-ready Next.js demo for a simulated logistics intelligence platform. It combines a polished dark enterprise UI with mock logistics data, live demo-state controls, and operational screens for transit monitoring, events, analytics, settings, and shipment drill-downs.

## Overview

This MVP is designed for investor demos, screenshots, and Vercel deployment. It is intentionally mock-driven and does not connect to real IoT devices, GPS feeds, billing systems, or external APIs.

## Current MVP scope

- Command Center overview
- Transit map with Leaflet/OpenStreetMap
- Operational events and exception feed
- Shipment detail drill-downs
- Executive analytics and loss-prevention framing
- SaaS-style settings area
- Investor demo control panel with scenario presets and simulated alerts

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Leaflet + react-leaflet

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the app.

## Build

```bash
npm run build
```

## Main routes

- /
- /transit-map
- /events
- /shipments
- /shipments/[shipmentId]
- /analytics
- /settings
- /demo-control

## Notes

- All data is simulated for demo purposes.
- The map uses Leaflet with OpenStreetMap tiles and does not require a paid provider key.
- Demo-state updates flow across the core investor workspace where the existing controls are wired.

## Module status

Completed modules include:
- Command Center
- Transit Map
- Design System
- Mock Data Engine
- Events
- Shipment Detail
- Analytics
- Settings
- Investor Demo Control Panel

## Future roadmap

- Supabase backend
- Real authentication
- AWS IoT Core telemetry ingestion
- Hardware device ingestion
- Customer accounts
- TMS/ERP integrations
- Real-time alerting
- Production analytics
- Billing/subscription management
