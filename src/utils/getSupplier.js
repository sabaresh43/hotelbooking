// utils/getSupplier.js
export const getSupplier = () => {
  const host = window.location.hostname.toLowerCase();

  if (host.includes("dida")) return "dida";
  if (host.includes("goglobal")) return "goglobal";

  // fallback
  return "goglobal";
};
