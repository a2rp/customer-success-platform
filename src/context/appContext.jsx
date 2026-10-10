import { useState } from "react";
import { AppContext } from "./context.js";

const initialCustomers = [
    { id: "meridian", name: "Meridian Health", domain: "meridian.health", industry: "Healthcare", plan: "Enterprise", arr: 184000, health: 94, status: "Healthy", renewal: "2027-01-18", owner: "Olivia Chen", contact: "Maya Brooks", email: "maya@meridian.health", avatar: "customer-1.jpg", notes: "Expanding their care coordination rollout to two new regions.", updated: "Today" },
    { id: "northstar", name: "Northstar Labs", domain: "northstarlabs.com", industry: "Technology", plan: "Growth", arr: 126000, health: 82, status: "Healthy", renewal: "2026-12-03", owner: "Jordan Lee", contact: "Ethan Cole", email: "ethan@northstarlabs.com", avatar: "customer-2.jpg", notes: "Strong product adoption. Champions are planning the annual review.", updated: "Yesterday" },
    { id: "copper", name: "Copper & Pine", domain: "copperpine.co", industry: "Retail", plan: "Growth", arr: 88000, health: 68, status: "Watch", renewal: "2026-11-16", owner: "Olivia Chen", contact: "Priya Shah", email: "priya@copperpine.co", avatar: "customer-3.jpg", notes: "Weekly check-ins are helping after a slower launch month.", updated: "2 days ago" },
    { id: "daybreak", name: "Daybreak Finance", domain: "daybreak.finance", industry: "Fintech", plan: "Enterprise", arr: 212000, health: 47, status: "At risk", renewal: "2026-11-09", owner: "Sam Rivera", contact: "Marcus Reed", email: "marcus@daybreak.finance", avatar: "customer-4.jpg", notes: "Executive sponsor changed. Rebuilding relationships before renewal.", updated: "Today" },
    { id: "fieldwork", name: "Fieldwork Studio", domain: "fieldwork.studio", industry: "Design", plan: "Starter", arr: 36000, health: 91, status: "Healthy", renewal: "2027-03-22", owner: "Jordan Lee", contact: "Lena Park", email: "lena@fieldwork.studio", avatar: "customer-5.jpg", notes: "A product advocate with a growing team of daily users.", updated: "3 days ago" },
    { id: "atlas", name: "Atlas Energy", domain: "atlas.energy", industry: "Energy", plan: "Enterprise", arr: 164000, health: 58, status: "At risk", renewal: "2026-10-28", owner: "Sam Rivera", contact: "Noah Williams", email: "noah@atlas.energy", avatar: "customer-6.jpg", notes: "Adoption is uneven across field teams. An enablement plan is in progress.", updated: "Yesterday" },
    { id: "juniper", name: "Juniper Learning", domain: "juniperlearning.io", industry: "Education", plan: "Growth", arr: 72000, health: 76, status: "Watch", renewal: "2027-02-14", owner: "Olivia Chen", contact: "Sofia Garcia", email: "sofia@juniperlearning.io", avatar: "customer-7.jpg", notes: "New department rollout is scheduled for next month.", updated: "4 days ago" },
    { id: "goodkind", name: "Goodkind Market", domain: "goodkind.market", industry: "Retail", plan: "Starter", arr: 42000, health: 88, status: "Healthy", renewal: "2027-04-08", owner: "Jordan Lee", contact: "Ava Thompson", email: "ava@goodkind.market", avatar: "customer-8.jpg", notes: "Recently shared a positive customer story with the team.", updated: "5 days ago" },
];

const initialTasks = [
    { id: "task-1", title: "Share the Q4 adoption review", accountId: "daybreak", due: "2026-10-10", owner: "Sam Rivera", priority: "High", status: "Open", category: "Renewal" },
    { id: "task-2", title: "Confirm launch training dates", accountId: "copper", due: "2026-10-11", owner: "Olivia Chen", priority: "High", status: "Open", category: "Onboarding" },
    { id: "task-3", title: "Send the monthly success note", accountId: "northstar", due: "2026-10-12", owner: "Jordan Lee", priority: "Normal", status: "Open", category: "Relationship" },
    { id: "task-4", title: "Review open support themes", accountId: "atlas", due: "2026-10-13", owner: "Sam Rivera", priority: "High", status: "Open", category: "Adoption" },
    { id: "task-5", title: "Prepare champion spotlight", accountId: "meridian", due: "2026-10-14", owner: "Olivia Chen", priority: "Normal", status: "Open", category: "Advocacy" },
    { id: "task-6", title: "Close onboarding feedback loop", accountId: "fieldwork", due: "2026-10-08", owner: "Jordan Lee", priority: "Low", status: "Done", category: "Onboarding" },
];

