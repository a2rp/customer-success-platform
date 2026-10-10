import { useState } from "react";
import { FiArrowDown, FiCalendar, FiCheck, FiCheckCircle, FiClock, FiPlus, FiSearch, FiTrash2, FiUsers } from "react-icons/fi";
import CustomerAvatar from "../../components/customerAvatar";
import PageHeading from "../../components/pageHeading";
import { formatDate, getCustomer, getDateAfter, getToday } from "../../utils.js";
import { useApp } from "../../context/useApp.js";
import styles from "./styles.module.css";

const TasksPage = () => {
    const { customers, tasks, toggleTask, openDialog } = useApp();
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("Open");
    const [priority, setPriority] = useState("All priorities");
    const [sort, setSort] = useState("due");
    const today = getToday();

    const filteredTasks = tasks.filter((task) => {
        const customer = getCustomer(customers, task.accountId);
        const normalized = query.trim().toLowerCase();
        const matchesQuery = !normalized || [task.title, task.owner, customer?.name, task.category].join(" ").toLowerCase().includes(normalized);
        const matchesStatus = status === "All tasks" || task.status === status;
        const matchesPriority = priority === "All priorities" || task.priority === priority;
        return matchesQuery && matchesStatus && matchesPriority;
    }).sort((first, second) => {
        if (sort === "priority") return ["High", "Normal", "Low"].indexOf(first.priority) - ["High", "Normal", "Low"].indexOf(second.priority);
        if (sort === "newest") return second.id.localeCompare(first.id);
        return first.due.localeCompare(second.due);
    });

    const openTasks = tasks.filter((task) => task.status === "Open");
    const dueSoon = openTasks.filter((task) => task.due >= today && task.due <= getDateAfter(today, 7)).length;
    const completed = tasks.filter((task) => task.status === "Done").length;

    return (
        <div className={styles.tasksPage}>
            <PageHeading
                actions={<button className={styles.primaryButton} onClick={() => openDialog("taskForm")} type="button"><FiPlus aria-hidden="true" /> Add task</button>}
                description="Turn customer conversations into clear next steps, with a person and a date attached."
                title="Customer tasks"
            />
            <section aria-label="Task summary" className={styles.summary}>
                <article><span className={styles.summaryIcon}><FiCheckCircle aria-hidden="true" /></span><span><small>Open tasks</small><strong>{openTasks.length}</strong></span></article>
                <article><span className={styles.summaryIcon}><FiCalendar aria-hidden="true" /></span><span><small>Due this week</small><strong>{dueSoon}</strong></span></article>
                <article><span className={styles.summaryIcon}><FiCheck aria-hidden="true" /></span><span><small>Completed</small><strong>{completed}</strong></span></article>
            </section>
            <section aria-label="Task filters" className={styles.filters}>
                <label className={styles.searchField}><FiSearch aria-hidden="true" /><span className={styles.visuallyHidden}>Search tasks</span><input onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks or customers" value={query} /></label>
                <label className={styles.selectField}><FiCheckCircle aria-hidden="true" /><span className={styles.visuallyHidden}>Filter by task status</span><select onChange={(event) => setStatus(event.target.value)} value={status}><option>Open</option><option>All tasks</option><option>Done</option></select></label>
                <label className={styles.selectField}><FiClock aria-hidden="true" /><span className={styles.visuallyHidden}>Filter by priority</span><select onChange={(event) => setPriority(event.target.value)} value={priority}><option>All priorities</option><option>High</option><option>Normal</option><option>Low</option></select></label>
                <label className={styles.selectField}><FiArrowDown aria-hidden="true" /><span className={styles.visuallyHidden}>Sort tasks</span><select onChange={(event) => setSort(event.target.value)} value={sort}><option value="due">Due date</option><option value="priority">Priority</option><option value="newest">Recently added</option></select></label>
            </section>
            <div className={styles.resultLine}><span>{filteredTasks.length} tasks</span><span>{openTasks.length} still open</span></div>
            {filteredTasks.length ? (
                <section aria-label="Customer task list" className={styles.taskBoard}>
                    {filteredTasks.map((task) => {
                        const customer = getCustomer(customers, task.accountId);
                        const overdue = task.status === "Open" && task.due < today;
                        return (
                            <article className={styles.taskRow} data-done={task.status === "Done"} key={task.id}>
                                <button aria-label={task.status === "Done" ? "Reopen " + task.title : "Mark " + task.title + " complete"} aria-pressed={task.status === "Done"} className={task.status === "Done" ? styles.checkDone : styles.checkButton} onClick={() => toggleTask(task.id)} type="button"><FiCheck aria-hidden="true" /></button>
                                <div className={styles.taskDescription}>
                                    <strong>{task.title}</strong>
                                    <div className={styles.taskMeta}>
                                        {customer && <button onClick={() => openDialog("customerDetails", { customerId: customer.id })} type="button"><CustomerAvatar className={styles.avatar} customer={customer} />{customer.name}</button>}
                                        <span>{task.category}</span><span>Owner: {task.owner}</span>
                                    </div>
                                </div>
                                <span className={styles.priority} data-priority={task.priority}>{task.priority}</span>
                                <span className={overdue ? styles.overdueDate : styles.dueDate}><FiCalendar aria-hidden="true" />{overdue ? "Overdue · " : "Due "}{formatDate(task.due)}</span>
                                <div className={styles.actions}>
                                    <button aria-label={"Edit " + task.title} onClick={() => openDialog("taskForm", { taskId: task.id })} type="button">Edit</button>
                                    <button aria-label={"Remove " + task.title} onClick={() => openDialog("confirmDelete", { entity: "task", id: task.id, name: task.title })} type="button"><FiTrash2 aria-hidden="true" /></button>
                                </div>
                            </article>
                        );
                    })}
                </section>
            ) : (
                <section className={styles.emptyState}>
                    <span><FiCheckCircle aria-hidden="true" /></span>
                    <h2>{tasks.length ? "No tasks match those filters" : "Your task list is clear"}</h2>
                    <p>{tasks.length ? "Try another search or status to find the next customer action." : "Add a follow-up and give it an owner and due date."}</p>
                    <button className={styles.primaryButton} onClick={() => openDialog("taskForm")} type="button"><FiPlus aria-hidden="true" /> Add task</button>
                </section>
            )}
            <p className={styles.storageNote}><FiUsers aria-hidden="true" /> This frontend demo keeps task changes in session memory. Refreshing the page restores the sample data.</p>
        </div>
    );
};

export default TasksPage;


