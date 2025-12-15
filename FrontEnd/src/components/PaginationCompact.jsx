import React from "react";

const PaginationCompact = ({ activePage, totalPages, onChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const pages = [];
  const pushPage = (p) => {
    if (p >= 1 && p <= totalPages && !pages.includes(p)) pages.push(p);
  };

  // Always include first two and last two
  pushPage(1);
  pushPage(2);
  pushPage(totalPages - 1);
  pushPage(totalPages);

  // Include neighbors around the current page for sequential navigation
  pushPage(activePage - 1);
  pushPage(activePage);
  pushPage(activePage + 1);

  // Sort and build display with ellipsis
  pages.sort((a, b) => a - b);
  const nodes = [];

  // Prev button
  nodes.push(
    <button
      key="prev"
      className="page-num px-3 py-1 rounded border border-[#e5e7eb] bg-white hover:bg-[#f3f4f6] disabled:opacity-50"
      onClick={() => onChange(Math.max(1, activePage - 1))}
      disabled={activePage === 1}
    >
      {"<"}
    </button>
  );

  for (let i = 0; i < pages.length; i++) {
    const current = pages[i];
    const prev = pages[i - 1];
    if (i > 0 && current - prev > 1) {
      nodes.push(
        <span key={`gap-${prev}-${current}`} className="mx-2 select-none">
          ...
        </span>
      );
    }
    const isActive = current === activePage;
    nodes.push(
      <button
        key={current}
        className={`page-num px-3 py-1 rounded border ${
          isActive
            ? "border-[#1e90ff] bg-[#e6f2ff] text-[#1e90ff] font-semibold shadow-sm"
            : "border-[#e5e7eb] bg-white hover:bg-[#f3f4f6]"
        }`}
        onClick={() => onChange(current)}
        disabled={isActive}
        aria-current={isActive ? "page" : undefined}
      >
        {current}
      </button>
    );
  }

  // Next button
  nodes.push(
    <button
      key="next"
      className="page-num px-3 py-1 rounded border border-[#e5e7eb] bg-white hover:bg-[#f3f4f6] disabled:opacity-50"
      onClick={() => onChange(Math.min(totalPages, activePage + 1))}
      disabled={activePage === totalPages}
    >
      {">"}
    </button>
  );

  return <div className="flex items-center gap-x-2">{nodes}</div>;
};

export default PaginationCompact;
