import { useState } from "react";
import { useApp } from "../../context/useApp.js";
import Modal from "../modal";
import styles from "./styles.module.css";

const CustomerForm = ({ customerId }) => {
    const { customers, addCustomer, updateCustomer, closeDialog } = useApp();
    const customer = customers.find((item) => item.id === customerId);
    const [values, setValues] = useState(() =>
        customer
            ? { ...customer }
            : {
                  name: "",
                  domain: "",
                  industry: "Technology",
                  plan: "Growth",
                  arr: 48000,
                  health: 75,
                  status: "Watch",
                  renewal: "",
                  owner: "Olivia Chen",
                  contact: "",
                  email: "",
                  notes: "",
              },
    );
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((current) => ({
            ...current,
            [name]: name === "arr" || name === "health" ? Number(value) : value,
        }));
        setErrors((current) => ({ ...current, [name]: "" }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const nextErrors = {};
        if (!values.name.trim()) nextErrors.name = "Enter a customer name.";
        if (!values.domain.trim())
            nextErrors.domain = "Enter the company domain.";
        if (!values.contact.trim())
            nextErrors.contact = "Add a primary contact.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
            nextErrors.email = "Enter a valid email address.";
        if (!values.renewal) nextErrors.renewal = "Choose a renewal date.";
        if (!Number.isFinite(Number(values.arr)) || Number(values.arr) <= 0)
            nextErrors.arr = "ARR must be greater than zero.";
        if (Number(values.health) < 0 || Number(values.health) > 100)
            nextErrors.health = "Health must be between 0 and 100.";
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;
        const cleanValues = {
            ...values,
            name: values.name.trim(),
            domain: values.domain.trim(),
            contact: values.contact.trim(),
            email: values.email.trim(),
        };
        if (customer) updateCustomer(customer.id, cleanValues);
        else addCustomer(cleanValues);
        closeDialog();
    };

    const title = customer ? "Update customer" : "Add a customer";
    return (
        <Modal
            description="Keep the relationship details and next renewal in one place."
            onClose={closeDialog}
            title={title}
        >
            <form className={styles.form} noValidate onSubmit={handleSubmit}>
                <div className={styles.grid}>
                    <label className={styles.field}>
                        <span>Company name</span>
                        <input
                            autoComplete="organization"
                            data-autofocus
                            name="name"
                            onChange={handleChange}
                            placeholder="e.g. Coastline Health"
                            value={values.name}
                        />
                        {errors.name && (
                            <small role="alert">{errors.name}</small>
                        )}
                    </label>
                    <label className={styles.field}>
                        <span>Company domain</span>
                        <input
                            autoComplete="url"
                            name="domain"
                            onChange={handleChange}
                            placeholder="company.com"
                            value={values.domain}
                        />
                        {errors.domain && (
                            <small role="alert">{errors.domain}</small>
                        )}
                    </label>
                    <label className={styles.field}>
                        <span>Industry</span>
                        <select
                            name="industry"
                            onChange={handleChange}
                            value={values.industry}
                        >
                            {[
                                "Technology",
                                "Healthcare",
                                "Fintech",
                                "Retail",
                                "Education",
                                "Energy",
                                "Design",
                                "Other",
                            ].map((item) => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>
                    </label>
                    <label className={styles.field}>
                        <span>Plan</span>
                        <select
                            name="plan"
                            onChange={handleChange}
                            value={values.plan}
                        >
                            {["Starter", "Growth", "Enterprise"].map((item) => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>
                    </label>
                    <label className={styles.field}>
                        <span>Annual recurring revenue</span>
                        <div className={styles.inputPrefix}>
                            <span>$</span>
                            <input
                                min="1"
                                name="arr"
                                onChange={handleChange}
                                type="number"
                                value={values.arr}
                            />
                        </div>
                        {errors.arr && <small role="alert">{errors.arr}</small>}
                    </label>
                    <label className={styles.field}>
                        <span>Health score</span>
                        <div className={styles.inputSuffix}>
                            <input
                                max="100"
                                min="0"
                                name="health"
                                onChange={handleChange}
                                type="number"
                                value={values.health}
                            />
                            <span>/ 100</span>
                        </div>
                        {errors.health && (
                            <small role="alert">{errors.health}</small>
                        )}
                    </label>
                    <label className={styles.field}>
                        <span>Health status</span>
                        <select
                            name="status"
                            onChange={handleChange}
                            value={values.status}
                        >
                            {["Healthy", "Watch", "At risk"].map((item) => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>
                    </label>
                    <label className={styles.field}>
                        <span>Renewal date</span>
                        <input
                            name="renewal"
                            onChange={handleChange}
                            type="date"
                            value={values.renewal}
                        />
                        {errors.renewal && (
                            <small role="alert">{errors.renewal}</small>
                        )}
                    </label>
                    <label className={styles.field}>
                        <span>Primary contact</span>
                        <input
                            autoComplete="name"
                            name="contact"
                            onChange={handleChange}
                            placeholder="Full name"
                            value={values.contact}
                        />
                        {errors.contact && (
                            <small role="alert">{errors.contact}</small>
                        )}
                    </label>
                    <label className={styles.field}>
                        <span>Contact email</span>
                        <input
                            autoComplete="email"
                            name="email"
                            onChange={handleChange}
                            placeholder="name@company.com"
                            type="email"
                            value={values.email}
                        />
                        {errors.email && (
                            <small role="alert">{errors.email}</small>
                        )}
                    </label>
                    <label className={styles.field}>
                        <span>Customer success owner</span>
                        <select
                            name="owner"
                            onChange={handleChange}
                            value={values.owner}
                        >
                            {["Olivia Chen", "Jordan Lee", "Sam Rivera"].map(
                                (item) => (
                                    <option key={item}>{item}</option>
                                ),
                            )}
                        </select>
                    </label>
                </div>
                <label className={styles.field}>
                    <span>Relationship notes</span>
                    <textarea
                        name="notes"
                        onChange={handleChange}
                        placeholder="What matters to this customer?"
                        rows="3"
                        value={values.notes}
                    />
                </label>
                <div className={styles.actions}>
                    <button
                        className={styles.cancelButton}
                        onClick={closeDialog}
                        type="button"
                    >
                        Cancel
                    </button>
                    <button className={styles.submitButton} type="submit">
                        {customer ? "Save changes" : "Add customer"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CustomerForm;
