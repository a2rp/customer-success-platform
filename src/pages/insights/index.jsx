import { useMemo, useState } from "react";
import {
    FiArrowRight,
    FiArrowUpRight,
    FiDownload,
    FiTrendingDown,
    FiTrendingUp,
    FiUsers,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import CustomerAvatar from "../../components/customerAvatar";
import PageHeading from "../../components/pageHeading";
import {
    formatDate,
    formatMoney,
    getDateAfter,
    getToday,
} from "../../utils.js";
import { useApp } from "../../context/useApp.js";
import styles from "./styles.module.css";

const ranges = {
    "90 days": [61, 63, 65, 69, 70, 74, 78, 82],
    "6 months": [55, 57, 59, 62, 66, 68, 73, 75, 79, 82],
    "12 months": [48, 50, 54, 55, 58, 61, 64, 66, 69, 73, 77, 82],
};

const InsightsPage = () => {
    const { customers, addToast, openDialog } = useApp();
    const [range, setRange] = useState("90 days");
    const totalArr = customers.reduce(
        (sum, customer) => sum + Number(customer.arr),
        0,
    );
    const averageHealth = customers.length
        ? Math.round(
              customers.reduce(
                  (sum, customer) => sum + Number(customer.health),
                  0,
              ) / customers.length,
          )
        : 0;
    const atRiskCustomers = customers.filter(
        (customer) => customer.status === "At risk",
    );
    const atRiskArr = atRiskCustomers.reduce(
        (sum, customer) => sum + Number(customer.arr),
        0,
    );
    const healthyRate = customers.length
        ? Math.round(
              (customers.filter((customer) => customer.status === "Healthy")
                  .length /
                  customers.length) *
                  100,
          )
        : 0;
    const today = getToday();
    const soonDate = getDateAfter(today, 90);
    const upcomingRenewals = useMemo(
        () =>
            customers
                .filter(
                    (customer) =>
                        customer.renewal >= today &&
                        customer.renewal <= soonDate,
                )
                .sort((a, b) => a.renewal.localeCompare(b.renewal)),
        [customers, soonDate, today],
    );
    const byPlan = ["Enterprise", "Growth", "Starter"].map((plan) => ({
        plan,
        count: customers.filter((customer) => customer.plan === plan).length,
        arr: customers
            .filter((customer) => customer.plan === plan)
            .reduce((sum, customer) => sum + Number(customer.arr), 0),
    }));
    const trend = ranges[range];
    const points = trend.map((score, index) => [
        12 + index * (676 / (trend.length - 1)),
        144 - (score - 40) * 2.2,
    ]);
    const trendPath = points
        .map((point, index) => (index ? "L" : "M") + point[0] + " " + point[1])
        .join(" ");

    const exportCustomers = () => {
        const headers = [
            "Customer",
            "Domain",
            "Industry",
            "Plan",
            "ARR",
            "Health",
            "Status",
            "Renewal",
            "Owner",
        ];
        const rows = customers.map((customer) => [
            customer.name,
            customer.domain,
            customer.industry,
            customer.plan,
            customer.arr,
            customer.health,
            customer.status,
            customer.renewal,
            customer.owner,
        ]);
        const csv = [headers, ...rows]
            .map((row) =>
                row
                    .map(
                        (value) =>
                            '"' + String(value).replaceAll('"', '""') + '"',
                    )
                    .join(","),
            )
            .join("\n");
        const file = new Blob(["\ufeff" + csv], {
            type: "text/csv;charset=utf-8",
        });
        const fileUrl = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "harbor-customer-health.csv";
        link.click();
        URL.revokeObjectURL(fileUrl);
        addToast("Customer health report downloaded");
    };

    const openCustomer = (customerId) =>
        openDialog("customerDetails", { customerId });

    return (
        <div className={styles.insightsPage}>
            <PageHeading
                actions={
                    <button
                        className={styles.exportButton}
                        onClick={exportCustomers}
                        type="button"
                    >
                        <FiDownload aria-hidden="true" /> Export customer report
                    </button>
                }
                description="See the customer signals behind your next retention and growth conversation."
                title="Customer insights"
            />
            <section
                aria-label="Customer portfolio insights"
                className={styles.metrics}
            >
                <article>
                    <span className={styles.metricIcon}>
                        <FiUsers aria-hidden="true" />
                    </span>
                    <small>Managed revenue</small>
                    <strong>{formatMoney(totalArr)}</strong>
                    <span className={styles.metricNote}>
                        Across {customers.length} customer accounts
                    </span>
                </article>
                <article>
                    <span className={styles.metricIcon}>
                        <FiTrendingUp aria-hidden="true" />
                    </span>
                    <small>Average health score</small>
                    <strong>
                        {averageHealth}
                        <i>/100</i>
                    </strong>
                    <span className={styles.metricNote}>
                        Current portfolio average
                    </span>
                </article>
                <article>
                    <span className={styles.metricIcon}>
                        <FiArrowRight aria-hidden="true" />
                    </span>
                    <small>Healthy relationships</small>
                    <strong>{healthyRate}%</strong>
                    <span className={styles.metricNote}>
                        {
                            customers.filter(
                                (customer) => customer.status === "Healthy",
                            ).length
                        }{" "}
                        accounts are healthy
                    </span>
                </article>
                <article>
                    <span className={styles.metricIcon}>
                        <FiTrendingDown aria-hidden="true" />
                    </span>
                    <small>At-risk revenue</small>
                    <strong>{formatMoney(atRiskArr)}</strong>
                    <span className={styles.metricNote}>
                        {atRiskCustomers.length} accounts need a recovery plan
                    </span>
                </article>
            </section>
            <section className={styles.mainGrid}>
                <article className={styles.card}>
                    <div className={styles.cardHeading}>
                        <div>
                            <h2>Health momentum</h2>
                            <p>Average health score over time</p>
                        </div>
                        <label className={styles.rangeSelect}>
                            <span className={styles.visuallyHidden}>
                                Choose trend range
                            </span>
                            <select
                                onChange={(event) =>
                                    setRange(event.target.value)
                                }
                                value={range}
                            >
                                {Object.keys(ranges).map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className={styles.trendValue}>
                        <strong>{averageHealth}</strong>
                        <span>Current average</span>
                        <span className={styles.positive}>
                            <FiTrendingUp aria-hidden="true" /> 8 points
                        </span>
                    </div>
                    <div className={styles.chart}>
                        <svg
                            aria-label={"Average customer health over " + range}
                            role="img"
                            viewBox="0 0 700 170"
                        >
                            {[28, 68, 108, 148].map((y) => (
                                <line key={y} x1="12" x2="688" y1={y} y2={y} />
                            ))}
                            <path d={trendPath} />
                            {points.map((point, index) => (
                                <circle
                                    key={index}
                                    cx={point[0]}
                                    cy={point[1]}
                                    r="3.5"
                                />
                            ))}
                        </svg>
                        <div>
                            <span>Earlier</span>
                            <span>Today</span>
                        </div>
                    </div>
                    <div className={styles.chartFootnote}>
                        <span /> Health score reflects adoption, customer
                        outcomes, and relationship signals.
                    </div>
                </article>
                <article className={styles.card}>
                    <div className={styles.cardHeading}>
                        <div>
                            <h2>Revenue by plan</h2>
                            <p>Portfolio value by customer tier</p>
                        </div>
                        <FiArrowUpRight aria-hidden="true" />
                    </div>
                    <div className={styles.planBreakdown}>
                        {byPlan.map((item) => (
                            <div className={styles.planRow} key={item.plan}>
                                <div>
                                    <strong>{item.plan}</strong>
                                    <span>{item.count} accounts</span>
                                </div>
                                <div className={styles.barTrack}>
                                    <span
                                        style={{
                                            width:
                                                (totalArr
                                                    ? (item.arr / totalArr) *
                                                      100
                                                    : 0) + "%",
                                        }}
                                    />
                                </div>
                                <strong>{formatMoney(item.arr)}</strong>
                            </div>
                        ))}
                    </div>
                    <NavLink className={styles.cardLink} to="/customers">
                        Explore customer accounts{" "}
                        <FiArrowRight aria-hidden="true" />
                    </NavLink>
                </article>
            </section>
            <section className={styles.bottomGrid}>
                <article className={styles.card}>
                    <div className={styles.cardHeading}>
                        <div>
                            <h2>Renewal coverage</h2>
                            <p>
                                Accounts with renewal dates in the next 90 days
                            </p>
                        </div>
                        <span className={styles.countBadge}>
                            {upcomingRenewals.length} accounts
                        </span>
                    </div>
                    <div className={styles.renewalList}>
                        {upcomingRenewals.length ? (
                            upcomingRenewals.map((customer) => (
                                <button
                                    className={styles.renewalRow}
                                    key={customer.id}
                                    onClick={() => openCustomer(customer.id)}
                                    type="button"
                                >
                                    <CustomerAvatar
                                        className={styles.avatar}
                                        customer={customer}
                                    />
                                    <span>
                                        <strong>{customer.name}</strong>
                                        <small>
                                            {customer.owner} · {customer.plan}
                                        </small>
                                    </span>
                                    <span className={styles.renewalAmount}>
                                        {formatMoney(customer.arr)}
                                        <small>
                                            {formatDate(customer.renewal)}
                                        </small>
                                    </span>
                                </button>
                            ))
                        ) : (
                            <p className={styles.emptyText}>
                                No renewals are scheduled in the next 90 days.
                            </p>
                        )}
                    </div>
                    <NavLink
                        className={styles.cardLink}
                        to="/customers?renewal=next-90"
                    >
                        Review renewal accounts{" "}
                        <FiArrowRight aria-hidden="true" />
                    </NavLink>
                </article>
                <article className={styles.riskCard}>
                    <span className={styles.riskIcon}>
                        <FiTrendingDown aria-hidden="true" />
                    </span>
                    <h2>
                        Protect the relationships that need a little more care
                    </h2>
                    <p>
                        {atRiskCustomers.length
                            ? atRiskCustomers.length +
                              " accounts represent " +
                              formatMoney(atRiskArr) +
                              " in annual value. Start a recovery plan and give the next conversation a clear owner."
                            : "No customer accounts are at risk right now. Keep the healthy customer habits going."}
                    </p>
                    <NavLink
                        className={styles.riskLink}
                        to="/customers?status=At%20risk"
                    >
                        Review at-risk accounts{" "}
                        <FiArrowUpRight aria-hidden="true" />
                    </NavLink>
                </article>
            </section>
            <p className={styles.dataNote}>
                Insights are calculated from the seeded customer records and
                session changes in this browser demo. Refreshing restores the
                sample data.
            </p>
        </div>
    );
};

export default InsightsPage;
