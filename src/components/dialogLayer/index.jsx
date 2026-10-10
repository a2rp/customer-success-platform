import ConfirmDialog from "../confirmDialog";
import CustomerDetails from "../customerDetails";
import CustomerForm from "../customerForm";
import PlaybookForm from "../playbookForm";
import ProfileDialog from "../profileDialog";
import RunPlaybook from "../runPlaybook";
import SettingsDialog from "../settingsDialog";
import TaskForm from "../taskForm";
import { useApp } from "../../context/useApp.js";

const DialogLayer = () => {
    const {
        dialog, customers, tasks, playbooks, closeDialog,
        deleteCustomer, deleteTask, deletePlaybook,
    } = useApp();

    if (!dialog) return null;
    const { type, data } = dialog;

    if (type === "customerForm") return <CustomerForm customerId={data.customerId} />;
    if (type === "customerDetails") return <CustomerDetails customerId={data.customerId} />;
    if (type === "taskForm") return <TaskForm taskId={data.taskId} />;
    if (type === "playbookForm") return <PlaybookForm playbookId={data.playbookId} />;
    if (type === "runPlaybook") return <RunPlaybook playbookId={data.playbookId} />;
    if (type === "profile") return <ProfileDialog />;
    if (type === "settings") return <SettingsDialog />;

    if (type === "confirmDelete") {
        const collections = { customer: customers, task: tasks, playbook: playbooks };
        const item = collections[data.entity]?.find((record) => record.id === data.id);
        if (!item) {
            closeDialog();
            return null;
        }
        const labels = {
            customer: {
                title: "Remove this customer?",
                description: "Remove " + item.name + " and all of its linked tasks from this demo workspace?",
                confirmLabel: "Remove customer",
                action: () => deleteCustomer(item.id),
            },
            task: {
                title: "Remove this task?",
                description: "Remove “" + item.title + "” from the shared task list?",
                confirmLabel: "Remove task",
                action: () => deleteTask(item.id),
            },
            playbook: {
                title: "Remove this playbook?",
                description: "Remove “" + item.title + "” and its reusable steps?",
                confirmLabel: "Remove playbook",
                action: () => deletePlaybook(item.id),
            },
        }[data.entity];

        return (
            <ConfirmDialog
                confirmLabel={labels.confirmLabel}
                description={labels.description}
                onClose={closeDialog}
                onConfirm={() => { labels.action(); closeDialog(); }}
                title={labels.title}
            />
        );
    }

    return null;
};

export default DialogLayer;

