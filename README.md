# TutorHub — Client

> A modern tutoring platform connecting students with qualified tutors. Built with React, featuring role-based dashboards, real-time messaging, and a fully responsive dark/light mode UI.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [UI Component Library](#ui-component-library)
- [Role-Based Access](#role-based-access)
- [Dark Mode](#dark-mode)
- [Pages & Routes](#pages--routes)

---

## Features

- **Role-based dashboards** — separate views for Admin, Tutor, and Student
- **Tuition marketplace** — browse, search, filter, and apply for tuitions
- **Real-time messaging** — Socket.io powered chat between tutors and students
- **Class calendar** — schedule and track upcoming sessions
- **Stripe payments** — secure payment checkout for tuition fees
- **Tutor reviews** — star ratings and written reviews
- **Dark / light mode** — system preference detection with manual toggle, persisted to localStorage
- **Reusable UI library** — Button, Input, Card, Badge, Modal, Table, Dropdown components
- **Fully responsive** — mobile-first design across all screen sizes

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS + DaisyUI |
| Routing | React Router v7 |
| HTTP Client | Axios |
| Real-time | Socket.io Client |
| Payments | Stripe.js |
| Animations | Framer Motion |
| Notifications | React Toastify |
| Auth | Firebase (Google OAuth) + JWT |

---

## Project Structure

```
src/
├── components/           # Shared components
│   ├── ui/               # Reusable UI library (Button, Card, Badge, etc.)
│   │   └── index.jsx
│   ├── Loading.jsx
│   ├── Navbar.jsx
│   ├── TutorReviews.jsx
│   └── ...
├── pages/                # Route-level pages
│   ├── Home.jsx
│   ├── AllTuitions.jsx
│   ├── AllTutors.jsx
│   ├── TuitionDetails.jsx
│   ├── TutorProfile.jsx
│   ├── Login.jsx
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageUsers.jsx
│   │   │   └── ManageTuitions.jsx
│   │   ├── tutor/
│   │   │   ├── TutorDashboard.jsx
│   │   │   ├── TutorApplications.jsx
│   │   │   ├── TutorOngoingTuitions.jsx
│   │   │   ├── TutorRevenue.jsx
│   │   │   └── MessagesPage.jsx
│   │   └── student/
│   │       ├── StudentDashboard.jsx
│   │       ├── PostTuition.jsx
│   │       └── PaymentCheckout.jsx
├── Provider/
│   └── AuthProvider.jsx   # Auth context + role detection
├── layouts/
│   ├── RootLayout.jsx     # Dark mode context provider
│   └── DashboardLayout.jsx
├── hooks/
│   └── useDarkMode.js
└── index.css              # CSS custom properties (design tokens)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- TutorHub server running locally (see [server README](../server/README.md))

### Installation

```bash
# Clone the repository
git clone https://github.com/nozibuddowla/tutorhub-client.git 
cd tutorhub-client

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# → Fill in your values (see Environment Variables below)

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## Environment Variables

Create a `.env` file in the root with the following:

```env
# API
VITE_API_URL=http://localhost:5000

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

> **Never commit your `.env` file.** It is already in `.gitignore`.

---

## UI Component Library

All reusable components live in `src/components/ui/index.jsx` and are dark-mode aware out of the box.

```jsx
import { Button, Input, Card, Badge, Modal, Table, Dropdown } from "@/components/ui";
```

### Button
```jsx
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger" loading={submitting}>Delete</Button>
<Button variant="ghost" icon="←">Back</Button>
```
Variants: `primary` · `secondary` · `ghost` · `danger`
Sizes: `sm` · `md` · `lg`

### Input
```jsx
<Input label="Email" type="email" icon="✉️" error={errors.email} />
<Input label="Salary" icon="৳" hint="Monthly in BDT" />
```

### Card
```jsx
<Card hover>
  <Card.Header divided><Card.Title>Title</Card.Title></Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer divided><Button>Action</Button></Card.Footer>
</Card>
```
Variants: `default` · `bordered` · `flat` · `gradient`

### Badge
```jsx
<Badge variant="green" dot>Approved</Badge>
<Badge variant="yellow" dot>Pending</Badge>
<Badge variant="purple" dot pulse>Live</Badge>
```
Variants: `purple` · `teal` · `green` · `yellow` · `red` · `blue` · `gray`

### Modal
```jsx
<Modal open={open} onClose={() => setOpen(false)} title="Edit"
  footer={<><Button variant="ghost">Cancel</Button><Button>Save</Button></>}>
  <Input label="Name" />
</Modal>
```

### Table
```jsx
const columns = [
  { key: "name",   label: "Name" },
  { key: "status", label: "Status", render: (v) => <Badge variant="green">{v}</Badge> },
];
<Table columns={columns} data={rows} loading={loading} empty="No data found" />
```

### Dropdown
```jsx
<Dropdown
  trigger={<Button>Actions ▾</Button>}
  items={[
    { label: "Edit",   icon: "✏️", onClick: handleEdit },
    { divider: true },
    { label: "Delete", icon: "🗑️", onClick: handleDelete, danger: true },
  ]}
/>
```

---

## Role-Based Access

Three roles are supported. Each role gets its own dashboard and navigation:

| Role | Dashboard Route | Key Features |
|---|---|---|
| **Admin** | `/dashboard/admin` | Manage users, approve tuitions, view reports |
| **Tutor** | `/dashboard/tutor` | Apply for tuitions, manage sessions, track revenue |
| **Student** | `/dashboard/student` | Post tuitions, hire tutors, make payments |

Role is stored in the database and retrieved on login. Protected routes redirect unauthenticated users to `/login`.

---

## Dark Mode

Dark mode uses a CSS custom properties system defined in `src/index.css`:

```css
:root {
  --bg-base:           #f8f9fa;
  --bg-surface:        #f1f3f5;
  --bg-elevated:       #ffffff;
  --text-primary:      #0d1117;
  --text-secondary:    #444d56;
  --text-muted:        #6a737d;
  /* ...and more */
}

.dark {
  --bg-base:           #0d1117;
  --bg-elevated:       #161b22;
  --text-primary:      #e6edf3;
  /* ...and more */
}
```

The `useDarkMode` hook handles:
- System preference detection via `prefers-color-scheme`
- Manual toggle persisted to `localStorage` under key `tutorhub-theme`
- Applies/removes `dark` class on `<html>`
- DaisyUI `data-theme` sync

---

## Pages & Routes

| Route | Component | Access |
|---|---|---|
| `/` | `Home` | Public |
| `/tuitions` | `AllTuitions` | Public |
| `/tuitions/:id` | `TuitionDetails` | Public (apply requires Tutor) |
| `/tutors` | `AllTutors` | Public |
| `/tutors/:id` | `TutorProfile` | Public |
| `/login` | `Login` | Public |
| `/dashboard/admin/*` | Admin pages | Admin only |
| `/dashboard/tutor/*` | Tutor pages | Tutor only |
| `/dashboard/student/*` | Student pages | Student only |