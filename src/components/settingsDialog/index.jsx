import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import { useApp } from "../../context/useApp.js";
import Modal from "../modal";
import styles from "./styles.module.css";

const SettingsDialog = () => {
    const { workspace, setWorkspace, addToast, closeDialog } = useApp();
    const [name, setName] = useState(workspace.name);
    const [showBadges, setShowBadges] = useState(workspace.showBadges !== false);
    const [error, setError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!name.trim()) {
            setError("Workspace name cannot be empty.");
            return;
        }
        setWorkspace({ ...workspace, name: name.trim(), showBadges });
        addToast("Workspace settings saved");
        closeDialog();
    };

    return (
        <Modal description="Set the name and reminder display for this demo workspace." onClose={closeDialog} title="Workspace settings">
            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.field}>
                    <span>Workspace name</span>
                    <input data-autofocus maxLength="48" onChange={(event) => { setName(event.target.value); setError(""); }} value={name} />
                    {error && <small role="alert">{error}</small>}
                </label>
                <label className={styles.toggle}>
                    <span><strong>Show reminder badges</strong><small>Display unread notification counts in the header.</small></span>
                    <input checked={showBadges} onChange={(event) => setShowBadges(event.target.checked)} type="checkbox" />
                    <span aria-hidden="true" className={styles.switch}><FiCheck /></span>
                </label>
                <div className={styles.actions}>
                    <button className={styles.cancelButton} onClick={closeDialog} type="button">Cancel</button>
                    <button className={styles.saveButton} type="submit">Save settings</button>
                </div>
            </form>
        </Modal>
    );
};

export default SettingsDialog;

