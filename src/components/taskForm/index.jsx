import { useState } from "react";
import { useApp } from "../../context/useApp.js";
import Modal from "../modal";
import styles from "./styles.module.css";

const TaskForm = ({ taskId }) => {
    const { customers, tasks, addTask, updateTask, closeDialog } = useApp();
    const task = tasks.find((item) => item.id === taskId);
    const [values, setValues] = useState(() => task ? { ...task } : {
        title: "", accountId: customers[0]?.id || "", due: "", owner: "Olivia Chen",
        priority: "Normal", category: "Relationship", status: "Open",
    });
    const [error, setError] = useState("");

    const handleChange = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!values.title.trim() || !values.accountId || !values.due) {
            setError("Add a task name, customer, and due date.");
            return;
        }
        const cleanValues = { ...values, title: values.title.trim() };
        if (task) updateTask(task.id, cleanValues);
        else addTask(cleanValues);
        closeDialog();
    };

    return (
        <Modal description="Give the next customer-success action a clear owner and due date." onClose={closeDialog} title={task ? "Edit task" : "Add a task"}>
            <form className={styles.form} noValidate onSubmit={handleSubmit}>
                <label className={styles.field}>
                    <span>Task name</span>
                    <input data-autofocus name="title" onChange={handleChange} placeholder="What needs to happen next?" value={values.title} />
                </label>
                <div className={styles.grid}>
                    <label className={styles.field}>
                        <span>Customer</span>
                        <select disabled={!customers.length} name="accountId" onChange={handleChange} value={values.accountId}>
                            {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
                        </select>
                    </label>
                    <label className={styles.field}>
                        <span>Due date</span>
                        <input name="due" onChange={handleChange} type="date" value={values.due} />
                    </label>
                    <label className={styles.field}>
                        <span>Owner</span>
                        <select name="owner" onChange={handleChange} value={values.owner}>
                            {["Olivia Chen", "Jordan Lee", "Sam Rivera"].map((item) => <option key={item}>{item}</option>)}
                        </select>
                    </label>
                    <label className={styles.field}>
                        <span>Priority</span>
                        <select name="priority" onChange={handleChange} value={values.priority}>
                            {["Low", "Normal", "High"].map((item) => <option key={item}>{item}</option>)}
                        </select>
                    </label>
                    <label className={styles.field}>
                        <span>Work type</span>
                        <select name="category" onChange={handleChange} value={values.category}>
                            {["Onboarding", "Adoption", "Renewal", "Relationship", "Advocacy", "Follow-up"].map((item) => <option key={item}>{item}</option>)}
                        </select>
                    </label>
                    <label className={styles.field}>
                        <span>Status</span>
                        <select name="status" onChange={handleChange} value={values.status}>
                            <option>Open</option><option>Done</option>
                        </select>
                    </label>
                </div>
                {error && <p className={styles.error} role="alert">{error}</p>}
                <div className={styles.actions}>
                    <button className={styles.cancelButton} onClick={closeDialog} type="button">Cancel</button>
                    <button className={styles.submitButton} disabled={!customers.length} type="submit">{task ? "Save task" : "Add task"}</button>
                </div>
            </form>
        </Modal>
    );
};

export default TaskForm;

