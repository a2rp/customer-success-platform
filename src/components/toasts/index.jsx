import { useEffect } from "react";
import { FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import { useApp } from "../../context/useApp.js";
import styles from "./styles.module.css";

const ToastItem = ({ toast, dismissToast }) => {
    useEffect(() => {
        const timeout = window.setTimeout(() => dismissToast(toast.id), 5200);
        return () => window.clearTimeout(timeout);
    }, [dismissToast, toast.id]);

    return (
        <div
            className={styles.toast}
            data-type={toast.type}
            role={toast.type === "error" ? "alert" : "status"}
        >
            <span className={styles.icon}>
                {toast.type === "info" ? (
                    <FiInfo aria-hidden="true" />
                ) : (
                    <FiCheckCircle aria-hidden="true" />
                )}
            </span>
            <p>{toast.message}</p>
            <button
                aria-label="Dismiss notification"
                onClick={() => dismissToast(toast.id)}
                type="button"
            >
                <FiX aria-hidden="true" />
            </button>
        </div>
    );
};

const Toasts = () => {
    const { toasts, dismissToast } = useApp();
    return (
        <div aria-label="Notifications" className={styles.toasts}>
            {toasts.map((toast) => (
                <ToastItem
                    dismissToast={dismissToast}
                    key={toast.id}
                    toast={toast}
                />
            ))}
        </div>
    );
};

export default Toasts;
