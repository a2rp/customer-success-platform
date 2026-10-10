import { useEffect, useMemo, useState } from "react";
import {
    FiArrowDown,
    FiArrowUpRight,
    FiBriefcase,
    FiCalendar,
    FiGrid,
    FiList,
    FiPlus,
    FiSearch,
    FiSliders,
    FiTrash2,
    FiUsers,
} from "react-icons/fi";
import CustomerAvatar from "../../components/customerAvatar";
import HealthIndicator from "../../components/healthIndicator";
import PageHeading from "../../components/pageHeading";
import { formatDate, formatMoney } from "../../utils.js";
import { useApp } from "../../context/useApp.js";
import styles from "./styles.module.css";
import { useSearchParams } from "react-router-dom";

const CustomersPage = () => {
    const { customers, openDialog } = useApp();
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("search") || "");
    const [status, setStatus] = useState(
        searchParams.get("status") || "All statuses",
    );
    const [renewalFilter, setRenewalFilter] = useState(
        searchParams.get("renewal") || "all",
    );
    const [sortBy, setSortBy] = useState("renewal");
    const [view, setView] = useState(() =>
        window.innerWidth <= 780 ? "cards" : "list",
    );

    useEffect(() => {
        const updateView = () =>
            setView(window.innerWidth <= 780 ? "cards" : "list");
        window.addEventListener("resize", updateView);
        return () => window.removeEventListener("resize", updateView);
    }, []);
    const accountParam = searchParams.get("account");

    useEffect(() => {
        if (
            !accountParam ||
            !customers.some((customer) => customer.id === accountParam)
        )
            return;
        openDialog("customerDetails", { customerId: accountParam });
        setSearchParams(
            (params) => {
                params.delete("account");
                return params;
            },
            { replace: true },
        );
    }, [accountParam, customers, openDialog, setSearchParams]);

    const filteredCustomers = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        const now = new Date();
        const next90 = new Date(now.getTime() + 90 * 86400000)
            .toISOString()
            .slice(0, 10);
        return customers
            .filter((customer) => {
                const matchesQuery =
                    !normalized ||
                    [
                        customer.name,
                        customer.domain,
                        customer.contact,
                        customer.owner,
                        customer.industry,
                    ]
                        .join(" ")
                        .toLowerCase()
                        .includes(normalized);
                const matchesStatus =
                    status === "All statuses" || customer.status === status;
                const matchesRenewal =
                    renewalFilter !== "next-90" ||
                    (customer.renewal >= now.toISOString().slice(0, 10) &&
                        customer.renewal <= next90);
                return matchesQuery && matchesStatus && matchesRenewal;
            })
            .sort((first, second) => {
                if (sortBy === "health") return first.health - second.health;
                if (sortBy === "arr") return second.arr - first.arr;
                if (sortBy === "name")
                    return first.name.localeCompare(second.name);
                return first.renewal.localeCompare(second.renewal);
            });
    }, [customers, query, renewalFilter, sortBy, status]);

    const clearFilters = () => {
        setQuery("");
        setStatus("All statuses");
        setRenewalFilter("all");
        setSearchParams({}, { replace: true });
    };

    const openDetails = (id) =>
        openDialog("customerDetails", { customerId: id });
    const editCustomer = (id) => openDialog("customerForm", { customerId: id });
    const removeCustomer = (customer) =>
        openDialog("confirmDelete", {
            entity: "customer",
            id: customer.id,
            name: customer.name,
        });
    const atRisk = customers.filter(
        (customer) => customer.status === "At risk",
    ).length;
    const totalArr = customers.reduce(
        (sum, customer) => sum + Number(customer.arr),
        0,
    );

    return (
        <div className={styles.customersPage}>
            <PageHeading
                actions={
                    <button
                        className={styles.primaryButton}
                        onClick={() => openDialog("customerForm")}
                        type="button"
                    >
                        <FiPlus aria-hidden="true" /> Add customer
                    </button>
                }
                description="Keep customer relationships, health signals, and renewal plans close at hand."
                title="Customers"
            />
            <section className={styles.summary}>
                <div>
                    <span className={styles.summaryIcon}>
                        <FiUsers aria-hidden="true" />
                    </span>
                    <span>
                        <small>Customer accounts</small>
                        <strong>{customers.length}</strong>
                    </span>
                </div>
                <div>
                    <span className={styles.summaryIcon}>
                        <FiBriefcase aria-hidden="true" />
                    </span>
                    <span>
                        <small>Managed revenue</small>
                        <strong>{formatMoney(totalArr)}</strong>
                    </span>
                </div>
                <div>
                    <span className={styles.summaryIcon}>
                        <FiCalendar aria-hidden="true" />
                    </span>
                    <span>
                        <small>At-risk accounts</small>
                        <strong>{atRisk}</strong>
                    </span>
                </div>
            </section>
            <section className={styles.toolbar} aria-label="Customer filters">
                <label className={styles.searchField}>
                    <FiSearch aria-hidden="true" />
                    <span className={styles.visuallyHidden}>
                        Search customers
                    </span>
                    <input
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search by company, contact, or owner"
                        value={query}
                    />
                </label>
                <label className={styles.selectField}>
                    <FiSliders aria-hidden="true" />
                    <span className={styles.visuallyHidden}>
                        Filter by health status
                    </span>
                    <select
                        onChange={(event) => setStatus(event.target.value)}
                        value={status}
                    >
                        <option>All statuses</option>
                        <option>Healthy</option>
                        <option>Watch</option>
                        <option>At risk</option>
                    </select>
                </label>
                <label className={styles.selectField}>
                    <FiCalendar aria-hidden="true" />
                    <span className={styles.visuallyHidden}>
                        Filter by renewal date
                    </span>
                    <select
                        onChange={(event) =>
                            setRenewalFilter(event.target.value)
                        }
                        value={renewalFilter}
                    >
                        <option value="all">All renewals</option>
                        <option value="next-90">Next 90 days</option>
                    </select>
                </label>
                <label className={styles.selectField}>
                    <FiArrowDown aria-hidden="true" />
                    <span className={styles.visuallyHidden}>
                        Sort customers
                    </span>
                    <select
                        onChange={(event) => setSortBy(event.target.value)}
                        value={sortBy}
                    >
                        <option value="renewal">Renewal date</option>
                        <option value="health">Lowest health</option>
                        <option value="arr">Highest revenue</option>
                        <option value="name">Company name</option>
                    </select>
                </label>
                <div
                    className={styles.viewSwitch}
                    role="group"
                    aria-label="Customer view"
                >
                    <button
                        aria-label="List view"
                        aria-pressed={view === "list"}
                        className={view === "list" ? styles.viewActive : ""}
                        onClick={() => setView("list")}
                        type="button"
                    >
                        <FiList aria-hidden="true" />
                    </button>
                    <button
                        aria-label="Card view"
                        aria-pressed={view === "cards"}
                        className={view === "cards" ? styles.viewActive : ""}
                        onClick={() => setView("cards")}
                        type="button"
                    >
                        <FiGrid aria-hidden="true" />
                    </button>
                </div>
            </section>
            <div className={styles.resultLine}>
                <span>
                    {filteredCustomers.length} of {customers.length} customer
                    accounts
                </span>
                {(query ||
                    status !== "All statuses" ||
                    renewalFilter !== "all") && (
                    <button onClick={clearFilters} type="button">
                        Clear filters
                    </button>
                )}
            </div>
            {filteredCustomers.length ? (
                view === "list" ? (
                    <section
                        aria-label="Customer account list"
                        className={styles.tableWrap}
                    >
                        <table>
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Health</th>
                                    <th>Annual value</th>
                                    <th>Renewal</th>
                                    <th>Success owner</th>
                                    <th>
                                        <span className={styles.visuallyHidden}>
                                            Actions
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>
                                            <button
                                                className={styles.customerName}
                                                onClick={() =>
                                                    openDetails(customer.id)
                                                }
                                                type="button"
                                            >
                                                <CustomerAvatar
                                                    className={styles.avatar}
                                                    customer={customer}
                                                />
                                                <span>
                                                    <strong>
                                                        {customer.name}
                                                    </strong>
                                                    <small>
                                                        {customer.domain}
                                                    </small>
                                                </span>
                                            </button>
                                        </td>
                                        <td>
                                            <div className={styles.healthCell}>
                                                <HealthIndicator
                                                    score={customer.health}
                                                    status={customer.status}
                                                />
                                                <span
                                                    className={styles.status}
                                                    data-status={
                                                        customer.status
                                                    }
                                                >
                                                    {customer.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <strong className={styles.arr}>
                                                {formatMoney(customer.arr)}
                                            </strong>
                                            <small className={styles.plan}>
                                                {customer.plan}
                                            </small>
                                        </td>
                                        <td>
                                            <strong
                                                className={styles.renewalDate}
                                            >
                                                {formatDate(customer.renewal)}
                                            </strong>
                                        </td>
                                        <td>
                                            <span className={styles.owner}>
                                                {customer.owner}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.rowActions}>
                                                <button
                                                    aria-label={
                                                        "Open " + customer.name
                                                    }
                                                    onClick={() =>
                                                        openDetails(customer.id)
                                                    }
                                                    type="button"
                                                >
                                                    <FiArrowUpRight aria-hidden="true" />
                                                </button>
                                                <button
                                                    aria-label={
                                                        "Edit " + customer.name
                                                    }
                                                    onClick={() =>
                                                        editCustomer(
                                                            customer.id,
                                                        )
                                                    }
                                                    type="button"
                                                >
                                                    <FiBriefcase aria-hidden="true" />
                                                </button>
                                                <button
                                                    aria-label={
                                                        "Remove " +
                                                        customer.name
                                                    }
                                                    onClick={() =>
                                                        removeCustomer(customer)
                                                    }
                                                    type="button"
                                                >
                                                    <FiTrash2 aria-hidden="true" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                ) : (
                    <section
                        aria-label="Customer cards"
                        className={styles.cardGrid}
                    >
                        {filteredCustomers.map((customer) => (
                            <article
                                className={styles.customerCard}
                                key={customer.id}
                            >
                                <div className={styles.cardTop}>
                                    <CustomerAvatar
                                        className={styles.avatar}
                                        customer={customer}
                                    />
                                    <span
                                        className={styles.status}
                                        data-status={customer.status}
                                    >
                                        {customer.status}
                                    </span>
                                </div>
                                <button
                                    className={styles.cardName}
                                    onClick={() => openDetails(customer.id)}
                                    type="button"
                                >
                                    <strong>{customer.name}</strong>
                                    <small>{customer.domain}</small>
                                </button>
                                <HealthIndicator
                                    score={customer.health}
                                    status={customer.status}
                                />
                                <div className={styles.cardFacts}>
                                    <span>{formatMoney(customer.arr)} ARR</span>
                                    <span>
                                        Renews {formatDate(customer.renewal)}
                                    </span>
                                </div>
                                <div className={styles.cardActions}>
                                    <button
                                        onClick={() =>
                                            editCustomer(customer.id)
                                        }
                                        type="button"
                                    >
                                        Edit account
                                    </button>
                                    <button
                                        aria-label={"Remove " + customer.name}
                                        onClick={() => removeCustomer(customer)}
                                        type="button"
                                    >
                                        <FiTrash2 aria-hidden="true" />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>
                )
            ) : (
                <section className={styles.emptyState}>
                    <span>
                        <FiUsers aria-hidden="true" />
                    </span>
                    <h2>
                        {customers.length
                            ? "No customers match those filters"
                            : "Start with your first customer"}
                    </h2>
                    <p>
                        {customers.length
                            ? "Try a different search or clear your filters to see every account."
                            : "Add the first account to start tracking customer health and next steps."}
                    </p>
                    <div>
                        {customers.length ? (
                            <button
                                className={styles.secondaryButton}
                                onClick={clearFilters}
                                type="button"
                            >
                                Clear filters
                            </button>
                        ) : (
                            <button
                                className={styles.primaryButton}
                                onClick={() => openDialog("customerForm")}
                                type="button"
                            >
                                <FiPlus aria-hidden="true" /> Add customer
                            </button>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
};

export default CustomersPage;
