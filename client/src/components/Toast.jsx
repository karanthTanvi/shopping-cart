// a brief message that appears, then fades after 3 seconds
export default function Toast({ message }) {
  if (!message) return null;
  return <div className="toast show">{message}</div>;
}