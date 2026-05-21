export async function fetchFeatureInfo(url) {
  const res = await fetch(url);
  return res.json();
}

export async function fetchSearch(keyword) {
  const res = await fetch(
    `/api/plants/search?keyword=${encodeURIComponent(keyword)}`,
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

export async function fetchStats() {
  const res = await fetch("/api/stats");
  return res.json();
}
export async function fetchPlantLogs(plantId) {
  try {
    const res = await fetch(`/api/plants/${plantId}/logs`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
