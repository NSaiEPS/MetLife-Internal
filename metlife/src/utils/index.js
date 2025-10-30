import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
  WidthType,
  VerticalAlign,
  BorderStyle,
  ShadingType,
} from "docx";
import { saveAs } from "file-saver";

export const downloadScriptPdf = (data, uploadDownload = false) => {
  const doc = new jsPDF();
  const fileName = localStorage.getItem("file_name");
  doc.setFontSize(18);
  doc.text(fileName ?? data.title ?? data?.provider, 14, 15);
  doc.setFontSize(12);

  doc.text(`Logline: ${data.logline ?? data?.language}`, 14, 25);
  doc.text(`Duration: ${data.suggested_duration_minutes ?? "2mins"}`, 14, 32);
  const tableColumn = ["Scene No.", "Script", "OST", "Type"];

  let tableRows = data.scenes.map((scene, index) => [
    // scene?.scene_number.toString(),
    index + 1,
    scene?.Script || scene?.header || "",
    scene?.on_screen_text || scene?.OST || "",
    scene?.Type || "",
  ]);
  if (uploadDownload) {
    tableRows = data.scenes.map((scene, index) => [
      // scene?.scene_number.toString(),
      index + 1,
      scene?.description || scene?.header || "",
      scene?.on_screen_text || scene?.OST || "",
      scene?.scene_type || "",
    ]);
  }

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
  // doc.save(`${data.title}.pdf`);
  doc.save(`${fileName || "Script"}.pdf`)
};

// download script word
export const downloadScriptWord = (data, uploadDownload = false) => {
  console.log(data, "word_data");
  const fileName = localStorage.getItem("file_name");
  // console.log(fileName, 'fileNameCheck')
  if (!data) return;

  const {
    title,
    filename,
    logline,
    suggested_duration_minutes,
    scenes = [],
  } = data;

  // ✅ Define fixed column widths in DXA (1 inch = 1440 DXA)
  const columnWidths = {
    sceneNo: 1000, // ~0.7"
    script: 4000, // ~2.8"
    ost: 2500, // ~1.7"
    type: 1500, // ~1.0"
  };

  const makeCell = (text, width, options = {}) =>
    new TableCell({
      width: { size: width, type: WidthType.DXA },
      verticalAlign: VerticalAlign.CENTER,
      margins: { top: 100, bottom: 100, left: 100, right: 100 }, // adds padding
      children: [
        new Paragraph({
          alignment: options.align || AlignmentType.LEFT,
          spacing: { after: 100 },
          children: [
            new TextRun({
              text,
              bold: options.bold || false,
              color: options.color || "000000",
              size: options.size || 20,
            }),
          ],
        }),
      ],
    });

  // ✅ Header Row

  const tableHeader = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        shading: { type: ShadingType.CLEAR, color: "000000", fill: "1a1a1a" }, // dark background
        children: [new Paragraph({ text: "Scene No.", style: "tableHeader" })],
      }),
      new TableCell({
        shading: { type: ShadingType.CLEAR, color: "000000", fill: "1a1a1a" },
        children: [new Paragraph({ text: "Script", style: "tableHeader" })],
      }),
      new TableCell({
        shading: { type: ShadingType.CLEAR, color: "000000", fill: "1a1a1a" },
        children: [new Paragraph({ text: "OST", style: "tableHeader" })],
      }),
      new TableCell({
        shading: { type: ShadingType.CLEAR, color: "000000", fill: "1a1a1a" },
        children: [new Paragraph({ text: "Type", style: "tableHeader" })],
      }),
    ],
  });

  // ✅ Table Body Rows
  const tableRows = scenes.map((scene, index) => {
    // const sceneNumber = scene["Scene No."] ?? index + 1;
    const sceneNumber = String(scene["Scene No."] ?? index + 1);

    const scriptText = uploadDownload
      ? scene?.description || scene?.header || "-"
      : scene?.Script || scene?.header || "-";

    const ostText = scene?.on_screen_text || scene?.OST || "-";
    const typeText = uploadDownload
      ? scene?.scene_type || scene?.Type || "-"
      : scene?.Type || scene?.scene_type || "-";

    return new TableRow({
      children: [
        makeCell(sceneNumber, columnWidths.sceneNo, {
          align: AlignmentType.CENTER,
        }),
        makeCell(scriptText, columnWidths.script),
        makeCell(ostText, columnWidths.ost),
        makeCell(typeText, columnWidths.type, {
          align: AlignmentType.CENTER,
        }),
      ],
    });
  });

  // ✅ Build Document
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                // text: title ?? data?.provider ?? filename ?? "Script",
                text:
                  fileName ?? title ?? data?.provider ?? filename ?? "Script",
                bold: true,
                size: 32,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Logline: ${logline ?? data?.language ?? "-"}`,
                italics: true,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `Duration: ${suggested_duration_minutes ?? "2 mins"}`,
            spacing: { after: 200 },
          }),
          new Table({
            width: { size: 9000, type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              insideHorizontal: {
                style: BorderStyle.SINGLE,
                size: 1,
                color: "000000",
              },
              insideVertical: {
                style: BorderStyle.SINGLE,
                size: 1,
                color: "000000",
              },
            },
            rows: [tableHeader, ...tableRows],
          }),
        ],
      },
    ],
  });

  // ✅ Download Word file
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${fileName || "Script"}.docx`);
  });
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
