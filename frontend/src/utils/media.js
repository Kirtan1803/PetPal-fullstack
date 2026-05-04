import API_BASE from "../api/base";

const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

export function getMediaUrl(path, fallback = "/assets/img/images/error_img.png") {
  if (!path) return fallback;
  if (/^https?:\/\//i.test(path)) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_ORIGIN}${normalizedPath}`;
}
