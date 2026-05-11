const Star = () => (
  <svg className="cn-marquee-star" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.4 7.4L22 10l-6 4.6L18 22l-6-4.5L6 22l2-7.4L2 10l7.6-.6z" />
  </svg>
);

export function Marquee({ items }: { items: string[] }) {
  const duplicated = [...items, ...items];
  return (
    <div className="cn-marquee-section" aria-hidden="true">
      <div className="cn-marquee-track">
        {duplicated.map((item, i) => (
          <span key={i} className="cn-marquee-item">
            {i % 2 === 0 ? item : <i>{item}</i>}
            <Star />
          </span>
        ))}
      </div>
    </div>
  );
}
