export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="loading-center">
      <div className="spinner" />
      <p className="loading-text">{text}</p>
    </div>
  );
}
