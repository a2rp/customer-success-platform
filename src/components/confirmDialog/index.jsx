import { FiAlertTriangle } from "react-icons/fi";
import Modal from "../modal";
import styles from "./styles.module.css";

const ConfirmDialog = ({ title, description, confirmLabel, onConfirm, onClose }) => (
    <Modal description="Review this change before confirming." onClose={onClose} size="small" title={title}>
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

export default ConfirmDialog;


