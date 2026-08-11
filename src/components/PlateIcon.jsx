// The recurring signature element: a weight plate, rendered as a simple SVG.
// Used across stats, section dividers, and program tags to keep the gym's
// own vocabulary (plates, not generic numbered markers) doing the visual work.
export default function PlateIcon({ size = 56, color = "var(--color-ember)", className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="6" />
      <circle cx="50" cy="50" r="32" fill="none" stroke={color} strokeWidth="2" opacity="0.5" />
      <circle cx="50" cy="50" r="10" fill={color} />
    </svg>
  );
}
