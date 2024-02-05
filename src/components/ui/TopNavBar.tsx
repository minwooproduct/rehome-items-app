"use client";

import React from "react";

export default function TopNavBar() {
  return (
    <nav className="top-0 right-0 w-1/10 sticky bg-tranparent text-black p-2 z-50 rounded-lg border border-grey-100">
      <a href="/" className="mr-4">
        Home
      </a>
      <a href="/about" className="mr-4">
        About
      </a>
      <a href="/contact">Contact</a>
    </nav>
  );
}