const initialPlaybooks = [
    { id: "playbook-onboarding", title: "A confident first 30 days", description: "A guided launch that gives every new customer a clear path to value.", category: "Onboarding", steps: ["Welcome and align on outcomes", "Invite the working team", "Complete the first value review", "Share the 30-day success plan"], runs: 18, active: true, color: "mint" },
    { id: "playbook-renewal", title: "Renewal, with room to grow", description: "Start renewal conversations early and make the next chapter easy to see.", category: "Renewal", steps: ["Map the decision team", "Review outcomes and adoption", "Share the renewal proposal", "Confirm next-year goals"], runs: 12, active: true, color: "sand" },
    { id: "playbook-risk", title: "A thoughtful recovery plan", description: "Bring the right people together when customer health begins to shift.", category: "At risk", steps: ["Review recent signals", "Meet with the customer champion", "Agree on a recovery milestone", "Check progress together"], runs: 7, active: true, color: "peach" },
    { id: "playbook-advocacy", title: "Make success visible", description: "Turn meaningful customer outcomes into stories worth sharing.", category: "Advocacy", steps: ["Ask for a short outcome interview", "Draft the customer story", "Share for approval"], runs: 5, active: false, color: "blue" },
];

const initialNotifications = [
    { id: "notification-1", title: "Renewal coming up", detail: "Daybreak Finance renews in 30 days.", accountId: "daybreak", read: false, time: "10 min ago" },
    { id: "notification-2", title: "Health score changed", detail: "Atlas Energy moved into At risk.", accountId: "atlas", read: false, time: "1 hour ago" },
    { id: "notification-3", title: "New customer feedback", detail: "Meridian Health shared a new note.", accountId: "meridian", read: true, time: "Yesterday" },
];

const initialActivity = [
    { id: "activity-1", text: "Sam added a renewal review for Daybreak Finance", time: "10 min ago", type: "task" },
    { id: "activity-2", text: "Atlas Energy health moved to At risk", time: "1 hour ago", type: "health" },
    { id: "activity-3", text: "Maya Brooks shared a new success note", time: "Yesterday", type: "note" },
];

const makeId = (prefix) => prefix + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);

