// exportUtils.js

export function downloadGeoJSON(data, filename = "data.geojson") {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/geo+json",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export function downloadCSV(data, filename = "data.csv") {
  if (!Array.isArray(data) || data.length === 0) {
    console.error("Invalid or empty data array for CSV export.");
    return;
  }

  const keys = Object.keys(data[0]);
  const csvRows = [keys.join(",")];

  for (const row of data) {
    const values = keys.map((key) => {
      const val = row[key];
      return typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val;
    });
    csvRows.push(values.join(","));
  }

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
