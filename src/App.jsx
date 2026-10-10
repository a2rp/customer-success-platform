import styles from "./App.module.css";
import AppRoutes from "./AppRoutes.jsx";
import DialogLayer from "./components/dialogLayer";
import Footer from "./components/footer";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Toasts from "./components/toasts";

const App = () => (
    <div className={styles.app}>
        <a className={styles.skipLink} href="#main-content">
            Skip to content
        </a>
        <Header />
        <Sidebar />
        <main className={styles.main} id="main-content">
            <AppRoutes />
        </main>
        <Footer />
        <DialogLayer />
        <Toasts />
    </div>
);

export default App;
