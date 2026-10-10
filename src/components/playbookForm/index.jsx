import { useState } from "react";
import { useApp } from "../../context/useApp.js";
import Modal from "../modal";
import styles from "./styles.module.css";

const PlaybookForm = ({ playbookId }) => {
    const { playbooks, addPlaybook, updatePlaybook, closeDialog } = useApp();
    const playbook = playbooks.find((item) => item.id === playbookId);
    const [values, setValues] = useState(() => playbook ? { ...playbook, stepText: playbook.steps.join("\n") } : {
        title: "", description: "", category: "Onboarding", stepText: "Welcome to the partnership\nAgree on desired outcomes\nSet the next check-in",
    });
    const [error, setError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        const steps = values.stepText.split("\n").map((step) => step.trim()).filter(Boolean);
        if (!values.title.trim() || !values.description.trim() || !steps.length) {
            setError("Add a title, a short description, and at least one step.");
            return;
        }
        const cleanValues = { title: values.title.trim(), description: values.description.trim(), category: values.category, steps };
        if (playbook) updatePlaybook(playbook.id, cleanValues);
        else addPlaybook(cleanValues);
        closeDialog();
    };

    return (
        <Modal description="Turn a repeatable customer moment into a clear plan." onClose={closeDialog} title={playbook ? "Edit playbook" : "Create a playbook"}>
            <form className={styles.form} noValidate onSubmit={handleSubmit}>
                <label className={styles.field}>
                    <span>Playbook name</span>
                    <input data-autofocus onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))} placeholder="e.g. New team onboarding" value={values.title} />
                </label>
                <label className={styles.field}>
                    <span>When to use it</span>
                    <select onChange={(event) => setValues((current) => ({ ...current, category: event.target.value }))} value={values.category}>
                        {["Onboarding", "Adoption", "Renewal", "At risk", "Advocacy"].map((item) => <option key={item}>{item}</option>)}
                    </select>
                </label>
                <label className={styles.field}>
                    <span>Short description</span>
                    <textarea onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))} placeholder="What outcome will this plan support?" rows="2" value={values.description} />
                </label>
                <label className={styles.field}>
                    <span>Steps <small>One step per line</small></span>
                    <textarea className={styles.stepsInput} onChange={(event) => setValues((current) => ({ ...current, stepText: event.target.value }))} rows="5" value={values.stepText} />
                </label>
                {error && <p className={styles.error} role="alert">{error}</p>}
                <div className={styles.actions}>
                    <button className={styles.cancelButton} onClick={closeDialog} type="button">Cancel</button>
                    <button className={styles.submitButton} type="submit">{playbook ? "Save changes" : "Create playbook"}</button>
                </div>
            </form>
        </Modal>
    );
};

export default PlaybookForm;

