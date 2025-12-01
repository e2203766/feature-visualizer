import React, { useState } from "react";

type Props = {
  enabled: boolean;
  tip: string;
  children: React.ReactNode;
  className?: string;
};

export const Highlight: React.FC<Props> = ({ enabled, tip, children, className = "" }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`relative inline-block ${enabled ? "hl-on" : ""} ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {enabled && <div className="hl-ring rounded-xl" />}
      {children}
      {hover && enabled && <div className="tooltip left-0 -top-10">{tip}</div>}
    </div>
  );
};
