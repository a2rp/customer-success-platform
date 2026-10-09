import { useEffect, useId, useRef } from "react";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const Modal = ({ title, description, onClose, children, size = "medium" }) => {
    const titleId = useId();
    const descriptionId = useId();
    const dialogRef = useRef(null);

    useEffect(() => {
        const previousFocus = document.activeElement;
        const frame = window.requestAnimationFrame(() => {
            const autofocus = dialogRef.current?.querySelector("[data-autofocus]");
            const firstControl = dialogRef.current?.querySelector("button, input, select, textarea, a[href]");
            (autofocus || firstControl)?.focus();
        });
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.stopPropagation();
                onClose();
            }
            if (event.key === "Tab" && dialogRef.current) {
                const focusable = [...dialogRef.current.querySelectorAll("button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex='-1'])")];
                if (focusable.length < 1) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            window.cancelAnimationFrame(frame);
            document.removeEventListener("keydown", handleKeyDown);
            if (previousFocus instanceof HTMLElement) previousFocus.focus();
        };
    }, [onClose]);

    return (
        <div className={styles.overlay} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <section
                aria-describedby={description ? descriptionId : undefined}
                aria-labelledby={titleId}
                aria-modal="true"
                className={styles.dialog}
                data-size={size}
                ref={dialogRef}
                role="dialog"
            >
                <header className={styles.header}>
                    <div>
                        <h2 id={titleId}>{title}</h2>
                        {description && <p id={descriptionId}>{description}</p>}
                    </div>
                    <button aria-label="Close dialog" className={styles.closeButton} onClick={onClose} type="button">
                        <FiX aria-hidden="true" />
                    </button>
                </header>
                <div className={styles.body}>{children}</div>
            </section>
        </div>
    );
};

export default Modal;
