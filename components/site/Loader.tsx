"use client";

export function Loader({ name = "Cristina" }: { name?: string }) {
  return (
    <div className="cn-loader" id="cn-loader" aria-hidden="true">
      <div className="cn-loader-mark">
        {name.split("").map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
      <div className="cn-loader-bar">
        <div className="cn-loader-bar-fill" />
      </div>
    </div>
  );
}
