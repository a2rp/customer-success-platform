const CustomerAvatar = ({ customer, className = "" }) => (
    <img
        alt=""
        className={className}
        loading="lazy"
        src={import.meta.env.BASE_URL + "assets/" + customer.avatar}
    />
);

export default CustomerAvatar;
