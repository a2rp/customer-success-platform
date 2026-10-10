import { useState } from "react";
import {
    FiArrowUpRight,
    FiCheckCircle,
    FiMail,
    FiTrash2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/useApp.js";
import Modal from "../modal";
import styles from "./styles.module.css";

const CustomerDetails = ({ customerId }) => {
    const { customers, tasks, updateCustomer, closeDialog, openDialog } =
        useApp();
    const navigate = useNavigate();
    const customer = customers.find((item) => item.id === customerId);
    const [note, setNote] = useState("");
    if (!customer) return null;

    const linkedTasks = tasks
        .filter((task) => task.accountId === customer.id)
        .slice(0, 3);
    const avatarUrl = import.meta.env.BASE_URL + "assets/" + customer.avatar;
    const statusClass =
        customer.status === "Healthy"
            ? styles.healthy
            : customer.status === "Watch"
              ? styles.watch
              : styles.risk;
    const addNote = (event) => {
        event.preventDefault();
        if (!note.trim()) return;
        updateCustomer(customer.id, {
            notes: [customer.notes, note.trim()].filter(Boolean).join("\n\n"),
        });
        setNote("");
    };

    return (
        <Modal
            description={customer.domain + " customer account"}
            onClose={closeDialog}
            size="large"
            title="Customer overview"
        >
            <div className={styles.details}>
                <section className={styles.identity}>
                    <img alt="" src={avatarUrl} />
                    <div>
                        <div className={styles.nameLine}>
                            <h3>{customer.name}</h3>
                            <span className={statusClass}>
                                {customer.status}
                            </span>
                        </div>
                        <a
                            href={"https://" + customer.domain}
                            rel="noreferrer"
                            target="_blank"
                        >
                            {customer.domain}{" "}
                            <FiArrowUpRight aria-hidden="true" />
                        </a>
                        <p>
                            {customer.industry} <span>|</span> {customer.plan}{" "}
                            plan
                        </p>
                    </div>
                </section>
                <section
                    aria-label="Customer measures"
                    className={styles.metrics}
                >
                    <div>
                        <span>Health score</span>
                        <strong>
                            {customer.health}
                            <small>/100</small>
                        </strong>
                    </div>
                    <div>
                        <span>Annual value</span>
                        <strong>
                            &#36;{Number(customer.arr).toLocaleString()}
                        </strong>
                    </div>
                    <div>
                        <span>Renewal</span>
                        <strong>
                            {new Date(
                                customer.renewal + "T00:00:00",
                            ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </strong>
                    </div>
                </section>
                <div className={styles.columns}>
                    <section className={styles.card}>
                        <h4>Relationship</h4>
                        <p>{customer.contact}</p>
                        <a href={"mailto:" + customer.email}>
                            <FiMail aria-hidden="true" />
                            {customer.email}
                        </a>
                        <span>Success owner: {customer.owner}</span>
                    </section>
                    <section className={styles.card}>
                        <div className={styles.sectionHeading}>
                            <h4>Next steps</h4>
                            <span>{linkedTasks.length}</span>
                        </div>
                        {linkedTasks.length ? (
                            linkedTasks.map((task) => (
                                <div className={styles.taskLine} key={task.id}>
                                    <span
                                        className={
                                            task.status === "Done"
                                                ? styles.taskDone
                                                : styles.taskDot
                                        }
                                    >
                                        {task.status === "Done" && (
                                            <FiCheckCircle aria-hidden="true" />
                                        )}
                                    </span>
                                    <div>
                                        <strong>{task.title}</strong>
                                        <small>
                                            {new Date(
                                                task.due + "T00:00:00",
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </small>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noTasks}>
                                No customer tasks yet.
                            </p>
                        )}
                        <button
                            className={styles.viewTasks}
                            onClick={() => {
                                closeDialog();
                                navigate("/tasks");
                            }}
                            type="button"
                        >
                            View all tasks <FiArrowUpRight aria-hidden="true" />
                        </button>
                    </section>
                </div>
                <section className={styles.notesCard}>
                    <h4>Relationship notes</h4>
                    <p>
                        {customer.notes ||
                            "No notes yet. Add a useful detail about this relationship."}
                    </p>
                    <form onSubmit={addNote}>
                        <textarea
                            aria-label="Add a relationship note"
                            onChange={(event) => setNote(event.target.value)}
                            placeholder="Add a customer note..."
                            rows="2"
                            value={note}
                        />
                        <button disabled={!note.trim()} type="submit">
                            Add note
                        </button>
                    </form>
                </section>
                <div className={styles.actions}>
                    <button
                        className={styles.removeButton}
                        onClick={() =>
                            openDialog("confirmDelete", {
                                entity: "customer",
                                id: customer.id,
                                name: customer.name,
                            })
                        }
                        type="button"
                    >
                        <FiTrash2 aria-hidden="true" /> Remove customer
                    </button>
                    <button
                        className={styles.editButton}
                        onClick={() =>
                            openDialog("customerForm", {
                                customerId: customer.id,
                            })
                        }
                        type="button"
                    >
                        Edit account
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CustomerDetails;
