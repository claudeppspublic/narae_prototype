import React from "react";

export function Container({ size = "wide", children, style, ...rest }) {
  const max = { wide: 1200, medium: 1024, narrow: 720 }[size] || 1200;
  return (
    <div style={{ width: "100%", maxWidth: max, margin: "0 auto", padding: "0 24px", boxSizing: "border-box", ...style }} {...rest}>
      {children}
    </div>
  );
}

export default Container;
