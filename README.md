![Project screenshot](./screenshot.png)

# Harbor Customer Success Platform

Harbor is a polished customer success workspace for keeping account health, renewals, customer plans, and follow-up work together. This frontend-only React app includes five working product pages backed by shared in-memory demo data.

- **Live app:** [https://a2rp.github.io/customer-success-platform/](https://a2rp.github.io/customer-success-platform/)
- **Public repository:** [github.com/a2rp/customer-success-platform](https://github.com/a2rp/customer-success-platform)

## Pages

| Page | Route | What it does |
| --- | --- | --- |
| Overview | `/` | Shows portfolio health, revenue, customers needing attention, upcoming renewals, recent activity, and next actions. Change the health chart range, open account details, and complete a task here. |
| Customers | `/customers` | Search, filter, sort, and switch between list and card views. Add, edit, inspect, and remove customer accounts, and keep relationship notes with each account. |
| Playbooks | `/playbooks` | Create and edit reusable onboarding, renewal, recovery, and advocacy plans. Activate or pause plans, or run one for a customer to create real follow-up tasks. |
| Tasks | `/tasks` | Add, edit, complete, reopen, search, filter, sort, and remove customer follow-ups. Each task has a customer, owner, due date, category, priority, and status. |
| Insights | `/insights` | Review account health, revenue by plan, renewal coverage, and at-risk revenue. Export the current customer report as a CSV file. |
| Not found | Any unmatched route | Shows a recovery page with a link back to the workspace. |

The fixed header provides customer search (`Ctrl+K`), a customer creation shortcut, seeded reminders, repository access, and profile/workspace menus. On narrow screens the sidebar becomes a keyboard-accessible navigation drawer. The header remains visible while scrolling because the app has a persistent sidebar.

## Using Harbor

### Customer relationships

Search customers by company, contact, domain, or owner. Use the health and renewal filters, change the sort order, or switch between the full account table and responsive customer cards. A customer detail view includes account information, relationship notes, and linked tasks. Customer forms validate required fields, email addresses, ARR, health score, and renewal date. Deleting a customer requires confirmation and removes its linked demo tasks too.

### Playbooks and follow-up work

Create a playbook with a name, category, description, and ordered steps. A playbook can be paused or reactivated without deleting it. Running a plan for a customer creates one task per step in the shared task list, assigned to that customer's success owner. Task status, priority, due date, and customer can be changed later. Deletes have a custom confirmation dialog; canceling or closing the dialog leaves the record unchanged.

### Portfolio insights

The overview and insights are calculated from the current customer and task records. Revenue, health averages, customer status counts, renewal windows, and task counts update when those records change. The insights page can download `harbor-customer-health.csv` from the browser.

### Feedback and limits

Forms show inline validation. Successful actions, task changes, reminders, and exports provide visible feedback through toasts or custom dialogs. No action sends messages, changes a real CRM, or synchronizes an external calendar.

All demo data and changes live in React state in the current page session. Harbor does not use localStorage or another browser database. Refreshing the page restores the seeded sample data. The repository and deployment are public, but the app has no backend, team sign-in, or real customer records.

## Screenshots

These images were captured from the local production build with seeded demo data. Route screenshots show the complete page, and dialog screenshots show the corresponding working create, edit, detail, playbook, profile, and confirmation states.

### Pages

| Screen | Screenshot |
| --- | --- |
| Overview | ![Harbor overview dashboard](./screenshots/pages/overview.png) |
| Customers | ![Customer account list with health and renewal filters](./screenshots/pages/customers.png) |
| Customers on mobile | ![Responsive customer cards on a mobile viewport](./screenshots/pages/customers-mobile.png) |
| Playbooks | ![Reusable customer success playbooks](./screenshots/pages/playbooks.png) |
| Tasks | ![Customer follow-up task list](./screenshots/pages/tasks.png) |
| Insights | ![Customer health and revenue insights](./screenshots/pages/insights.png) |
| Not found | ![Unmatched route recovery page](./screenshots/pages/not-found.png) |

### Customer dialogs

| Dialog | Screenshot |
| --- | --- |
| Add customer | ![Add customer form and validation fields](./screenshots/modals/customer-create.png) |
| Edit customer | ![Edit customer form](./screenshots/modals/customer-edit.png) |
| Customer details | ![Customer detail panel with account notes and linked activity](./screenshots/modals/customer-details.png) |
| Remove customer confirmation | ![Confirmation before removing a customer and linked tasks](./screenshots/modals/customer-delete-confirm.png) |

### Task dialogs

| Dialog | Screenshot |
| --- | --- |
| Add task | ![Add a customer follow-up task](./screenshots/modals/task-create.png) |
| Edit task | ![Edit a customer task](./screenshots/modals/task-edit.png) |
| Remove task confirmation | ![Confirmation before removing a task](./screenshots/modals/task-delete-confirm.png) |

### Playbook dialogs

| Dialog | Screenshot |
| --- | --- |
| Create playbook | ![Create a reusable customer success playbook](./screenshots/modals/playbook-create.png) |
| Edit playbook | ![Edit playbook details and steps](./screenshots/modals/playbook-edit.png) |
| Run playbook | ![Choose a customer and review the tasks a playbook will create](./screenshots/modals/playbook-run.png) |
| Remove playbook confirmation | ![Confirmation before removing a playbook](./screenshots/modals/playbook-delete-confirm.png) |

### Workspace dialogs

| Dialog | Screenshot |
| --- | --- |
| Profile | ![Workspace user profile](./screenshots/modals/profile.png) |
| Workspace settings | ![Workspace name and reminder settings](./screenshots/modals/workspace-settings.png) |

## Run locally

Requirements: Node.js and npm.

```sh
npm install
npm run dev
```

Open the Vite URL at `/customer-success-platform/`, for example `http://localhost:5173/customer-success-platform/`.

## Quality checks and deployment

```sh
npm run lint
npm run build
npm run deploy
```

The build uses Vite's project base path and creates the GitHub Pages fallback page. `npm run deploy` builds the app and publishes the `dist` folder to the `gh-pages` branch.

Live site: [https://a2rp.github.io/customer-success-platform/](https://a2rp.github.io/customer-success-platform/).

## Future improvements

These improvements need a backend or external service and are not implemented in this frontend demo:

- Persist customer, task, and playbook changes in a shared database so teams can return to the same workspace across devices.
- Add team accounts, authentication, workspace membership, and role-based permissions.
- Connect optional CRM, calendar, and support tools through their APIs.
- Deliver reminders through email or calendar integrations instead of the seeded in-app notification examples.
- Store customer documents securely and maintain a server-side audit history for important account changes.

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/ashishranjan](https://buymeacoffee.com/ashishranjan)
- Patreon: [https://www.patreon.com/ashishranjan](https://www.patreon.com/ashishranjan)
