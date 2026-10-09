import { FiAlertTriangle } from "react-icons/fi";
import { useApp } from "../../context/appContext.jsx";
import Modal from "../modal";
import styles from "./styles.module.css";

const ConfirmDialog = ({ title, description, confirmLabel, onConfirm, onClose }) => (
    <Modal description={description} onClose={onClose} size="small" title={title}>
        <div className={styles.confirm}>
            <span aria-hidden="true" className={styles.icon}><FiAlertTriangle /></span>
            <p>{description}</p>
            <div className={styles.actions}>
                <button className={styles.cancelButton} data-autofocus onClick={onClose} type="button">Keep it</button>
                <button className={styles.deleteButton} onClick={onConfirm} type="button">{confirmLabel}</button>
            </div>
        </div>
    </Modal>
);

export const useConfirmAction = () => {
    const { openDialog } = useApp();
    return (entity, item) => openDialog("confirmDelete", { entity, id: item.id, name: item.name || item.title });
};

export default ConfirmDialog;
