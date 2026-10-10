import { useState } from "react";
import { useApp } from "../../context/useApp.js";
import Modal from "../modal";
import styles from "./styles.module.css";

const RunPlaybook = ({ playbookId }) => {
    const { playbooks, customers, runPlaybook, closeDialog } = useApp();
    const playbook = playbooks.find((item) => item.id === playbookId);
    const [accountId, setAccountId] = useState(customers[0]?.id || "");

    if (!playbook) return null;

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!accountId) return;
        runPlaybook(playbook.id, accountId);
        closeDialog();
    };

    return (
        <Modal
            description="Choose a customer and add this playbook's steps to the shared task list."
            onClose={closeDialog}
            title="Start a playbook"
        >
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.summary}>
                    <span>{playbook.category}</span>
                    <h3>{playbook.title}</h3>
                    <p>{playbook.description}</p>
                </div>
                <label className={styles.field}>
                    <span>Customer account</span>
                    <select
                        data-autofocus
                        disabled={!customers.length}
                        onChange={(event) => setAccountId(event.target.value)}
                        value={accountId}
                    >
                        {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name}
                            </option>
                        ))}
                    </select>
                </label>
                <div className={styles.steps}>
                    <strong>
                        {playbook.steps.length} steps will be added to the task
                        list
                    </strong>
                    <ol>
                        {playbook.steps.map((step, index) => (
                            <li key={step}>
                                <span>
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                {step}
                            </li>
                        ))}
                    </ol>
                </div>
                {!customers.length && (
                    <p className={styles.error}>
                        Add a customer before starting this playbook.
                    </p>
                )}
                <div className={styles.actions}>
                    <button
                        className={styles.cancelButton}
                        onClick={closeDialog}
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        className={styles.submitButton}
                        disabled={!customers.length}
                        type="submit"
                    >
                        Create tasks
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default RunPlaybook;
