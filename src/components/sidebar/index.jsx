import { FiActivity, FiBriefcase, FiCheckSquare, FiCompass, FiGrid, FiSettings, FiUsers, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useApp } from "../../context/useApp.js";
import styles from "./styles.module.css";

const navigation = [
    { to: "/", label: "Overview", icon: FiGrid, end: true },
    { to: "/customers", label: "Customers", icon: FiUsers },
    { to: "/playbooks", label: "Playbooks", icon: FiCompass },
    { to: "/tasks", label: "Tasks", icon: FiCheckSquare },
    { to: "/insights", label: "Insights", icon: FiActivity },
];

const Sidebar = () => {
    const { customers, tasks, playbooks, workspace, openDialog, mobileNavOpen, setMobileNavOpen } = useApp();
    const atRisk = customers.filter((customer) => customer.status === "At risk").length;
    const openTasks = tasks.filter((task) => task.status === "Open").length;
    const activePlaybooks = playbooks.filter((playbook) => playbook.active).length;

    return (
        <>
            <button aria-label="Close workspace navigation" className={mobileNavOpen ? styles.backdropOpen : styles.backdrop} onClick={() => setMobileNavOpen(false)} tabIndex={mobileNavOpen ? 0 : -1} type="button" />
            <aside aria-label="Workspace navigation" className={mobileNavOpen ? styles.sidebarOpen : styles.sidebar}>
                <div className={styles.sidebarHead}>
                    <span>WORKSPACE</span>
                    <button aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} type="button"><FiX aria-hidden="true" /></button>
                </div>
                <nav aria-label="Primary navigation" className={styles.navigation}>
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                                end={item.end}
                                key={item.to}
                                onClick={() => setMobileNavOpen(false)}
                                to={item.to}
                            >
                                <Icon aria-hidden="true" />
                                <span>{item.label}</span>
                                {item.to === "/customers" && atRisk > 0 && <small>{atRisk}</small>}
                                {item.to === "/tasks" && <small>{openTasks}</small>}
                            </NavLink>
                        );
                    })}
                </nav>
                <NavLink className={styles.playbookCard} onClick={() => setMobileNavOpen(false)} to="/playbooks">
                    <span aria-hidden="true" className={styles.playbookIcon}><FiBriefcase /></span>
                    <span><strong>{workspace.name}</strong><small>{activePlaybooks} active playbooks</small></span>
                    <FiCompass aria-hidden="true" className={styles.cardArrow} />
                </NavLink>
                <div className={styles.sidebarBottom}>
                    <div className={styles.healthNote}>
                        <span className={styles.healthIcon}><FiActivity aria-hidden="true" /></span>
                        <span><strong>Customer pulse</strong><small>{atRisk ? atRisk + " accounts need a check-in" : "All accounts are in a good place"}</small></span>
                    </div>
                    <button className={styles.userButton} onClick={() => openDialog("profile")} type="button">
                        <span className={styles.avatar}>OC</span>
                        <span><strong>Olivia Chen</strong><small>Workspace admin</small></span>
                    </button>
                    <button aria-label="Workspace settings" className={styles.settingsButton} onClick={() => openDialog("settings")} type="button"><FiSettings aria-hidden="true" /></button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

