import React, { useState } from "react";

export const Menu = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>{children}</button>
      {open && <div className="absolute top-0 right-0">{children}</div>}
    </div>
  );
};

export const MenuItem = ({ children, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
    >
      {children}
    </div>
  );
};
