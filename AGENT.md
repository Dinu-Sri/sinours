# Sinours Watercolor — Agent Management Structure

## What is an Agent?

In the Sinours ecosystem, an **Agent** is an authorized regional distributor or reseller. Agents are the primary sales channel — the Sinours website does not sell products directly. Artists and retailers contact agents to place orders and inquire about availability.

---

## Agent Data Model (Phase 1)

```prisma
model Agent {
  id        String
  name      String        // Agent business name
  region    String        // e.g. "East China", "Europe"
  country   String        // e.g. "China", "Japan", "Germany"
  contact   String?       // Primary contact person
  email     String?       // Agent email
  phone     String?       // Agent phone
  website   String?       // Agent website URL
  lat       Float?        // Latitude (for future map view)
  lng       Float?        // Longitude (for future map view)
  active    Boolean        // Only active agents are shown publicly
  sortOrder Int            // Manual sort priority
}
```

### Current Behavior (Phase 1)

- The `/agents` page displays a **read-only directory** of all active agents.
- Agents are grouped by region with anchor-link navigation.
- No login, no self-service, no territory management.

---

## Agent Management Roadmap

### Phase 2 — Agent Self-Service Portal

| Feature                          | Description                                           |
| -------------------------------- | ----------------------------------------------------- |
| Agent login                      | Email/password auth via NextAuth or custom JWT.       |
| Agent dashboard                  | View assigned territory, order history, commission.   |
| Profile management               | Update contact info, phone, website.                  |
| Inventory visibility             | See Sinours catalogue with wholesale pricing.         |
| Order placement                  | Submit orders directly from the dashboard.           |
| Commission tracking              | View earned commissions and payment status.           |

### Phase 3 — Admin Panel

| Feature                          | Description                                           |
| -------------------------------- | ----------------------------------------------------- |
| Agent CRUD                       | Create, update, deactivate agents.                    |
| Territory assignment             | Assign regions/countries to agents.                    |
| Sales analytics                  | Per-agent sales volume, top products, trends.         |
| Communication log                | Internal notes on agent interactions.                 |
| Automated commission calculation | Rule-based commission tiers and auto-calculation.    |

### Phase 4 — Advanced Features

| Feature                          | Description                                           |
| -------------------------------- | ----------------------------------------------------- |
| Map view                         | Interactive map of all agents with clickable regions.  |
| Agent tiering                    | Gold/Silver/Bronze tiers with different pricing.      |
| Marketing materials               | Branded collateral downloadable by agents.            |
| Multi-language agent portal      | Agent dashboard in agent's preferred language.         |

---

## Agent Directory Route

- **Public:** `/<locale>/agents` — lists all active agents.
- **Admin (future):** `/<locale>/admin/agents` — CRUD management.
- **Agent portal (future):** `/<locale>/portal` — agent self-service.

---

## Agent-Related Database Extensions (Future)

```prisma
// Phase 2+
model Order {
  id          String   @id @default(cuid())
  agentId     String
  agent       Agent    @relation(...)
  items       OrderItem[]
  status      OrderStatus
  total       Decimal
  createdAt   DateTime @default(now())
}

model Commission {
  id          String   @id @default(cuid())
  agentId     String
  agent       Agent    @relation(...)
  orderId     String
  amount      Decimal
  status      CommissionStatus
  paidAt      DateTime?
}
```

---

## Adding a New Agent (Phase 1 — Manual DB Insert)

```sql
INSERT INTO "Agent" (id, name, region, country, contact, email, phone, active, "sortOrder", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'New Agent Name',
  'Region Name',
  'Country',
  'Contact Person',
  'agent@example.com',
  '+1 555 0000',
  true,
  10,
  NOW(),
  NOW()
);
```

Or via Prisma Studio:

```bash
npm run db:studio
```

Then use the GUI to add/edit agents.

---

## Contact for Agent Inquiries

The `/contact` page has a form that stores messages in the `ContactMessage` table. Mark the subject with "Agent Inquiry" to filter these in the database or future admin panel.
