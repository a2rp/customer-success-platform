const formatDate = (date) => new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

export { formatDate };

const formatMoney = (value) => {
    if (value >= 1000000) return "$" + (value / 1000000).toFixed(2) + "m";
    if (value >= 1000) return "$" + Math.round(value / 1000) + "k";
    return "$" + Number(value).toLocaleString();
};

export { formatMoney };

const getCustomer = (customers, customerId) => customers.find((customer) => customer.id === customerId);

export { getCustomer };

const getHealthClass = (status) => {
    if (status === "Healthy") return "healthy";
    if (status === "Watch") return "watch";
    return "risk";
};

export { getHealthClass };

const getToday = () => new Date().toISOString().slice(0, 10);

export { getToday };

const getDateAfter = (date, days) => {
    const value = new Date(date + "T00:00:00Z");
    value.setUTCDate(value.getUTCDate() + days);
    return value.toISOString().slice(0, 10);
};

export { getDateAfter };

