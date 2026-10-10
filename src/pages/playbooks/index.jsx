import { useMemo, useState } from "react";
import { FiArrowUpRight, FiCheckCircle, FiCompass, FiPause, FiPlay, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import PageHeading from "../../components/pageHeading";
import { useApp } from "../../context/useApp.js";
import styles from "./styles.module.css";

const PlaybooksPage = () => {
    const { playbooks, openDialog, togglePlaybook } = useApp();
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("All playbooks");

    const filteredPlaybooks = useMemo(() => playbooks.filter((playbook) => {
        const normalized = query.trim().toLowerCase();
        const matchesText = !normalized || [playbook.title, playbook.description, playbook.category].join(" ").toLowerCase().includes(normalized);
        const matchesState = filter === "All playbooks" || (filter === "Active" ? playbook.active : !playbook.active);
        return matchesText && matchesState;
    }), [filter, playbooks, query]);

    const startPlaybook = (id) => openDialog("runPlaybook", { playbookId: id });
    const editPlaybook = (id) => openDialog("playbookForm", { playbookId: id });
    const removePlaybook = (playbook) => openDialog("confirmDelete", { entity: "playbook", id: playbook.id, name: playbook.title });
    const activeCount = playbooks.filter((item) => item.active).length;
    const totalRuns = playbooks.reduce((sum, item) => sum + item.runs, 0);

    return (
        <div className={styles.playbooksPage}>
            <PageHeading
                actions={<button className={styles.primaryButton} onClick={() => openDialog("playbookForm")} type="button"><FiPlus aria-hidden="true" /> Create playbook</button>}
                description="Make the repeatable parts of customer success thoughtful, visible, and easy to start."
                title="Success playbooks"
            />
            <section aria-label="Playbook summary" className={styles.summary}>
                <article><span className={styles.summaryIcon}><FiCompass aria-hidden="true" /></span><span><small>Playbooks</small><strong>{playbooks.length}</strong></span></article>
                <article><span className={styles.summaryIcon}><FiCheckCircle aria-hidden="true" /></span><span><small>Active plans</small><strong>{activeCount}</strong></span></article>
                <article><span className={styles.summaryIcon}><FiPlay aria-hidden="true" /></span><span><small>Starts to date</small><strong>{totalRuns}</strong></span></article>
            </section>
            <section aria-label="Playbook filters" className={styles.toolbar}>
                <label className={styles.searchField}><FiSearch aria-hidden="true" /><span className={styles.visuallyHidden}>Search playbooks</span><input onChange={(event) => setQuery(event.target.value)} placeholder="Search playbooks" value={query} /></label>
                <label className={styles.filterField}><span className={styles.visuallyHidden}>Show playbook status</span><select onChange={(event) => setFilter(event.target.value)} value={filter}><option>All playbooks</option><option>Active</option><option>Paused</option></select></label>
                <p>{filteredPlaybooks.length} plans</p>
            </section>
            {filteredPlaybooks.length ? (
                <section aria-label="Playbook list" className={styles.playbookGrid}>
                    {filteredPlaybooks.map((playbook) => (
                        <article className={styles.playbookCard} data-tone={playbook.color} key={playbook.id}>
                            <div className={styles.cardTop}>
                                <span className={styles.category}>{playbook.category}</span>
                                <span className={playbook.active ? styles.activeStatus : styles.pausedStatus}><i />{playbook.active ? "Active" : "Paused"}</span>
                            </div>
                            <div className={styles.iconBlock}><FiCompass aria-hidden="true" /></div>
                            <h2>{playbook.title}</h2>
                            <p className={styles.description}>{playbook.description}</p>
                            <div className={styles.stepHeading}><strong>{playbook.steps.length} steps</strong><span>Started {playbook.runs} times</span></div>
                            <ol className={styles.steps}>
                                {playbook.steps.slice(0, 3).map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}
                                {playbook.steps.length > 3 && <li className={styles.moreSteps}>+ {playbook.steps.length - 3} more steps</li>}
                            </ol>
                            <div className={styles.cardActions}>
                                <button className={styles.runButton} disabled={!playbook.active} onClick={() => startPlaybook(playbook.id)} type="button"><FiPlay aria-hidden="true" /> Start this plan</button>
                                <button aria-label={"Edit " + playbook.title} className={styles.actionButton} onClick={() => editPlaybook(playbook.id)} type="button">Edit</button>
                                <button aria-label={(playbook.active ? "Pause " : "Activate ") + playbook.title} className={styles.actionButton} onClick={() => togglePlaybook(playbook.id)} type="button">{playbook.active ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}</button>
                                <button aria-label={"Remove " + playbook.title} className={styles.deleteButton} onClick={() => removePlaybook(playbook)} type="button"><FiTrash2 aria-hidden="true" /></button>
                            </div>
                        </article>
                    ))}
                </section>
            ) : (
                <section className={styles.emptyState}>
                    <span><FiCompass aria-hidden="true" /></span>
                    <h2>{playbooks.length ? "No playbooks match this view" : "Create a useful first playbook"}</h2>
                    <p>Bring a repeatable customer moment into one clear, shared plan.</p>
                    <button className={styles.primaryButton} onClick={() => openDialog("playbookForm")} type="button"><FiPlus aria-hidden="true" /> Create playbook</button>
                </section>
            )}
            <section className={styles.tip}>
                <span><FiCheckCircle aria-hidden="true" /></span>
                <p><strong>Playbooks create real follow-up tasks.</strong> Starting a plan adds each step to the shared task list for the selected customer.</p>
                <button onClick={() => openDialog("taskForm")} type="button">Add a one-off task <FiArrowUpRight aria-hidden="true" /></button>
            </section>
        </div>
    );
};

export default PlaybooksPage;