export const AppProvider = ({ children }) => {
    const [customers, setCustomers] = useState(initialCustomers);
    const [tasks, setTasks] = useState(initialTasks);
    const [playbooks, setPlaybooks] = useState(initialPlaybooks);
    const [notifications, setNotifications] = useState(initialNotifications);
    const [activity, setActivity] = useState(initialActivity);
    const [dialog, setDialog] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [workspace, setWorkspace] = useState({ name: "Harbor Studio", showBadges: true }); const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const addToast = (message, type = "success") => {
        const id = makeId("toast");
        setToasts((current) => [...current, { id, message, type }]);
        return id;
    };
    const dismissToast = (id) => setToasts((current) => current.filter((toast) => toast.id !== id));
    const openDialog = (type, data = {}) => setDialog({ type, data });
    const closeDialog = () => setDialog(null);
    const addActivity = (text, type = "update") => {
        setActivity((current) => [{ id: makeId("activity"), text, time: "Just now", type }, ...current].slice(0, 8));
    };

    const addCustomer = (values) => {
        const customer = { ...values, id: makeId("account"), avatar: "customer-1.jpg", updated: "Just now" };
        setCustomers((current) => [customer, ...current]);
        addActivity("You added " + customer.name, "account");
        addToast(customer.name + " added to your customers");
        return customer;
    };
    const updateCustomer = (id, values) => {
        setCustomers((current) => current.map((customer) => customer.id === id ? { ...customer, ...values, updated: "Just now" } : customer));
        addActivity("You updated " + (values.name || "a customer") + "'s account", "account");
        addToast((values.name || "Customer") + " updated");
    };
    const deleteCustomer = (id) => {
        const customer = customers.find((item) => item.id === id);
        if (!customer) return;
        setCustomers((current) => current.filter((item) => item.id !== id));
        setTasks((current) => current.filter((task) => task.accountId !== id));
        addActivity("You removed " + customer.name, "account");
        addToast(customer.name + " and its linked tasks were removed", "info");
    };
    const addTask = (values) => {
        const task = { ...values, id: makeId("task"), status: "Open" };
        setTasks((current) => [task, ...current]);
        const account = customers.find((item) => item.id === task.accountId);
        addActivity("You added a task for " + (account?.name || "a customer"), "task");
        addToast("Task added to your list");
        return task;
    };
    const updateTask = (id, values) => {
        setTasks((current) => current.map((task) => task.id === id ? { ...task, ...values } : task));
        addActivity("You updated " + (values.title || "a task"), "task");
        addToast("Task updated");
    };
    const deleteTask = (id) => {
        const task = tasks.find((item) => item.id === id);
        if (!task) return;
        setTasks((current) => current.filter((item) => item.id !== id));
        addActivity("You removed " + task.title, "task");
        addToast("Task removed", "info");
    };
    const toggleTask = (id) => {
        const task = tasks.find((item) => item.id === id);
        if (!task) return;
        const status = task.status === "Done" ? "Open" : "Done";
        setTasks((current) => current.map((item) => item.id === id ? { ...item, status } : item));
        addActivity("You marked " + task.title + " " + (status === "Done" ? "complete" : "open"), "task");
        addToast(status === "Done" ? "Task completed" : "Task reopened", "info");
    };
    const addPlaybook = (values) => {
        const playbook = { ...values, id: makeId("playbook"), runs: 0, active: true, color: "mint" };
        setPlaybooks((current) => [playbook, ...current]);
        addActivity("You created the " + playbook.title + " playbook", "playbook");
        addToast(playbook.title + " created");
        return playbook;
    };
    const updatePlaybook = (id, values) => {
        setPlaybooks((current) => current.map((item) => item.id === id ? { ...item, ...values } : item));
        addActivity("You updated " + (values.title || "a playbook"), "playbook");
        addToast("Playbook updated");
    };
    const deletePlaybook = (id) => {
        const playbook = playbooks.find((item) => item.id === id);
        if (!playbook) return;
        setPlaybooks((current) => current.filter((item) => item.id !== id));
        addActivity("You removed the " + playbook.title + " playbook", "playbook");
        addToast(playbook.title + " removed", "info");
    };
    const togglePlaybook = (id) => {
        const playbook = playbooks.find((item) => item.id === id);
        if (!playbook) return;
        setPlaybooks((current) => current.map((item) => item.id === id ? { ...item, active: !item.active } : item));
        addToast(playbook.title + (playbook.active ? " paused" : " activated"), "info");
    };
    const runPlaybook = (playbookId, accountId) => {
        const playbook = playbooks.find((item) => item.id === playbookId);
        const customer = customers.find((item) => item.id === accountId);
        if (!playbook || !customer) return;
        const generatedTasks = playbook.steps.map((step, index) => ({
            id: makeId("task"),
            title: step,
            accountId,
            due: new Date(Date.now() + (index + 1) * 86400000).toISOString().slice(0, 10),
            owner: customer.owner,
            priority: index === 0 ? "High" : "Normal",
            status: "Open",
            category: playbook.category,
        }));
        setTasks((current) => [...generatedTasks, ...current]);
        setPlaybooks((current) => current.map((item) => item.id === playbookId ? { ...item, runs: item.runs + 1 } : item));
        addActivity("You started " + playbook.title + " for " + customer.name, "playbook");
        addToast(playbook.title + " started for " + customer.name);
    };
    const markAllNotificationsRead = () => setNotifications((current) => current.map((item) => ({ ...item, read: true }))); const markNotificationRead = (id) => setNotifications((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));


    const value = {
        customers, tasks, playbooks, notifications, activity, dialog, toasts, workspace,
        addToast, dismissToast, openDialog, closeDialog, addCustomer, updateCustomer, deleteCustomer,
        addTask, updateTask, deleteTask, toggleTask, addPlaybook, updatePlaybook, deletePlaybook,
        togglePlaybook, runPlaybook, markAllNotificationsRead, markNotificationRead, setWorkspace, mobileNavOpen, setMobileNavOpen,
    };
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};



