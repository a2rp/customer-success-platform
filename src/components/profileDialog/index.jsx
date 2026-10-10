import { FiMail, FiUser } from "react-icons/fi";
import { useApp } from "../../context/useApp.js";
import Modal from "../modal";
import styles from "./styles.module.css";

const ProfileDialog = () => {
    const { closeDialog } = useApp();
    return (
        <Modal
            description="Your Harbor workspace profile."
            onClose={closeDialog}
            size="small"
            title="Your profile"
        >
            <div className={styles.profile}>
                <span aria-hidden="true" className={styles.avatar}>
                    OC
                </span>
                <h3>Olivia Chen</h3>
                <p>Customer success lead</p>
                <a href="mailto:olivia@harbor.example">
                    <FiMail aria-hidden="true" /> olivia@harbor.example
                </a>
                <div>
                    <FiUser aria-hidden="true" /> Workspace administrator
                </div>
                <button onClick={closeDialog} type="button">
                    Done
                </button>
            </div>
        </Modal>
    );
};

export default ProfileDialog;
