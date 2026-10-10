import { FiArrowLeft, FiCompass } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import styles from "./styles.module.css";

const NotFoundPage = () => (
    <section className={styles.notFound}>
        <span className={styles.icon}>
            <FiCompass aria-hidden="true" />
        </span>
        <p className={styles.code}>404</p>
        <h1>That customer view could not be found</h1>
        <p className={styles.description}>
            The page may have moved, or the address may be incomplete. Head back
            to your customer workspace.
        </p>
        <NavLink className={styles.homeButton} to="/">
            <FiArrowLeft aria-hidden="true" /> Return to overview
        </NavLink>
    </section>
);

export default NotFoundPage;
