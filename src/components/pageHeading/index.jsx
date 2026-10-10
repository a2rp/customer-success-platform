import styles from "./styles.module.css";

const PageHeading = ({ title, description, actions }) => (
    <section className={styles.heading}>
        <div>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
    </section>
);

export default PageHeading;

