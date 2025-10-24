
import jsPDF from "jspdf";
import "jspdf-autotable";

export const downloadScriptPdf = (data) => {
  const doc = new jsPDF();

  // 🟢 Title
  doc.setFontSize(18);
  doc.text(data.title, 14, 15);

  // 🟢 Logline & Duration
  doc.setFontSize(12);
  doc.text(`Logline: ${data.logline}`, 14, 25);
  doc.text(`Duration: ${data.suggested_duration_minutes}`, 14, 32);

  // 🟢 Table columns
  const tableColumn = ["Scene No.", "Script", "OST", "Type"];

  // 🟢 Table rows from scenes
  const tableRows = data.scenes.map((scene) => [
    scene.scene_number.toString(),
    scene.description || scene.header || "",
    scene.on_screen_text || scene.OST || "",
    scene.scene_type || "",
  ]);

  // 🟢 Add table with word wrapping
  doc.autoTable({
    startY: 40,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 11, cellWidth: 'wrap' }, // wrap long text
    columnStyles: {
      0: { cellWidth: 20 }, // Scene No.
      1: { cellWidth: 80 }, // Script
      2: { cellWidth: 50 }, // OST
      3: { cellWidth: 30 }, // Type
    },
    didDrawCell: (data) => {
      // Optional: customize cell drawing here
    },
  });

  // 🟢 Save PDF
  doc.save(`${data.title}.pdf`);
};



export const getToken = () => {
  const data = JSON.parse(localStorage.getItem("authDetails"));
  return data?.access_token;
};

export const downloadCSV = (response, name = "data") => {
  const blob = new Blob([response.data], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const getLoggedInUserType = () => {
  const data = localStorage.getItem("authDetails");
  const parsedData = JSON.parse(data);

  return parsedData?.role_id;
};

export const USERS = {
  SUPER_ADMIN: 1,
  SUPPORT_USER: 2,
};

export const formatNumberWithCommas = (input) => {
  const num = Number(input);
  if (isNaN(num)) return "";

  return num.toLocaleString("en-US");
};






