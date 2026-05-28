const Notification = ({ notification }) => {
  if (!notification || notification.message === null) {
    return null;
  }

  const { message, type } = notification;

  return <div className={type}>{message}</div>;
};
export default Notification;
