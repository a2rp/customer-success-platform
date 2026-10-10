import { useMemo, useState } from "react";
import { FiActivity, FiArrowRight, FiArrowUpRight, FiBriefcase, FiCalendar, FiCheck, FiChevronDown, FiPlus, FiRefreshCw, FiTrendingUp, FiUsers } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import CustomerAvatar from "../../components/customerAvatar";
import HealthIndicator from "../../components/healthIndicator";
import PageHeading from "../../components/pageHeading";
import { formatDate, formatMoney, getCustomer, getToday } from "../../utils.js";
import { useApp } from "../../context/useApp.js";
import styles from "./styles.module.css";

const chartRanges = {
    "30 days": { values: [64, 67, 65, 72, 70, 75, 79, 78, 82], labels: ["Sep 11", "Sep 15", "Sep 19", "Sep 23", "Sep 27", "Oct 1", "Oct 4", "Oct 7", "Oct 10"] },
    "90 days": { values: [59, 61, 64, 63, 67, 70, 74, 78, 82], labels: ["Jul 13", "Jul 25", "Aug 6", "Aug 18", "Aug 30", "Sep 11", "Sep 23", "Oct 2", "Oct 10"] },
    "12 months": { values: [52, 55, 54, 60, 58, 63, 66, 68, 73, 76, 79, 82], labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"] },
};

const OverviewPage = () => {
    const { customers, tasks, activity, openDialog, toggleTask } = useApp();
    const [range, setRange] = useState("30 days");
    const trend = chartRanges[range];
    const annualValue = customers.reduce((sum, customer) => sum + Number(customer.arr), 0);
    const averageHealth = customers.length ? Math.round(customers.reduce((sum, customer) => sum + Number(customer.health), 0) / customers.length) : 0;
    const atRiskAccounts = customers.filter((customer) => customer.status === "At risk");
    const needsAttention = customers.filter((customer) => customer.status !== "Healthy").sort((a, b) => a.health - b.health).slice(0, 4);
    const openTasks = tasks.filter((task) => task.status === "Open").sort((a, b) => a.due.localeCompare(b.due)).slice(0, 4);
    const today = getToday();
    const renewals = useMemo(() => customers.filter((customer) => customer.renewal >= today).sort((a, b) => a.renewal.localeCompare(b.renewal)).slice(0, 4), [customers, today]);
    const distribution = [
        { label: "Healthy", count: customers.filter((item) => item.status === "Healthy").length, color: "#3f9272", className: styles.healthy },
        { label: "Watch", count: customers.filter((item) => item.status === "Watch").length, color: "#d49a4f", className: styles.watch },
        { label: "At risk", count: atRiskAccounts.length, color: "#d27669", className: styles.risk },
    ];
    const points = trend.values.map((value, index) => {
        const x = 12 + index * (676 / (trend.values.length - 1));
        const y = 150 - (value - 40) * 2.25;
        return [x, y];
    });
    const linePath = points.map((point, index) => (index ? "L" : "M") + point[0] + " " + point[1]).join(" ");
    const areaPath = linePath + " L 688 164 L 12 164 Z";

    const openCustomer = (id) => openDialog("customerDetails", { customerId: id });

    return (
        <div className={styles.overview}>
            <PageHeading
                actions={(
                    <>
                        <NavLink className={styles.secondaryButton} to="/insights"><FiTrendingUp aria-hidden="true" /> Health report</NavLink>
                        <button className={styles.primaryButton} onClick={() => openDialog("customerForm")} type="button"><FiPlus aria-hidden="true" /> Add customer</button>
                    </>
                )}
                description="A steady view of the relationships, renewals, and next steps your team is moving forward."
                title="Good morning, Olivia"
            />
            <section aria-label="Customer portfolio summary" className={styles.metrics}>
                <article className={styles.metricCard}>
                    <span className={styles.metricIcon}><FiUsers aria-hidden="true" /></span>
                    <span className={styles.metricLabel}>Customer accounts</span>
                    <strong>{customers.length}</strong>
                    <small><span>Across your success portfolio</span></small>
                </article>
                <article className={styles.metricCard}>
                    <span className={styles.metricIcon}><FiBriefcase aria-hidden="true" /></span>
                    <span className={styles.metricLabel}>Managed revenue</span>
                    <strong>{formatMoney(annualValue)}</strong>
                    <small><FiTrendingUp aria-hidden="true" /> Annual recurring revenue</small>
                </article>
                <article className={styles.metricCard}>
                    <span className={styles.metricIcon}><FiActivity aria-hidden="true" /></span>
                    <span className={styles.metricLabel}>Average health</span>
                    <strong>{averageHealth}<small className={styles.outOf}>/100</small></strong>
                    <small><span className={styles.goodDot} /> Portfolio pulse</small>
                </article>
                <article className={styles.metricCard}>
                    <span className={styles.metricIcon}><FiCalendar aria-hidden="true" /></span>
                    <span className={styles.metricLabel}>At-risk revenue</span>
                    <strong>{formatMoney(atRiskAccounts.reduce((sum, customer) => sum + Number(customer.arr), 0))}</strong>
                    <small>{atRiskAccounts.length} accounts need a plan</small>
                </article>
            </section>
            <section className={styles.mainGrid}>
                <article className={styles.chartCard}>
                    <div className={styles.cardHeading}>
                        <div><h2>Customer health</h2><p>Portfolio score is trending upward</p></div>
                        <label className={styles.rangeSelect}><span className={styles.visuallyHidden}>Health chart time range</span><select onChange={(event) => setRange(event.target.value)} value={range}>{Object.keys(chartRanges).map((item) => <option key={item}>{item}</option>)}</select><FiChevronDown aria-hidden="true" /></label>
                    </div>
                    <div className={styles.chartSummary}><strong>{averageHealth}<span>/100</span></strong><span className={styles.trendPositive}><FiTrendingUp aria-hidden="true" /> +8 points</span><span>since last month</span></div>
                    <div className={styles.chart}>
                        <svg aria-label={"Customer health trend for the last " + range} role="img" viewBox="0 0 700 180">
                            <defs><linearGradient id="health-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#64a98d" stopOpacity=".24" /><stop offset="100%" stopColor="#64a98d" stopOpacity="0" /></linearGradient></defs>
                            {[30, 70, 110, 150].map((y) => <line key={y} x1="12" x2="688" y1={y} y2={y} />)}
                            <path d={areaPath} />
                            <path d={linePath} />
                            {points.map((point, index) => <circle key={index} cx={point[0]} cy={point[1]} r="3.5" />)}
                        </svg>
                        <div className={styles.chartLabels}>{trend.labels.filter((_, index) => index % (range === "12 months" ? 2 : 2) === 0).map((label) => <span key={label}>{label}</span>)}</div>
                    </div>
                    <div className={styles.chartFooter}><span><i /> Health score</span><span>Based on product use, outcomes, and relationship signals</span></div>
                </article>
                <article className={styles.healthCard}>
                    <div className={styles.cardHeading}><div><h2>Portfolio health</h2><p>Accounts by relationship status</p></div><NavLink aria-label="View all customers" className={styles.iconLink} to="/customers"><FiArrowUpRight aria-hidden="true" /></NavLink></div>
                    <div className={styles.healthVisual}>
                        <div aria-label="Customer status distribution" className={styles.donut} role="img" style={{ background: "conic-gradient(#3f9272 0 " + (customers.length ? distribution[0].count / customers.length * 100 : 0) + "%, #d49a4f 0 " + (customers.length ? (distribution[0].count + distribution[1].count) / customers.length * 100 : 0) + "%, #d27669 0 100%)" }}>
                            <span><strong>{customers.length}</strong><small>accounts</small></span>
                        </div>
                        <div className={styles.legend}>{distribution.map((item) => (
                            <NavLink className={styles.legendItem} key={item.label} to={"/customers?status=" + encodeURIComponent(item.label)}>
                                <span><i style={{ background: item.color }} />{item.label}</span><strong>{item.count}</strong>
                            </NavLink>
                        ))}</div>
                    </div>
                    <div className={styles.healthHint}><FiRefreshCw aria-hidden="true" /> Health updates as account details change</div>
                </article>
            </section>
            <section className={styles.bottomGrid}>
                <article className={styles.listCard}>
                    <div className={styles.cardHeading}>
                        <div><h2>Accounts to look after</h2><p>Recent signals worth a little attention</p></div>
                        <NavLink className={styles.textLink} to="/customers?status=At%20risk">View customers <FiArrowRight aria-hidden="true" /></NavLink>
                    </div>
                    <div className={styles.accountList}>
                        {needsAttention.length ? needsAttention.map((customer) => (
                            <button className={styles.accountRow} key={customer.id} onClick={() => openCustomer(customer.id)} type="button">
                                <CustomerAvatar className={styles.avatar} customer={customer} />
                                <span className={styles.accountInfo}><strong>{customer.name}</strong><small>{customer.contact} <span>|</span> {customer.owner}</small></span>
                                <HealthIndicator score={customer.health} status={customer.status} />
                                <span className={styles.rowArrow}><FiArrowUpRight aria-hidden="true" /></span>
                            </button>
                        )) : <p className={styles.emptyMessage}>All customer accounts are healthy. Nice work.</p>}
                    </div>
                </article>
                <article className={styles.listCard}>
                    <div className={styles.cardHeading}>
                        <div><h2>Next customer actions</h2><p>Small steps that keep momentum going</p></div>
                        <button className={styles.addTaskButton} onClick={() => openDialog("taskForm")} type="button"><FiPlus aria-hidden="true" /> Add task</button>
                    </div>
                    <div className={styles.taskList}>
                        {openTasks.length ? openTasks.map((task) => {
                            const customer = getCustomer(customers, task.accountId);
                            return (
                                <div className={styles.taskRow} key={task.id}>
                                    <button aria-label={"Mark " + task.title + " complete"} className={styles.checkButton} onClick={() => toggleTask(task.id)} type="button"><FiCheck aria-hidden="true" /></button>
                                    <button className={styles.taskContent} onClick={() => openDialog("taskForm", { taskId: task.id })} type="button"><strong>{task.title}</strong><small>{customer?.name || "Customer"} <span>|</span> due {formatDate(task.due)}</small></button>
                                    <span className={styles.priority} data-priority={task.priority}>{task.priority}</span>
                                </div>
                            );
                        }) : <p className={styles.emptyMessage}>No open actions right now. Add the next helpful step.</p>}
                    </div>
                    <NavLink className={styles.listFooter} to="/tasks">Open the task list <FiArrowUpRight aria-hidden="true" /></NavLink>
                </article>
            </section>
            <section className={styles.bottomGrid}>
                <article className={styles.listCard}>
                    <div className={styles.cardHeading}>
                        <div><h2>Renewals on the horizon</h2><p>Plan early and keep the conversation human</p></div>
                        <NavLink className={styles.textLink} to="/customers?renewal=next-90">Renewal calendar <FiArrowRight aria-hidden="true" /></NavLink>
                    </div>
                    <div className={styles.renewals}>
                        {renewals.map((customer) => (
                            <button className={styles.renewalRow} key={customer.id} onClick={() => openCustomer(customer.id)} type="button">
                                <CustomerAvatar className={styles.avatar} customer={customer} />
                                <span><strong>{customer.name}</strong><small>{customer.plan} plan · {customer.owner}</small></span>
                                <span className={styles.renewalDate}><FiCalendar aria-hidden="true" />{formatDate(customer.renewal)}</span>
                            </button>
                        ))}
                    </div>
                </article>
                <article className={styles.activityCard}>
                    <div className={styles.cardHeading}><div><h2>Recent activity</h2><p>Good work, noticed and moving forward</p></div></div>
                    <div className={styles.activityList}>
                        {activity.slice(0, 4).map((item) => (
                            <div className={styles.activityRow} key={item.id}>
                                <span className={styles.activityDot} data-type={item.type} />
                                <span><strong>{item.text}</strong><small>{item.time}</small></span>
                            </div>
                        ))}
                    </div>
                    <NavLink className={styles.listFooter} to="/insights">Explore customer insights <FiArrowUpRight aria-hidden="true" /></NavLink>
                </article>
            </section>
        </div>
    );
};

export default OverviewPage;



