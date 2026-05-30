export default function StatusBadge({ status }) {
  return (
    <span className={`status status-${status}`}>
      <span aria-hidden="true" />
      {status}
    </span>
  );
}
