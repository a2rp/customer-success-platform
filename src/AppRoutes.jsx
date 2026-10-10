import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading";

const OverviewPage = lazy(() => import("./pages/overview/index.jsx"));
const CustomersPage = lazy(() => import("./pages/customers/index.jsx"));
const PlaybooksPage = lazy(() => import("./pages/playbooks/index.jsx"));
const TasksPage = lazy(() => import("./pages/tasks/index.jsx"));
const InsightsPage = lazy(() => import("./pages/insights/index.jsx"));
const NotFoundPage = lazy(() => import("./pages/notFound/index.jsx"));

const AppRoutes = () => {
    const location = useLocation();

    return (
        <Suspense fallback={<Loading />} key={location.pathname}>
            <Routes location={location}>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/playbooks" element={<PlaybooksPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;

