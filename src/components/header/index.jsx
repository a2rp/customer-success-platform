import { useEffect, useMemo, useRef, useState } from "react";
import { FiAnchor, FiBell, FiChevronDown, FiMenu, FiPlus, FiSearch, FiSettings, FiUser, FiX } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../../context/useApp.js";
import styles from "./styles.module.css";

const Header = () => {
    const {
        customers, notifications, workspace, openDialog,
        markAllNotificationsRead, markNotificationRead, addToast, mobileNavOpen, setMobileNavOpen,
    } = useApp();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const searchRef = useRef(null);
    const searchInputRef = useRef(null);
    const notificationsRef = useRef(null);
    const profileRef = useRef(null);

    const matches = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        if (!normalized) return [];
        return customers.filter((customer) => [customer.name, customer.domain, customer.contact].join(" ").toLowerCase().includes(normalized)).slice(0, 5);
    }, [customers, query]);
    const unreadCount = workspace.showBadges === false ? 0 : notifications.filter((item) => !item.read).length;

    useEffect(() => {
        const handlePointer = (event) => {
            if (!searchRef.current?.contains(event.target)) setSearchOpen(false);
            if (!notificationsRef.current?.contains(event.target)) setNotificationsOpen(false);
            if (!profileRef.current?.contains(event.target)) setProfileOpen(false);
        };
        const handleKey = (event) => {
            if (event.key === "Escape") {
                setSearchOpen(false);
                setNotificationsOpen(false);
                setProfileOpen(false);
            }
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                searchInputRef.current?.focus();
                setSearchOpen(true);
            }
        };
        document.addEventListener("pointerdown", handlePointer);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("pointerdown", handlePointer);
            document.removeEventListener("keydown", handleKey);
        };
    }, []);

    const openCustomer = (customerId) => {
        navigate("/customers?account=" + encodeURIComponent(customerId));
        setQuery("");
        setSearchOpen(false);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (matches[0]) {
            openCustomer(matches[0].id);
            return;
        }
        if (query.trim()) {
            navigate("/customers?search=" + encodeURIComponent(query.trim()));
            setSearchOpen(false);
        } else {
            addToast("Type a customer name or domain to search", "info");
        }
    };

    return (
        <header className={styles.header}>
            <NavLink aria-label="Harbor overview" className={styles.brand} to="/">
                <span aria-hidden="true" className={styles.brandMark}><FiAnchor /></span>
                <span>harbor<span className={styles.brandDot}>.</span></span>
            </NavLink>
            <button
                aria-label={mobileNavOpen ? "Close workspace navigation" : "Open workspace navigation"}
                aria-expanded={mobileNavOpen}
                className={styles.mobileMenu}
                onClick={() => setMobileNavOpen((open) => !open)}
                type="button"
            >
                {mobileNavOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
            </button>
            <div className={styles.tools}>
                <div className={styles.searchWrap} ref={searchRef}>
                    <form className={styles.search} onSubmit={handleSearchSubmit} role="search">
                        <FiSearch aria-hidden="true" />
                        <input
                            aria-label="Search customers"
                            autoComplete="off"
                            onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); }}
                            onFocus={() => setSearchOpen(true)}
                            placeholder="Search customers"
                            ref={searchInputRef}
                            value={query}
                        />
                        <kbd>Ctrl K</kbd>
                    </form>
                    {searchOpen && query.trim() && (
                        <div className={styles.searchPanel}>
                            <span className={styles.panelLabel}>Customer accounts</span>
                            {matches.length ? matches.map((customer) => (
                                <button className={styles.searchResult} key={customer.id} onClick={() => openCustomer(customer.id)} type="button">
                                    <span className={styles.resultMark}>{customer.name.slice(0, 1)}</span>
                                    <span><strong>{customer.name}</strong><small>{customer.domain}</small></span>
                                    <span className={styles.score}>{customer.health}</span>
                                </button>
                            )) : <p className={styles.emptySearch}>No matching accounts.</p>}
                            <button className={styles.viewAll} onClick={() => { navigate("/customers?search=" + encodeURIComponent(query.trim())); setSearchOpen(false); }} type="button">View all customer results</button>
                        </div>
                    )}
                </div>
                <button aria-label="Add customer" className={styles.newButton} onClick={() => openDialog("customerForm")} type="button"><FiPlus aria-hidden="true" /><span>New customer</span></button>
                <div className={styles.popoverWrap} ref={notificationsRef}>
                    <button
                        aria-expanded={notificationsOpen}
                        aria-haspopup="true"
                        aria-label={unreadCount ? "Notifications, " + unreadCount + " unread" : "Notifications"}
                        className={styles.iconButton}
                        onClick={() => { setNotificationsOpen((open) => !open); setProfileOpen(false); }}
                        type="button"
                    >
                        <FiBell aria-hidden="true" />
                        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
                    </button>
                    {notificationsOpen && (
                        <section aria-label="Notifications" className={styles.notificationPanel}>
                            <div className={styles.panelHeading}>
                                <div><strong>Reminders</strong><span>{unreadCount} unread</span></div>
                                <button onClick={markAllNotificationsRead} type="button">Mark all read</button>
                            </div>
                            <div className={styles.notificationList}>
                                {notifications.map((item) => (
                                    <button className={styles.notification} data-unread={!item.read} key={item.id} onClick={() => { markNotificationRead(item.id); setNotificationsOpen(false); openCustomer(item.accountId); }} type="button">
                                        <span className={styles.notificationDot} />
                                        <span><strong>{item.title}</strong><small>{item.detail}</small><small>{item.time}</small></span>
                                    </button>
                                ))}
                            </div>
                            <NavLink className={styles.panelFooter} onClick={() => setNotificationsOpen(false)} to="/tasks">Review customer tasks</NavLink>
                        </section>
                    )}
                </div>
                <a aria-label="Repository on GitHub" className={styles.repoButton} href="https://github.com/a2rp/customer-success-platform" rel="noreferrer" target="_blank">
                    <FaGithub aria-hidden="true" /><span>Repository</span>
                </a>
                <div className={styles.popoverWrap} ref={profileRef}>
                    <button aria-expanded={profileOpen} aria-haspopup="true" className={styles.profileButton} onClick={() => { setProfileOpen((open) => !open); setNotificationsOpen(false); }} type="button">
                        <span className={styles.profileAvatar}>OC</span><span className={styles.profileName}>Olivia Chen</span><FiChevronDown aria-hidden="true" />
                    </button>
                    {profileOpen && (
                        <div className={styles.profileMenu} role="menu">
                            <button onClick={() => { openDialog("profile"); setProfileOpen(false); }} role="menuitem" type="button"><FiUser aria-hidden="true" /> My profile</button>
                            <button onClick={() => { openDialog("settings"); setProfileOpen(false); }} role="menuitem" type="button"><FiSettings aria-hidden="true" /> Workspace settings</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;


