import styles from "./styles.module.css";

const HealthIndicator = ({ score, status }) => {
    const tone = status === "Healthy" ? "healthy" : status === "Watch" ? "watch" : "risk";
    return (
        <span aria-label={"Health score " + score + " out of 100"} className={styles.indicator}>
            <span aria-hidden="true" className={styles.track} data-tone={tone}><span style={{ width: Math.max(0, Math.min(100, score)) + "%" }} /></span>
            <strong>{score}</strong>
        </span>
    );
};

export default HealthIndicator;

