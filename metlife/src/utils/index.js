import jsPDF from "jspdf";
import "jspdf-autotable";
// import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

// import {
//   Document,
//   Packer,
//   Paragraph,
//   Table,
//   TableRow,
//   TableCell,
//   TextRun,
//   AlignmentType,
//   WidthType,
//   VerticalAlign,
//   BorderStyle,
// } from "docx";
// import { saveAs } from "file-saver";
export const downloadScriptPdf = (data) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(data.title, 14, 15);
  doc.setFontSize(12);

  doc.text(`Logline: ${data.logline}`, 14, 25);
  doc.text(`Duration: ${data.suggested_duration_minutes}`, 14, 32);
  const tableColumn = ["Scene No.", "Script", "OST", "Type"];
  const tableRows = data.scenes.map((scene, index) => [
    // scene?.scene_number.toString(),
    index + 1,
    scene?.Script || scene?.header || "",
    scene?.on_screen_text || scene?.OST || "",
    scene?.Type || "",
  ]);
  doc.autoTable({
    startY: 40,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: { fontSize: 11, cellWidth: "wrap" }, // wrap long text
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
  doc.save(`${data.title}.pdf`);
};

// export const downloadScriptWord = (data) => {
//   const { title, logline, suggested_duration_minutes, scenes } = data;

//   // ✅ Header Row (green background)
//   const tableHeader = new TableRow({
//     children: ["Scene No.", "Script", "OST", "Type"].map(
//       (header) =>
//         new TableCell({
//           width: { size: 25, type: WidthType.PERCENTAGE },
//           verticalAlign: VerticalAlign.CENTER,
//           shading: { fill: "16A085" }, // Teal background
//           children: [
//             new Paragraph({
//               alignment: AlignmentType.CENTER,
//               children: [
//                 new TextRun({
//                   text: header,
//                   bold: true,
//                   color: "FFFFFF",
//                   size: 22,
//                 }),
//               ],
//             }),
//           ],
//         })
//     ),
//   });

//   // ✅ Table body rows
//   const tableRows = scenes.map((scene, index) => {
//     const sceneNumber =
//       scene.scene_number ||
//       scene["Scene No."] ||
//       (index + 1).toString();

//     const scriptText = scene.Script || scene.header || "";
//     const ostText = scene.on_screen_text || scene.OST || "";
//     const typeText = scene.Type || scene.scene_type || "";

//     return new TableRow({
//       children: [
//         new TableCell({
//           width: { size: 10, type: WidthType.PERCENTAGE },
//           verticalAlign: VerticalAlign.CENTER,
//           children: [
//             new Paragraph({
//               alignment: AlignmentType.CENTER,
//               children: [new TextRun(sceneNumber)],
//             }),
//           ],
//         }),
//         new TableCell({
//           width: { size: 45, type: WidthType.PERCENTAGE },
//           verticalAlign: VerticalAlign.CENTER,
//           children: [
//             new Paragraph({
//               alignment: AlignmentType.LEFT,
//               children: [new TextRun({ text: scriptText, size: 20 })],
//             }),
//           ],
//         }),
//         new TableCell({
//           width: { size: 25, type: WidthType.PERCENTAGE },
//           verticalAlign: VerticalAlign.CENTER,
//           children: [
//             new Paragraph({
//               alignment: AlignmentType.LEFT,
//               children: [new TextRun({ text: ostText, size: 20 })],
//             }),
//           ],
//         }),
//         new TableCell({
//           width: { size: 20, type: WidthType.PERCENTAGE },
//           verticalAlign: VerticalAlign.CENTER,
//           children: [
//             new Paragraph({
//               alignment: AlignmentType.CENTER,
//               children: [new TextRun({ text: typeText, size: 20 })],
//             }),
//           ],
//         }),
//       ],
//     });
//   });

//   // ✅ Word Document Layout
//   const doc = new Document({
//     sections: [
//       {
//         children: [
//           // Title
//           new Paragraph({
//             children: [
//               new TextRun({
//                 text: title,
//                 bold: true,
//                 size: 32,
//               }),
//             ],
//             alignment: AlignmentType.CENTER,
//             spacing: { after: 200 },
//           }),

//           // Logline
//           new Paragraph({
//             children: [
//               new TextRun({
//                 text: `Logline: ${logline}`,
//                 italics: true,
//               }),
//             ],
//             spacing: { after: 100 },
//           }),

//           // Duration
//           new Paragraph({
//             text: `Duration: ${suggested_duration_minutes || "-"}`,
//             spacing: { after: 200 },
//           }),

//           // Table
//           new Table({
//             width: { size: 100, type: WidthType.PERCENTAGE },
//             borders: {
//               top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//               bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//               left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//               right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//               insideHorizontal: {
//                 style: BorderStyle.SINGLE,
//                 size: 1,
//                 color: "000000",
//               },
//               insideVertical: {
//                 style: BorderStyle.SINGLE,
//                 size: 1,
//                 color: "000000",
//               },
//             },
//             rows: [tableHeader, ...tableRows],
//           }),
//         ],
//       },
//     ],
//   });

//   // ✅ Download Word File
//   Packer.toBlob(doc).then((blob) => {
//     saveAs(blob, `${title || "Script"}.docx`);
//   });
// };


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
