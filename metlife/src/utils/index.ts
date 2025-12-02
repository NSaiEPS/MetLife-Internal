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
import { toast } from "react-toastify";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// --------------------------------------------------------
// Types
// --------------------------------------------------------
export interface Scene {
  Script?: string;
  header?: string;
  OST?: string;
  on_screen_text?: string;
  Type?: string;
  scene_type?: string;
  description?: string;
  [key: string]: any;
}

export interface ScriptData {
  title?: string;
  filename?: string;
  provider?: string;
  logline?: string;
  language?: string;
  suggested_duration_minutes?: string | number;
  scenes: Scene[];
}

// --------------------------------------------------------
// PDF DOWNLOAD
// --------------------------------------------------------
export const downloadScriptPdf = (
  data: ScriptData,
  uploadDownload: boolean = false
) => {
  const doc = new jsPDF();
  const fileName = localStorage.getItem("file_name") ?? "";

  doc.setFontSize(18);
  doc.text(fileName || data.title || data.provider || "Script", 14, 15);

  doc.setFontSize(12);
  doc.text(`Logline: ${data.logline ?? data.language}`, 14, 25);
  doc.text(
    `Duration: ${data.suggested_duration_minutes ?? "2 mins"}`,
    14,
    32
  );

  const tableColumn = ["Scene No.", "Script", "OST", "Type"];

  let tableRows = data.scenes.map((scene, index) => [
    index + 1,
    scene.Script || scene.header || "",
    scene.on_screen_text || scene.OST || "",
    scene.Type || "",
  ]);

  if (uploadDownload) {
    tableRows = data.scenes.map((scene, index) => [
      index + 1,
      scene.description || scene.header || "",
      scene.on_screen_text || scene.OST || "",
      scene.scene_type || "",
    ]);
  }

  (doc as any).autoTable({
    startY: 40,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: { fontSize: 11, cellWidth: "wrap" },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 80 },
      2: { cellWidth: 50 },
      3: { cellWidth: 30 },
    },
  });

  doc.save(`${fileName || "Script"}.pdf`);
};

// --------------------------------------------------------
// WORD DOWNLOAD
// --------------------------------------------------------
export const downloadScriptWord = (
  data: ScriptData,
  uploadDownload: boolean = false
) => {
  if (!data) return;

  const fileName = localStorage.getItem("file_name") ?? "";

  const {
    title,
    filename,
    provider,
    logline,
    suggested_duration_minutes,
    scenes = [],
  } = data;

  const columnWidths = {
    sceneNo: 1000,
    script: 4000,
    ost: 2500,
    type: 1500,
  };

  const makeCell = (
    text: string,
    width: number,
    options: {
      align?: any;
      bold?: boolean;
      color?: string;
      size?: number;
    } = {}
  ) =>
    new TableCell({
      width: { size: width, type: WidthType.DXA },
      verticalAlign: VerticalAlign.CENTER,
      margins: { top: 100, bottom: 100, left: 100, right: 100 },
      children: [
        new Paragraph({
          alignment: options.align || AlignmentType.LEFT,
          spacing: { after: 100 },
          children: [
            new TextRun({
              text,
              bold: options.bold,
              color: options.color || "000000",
              size: options.size || 20,
            }),
          ],
        }),
      ],
    });

  const tableHeader = new TableRow({
    tableHeader: true,
    children: ["Scene No.", "Script", "OST", "Type"].map(
      (text) =>
        new TableCell({
          shading: { type: ShadingType.CLEAR, color: "000000", fill: "1a1a1a" },
          children: [new Paragraph({ text, style: "tableHeader" })],
        })
    ),
  });

  const tableRows = scenes.map((scene, index) => {
    const sceneNumber = String(scene["Scene No."] ?? index + 1);

    const scriptText = uploadDownload
      ? scene.description || scene.header || "-"
      : scene.Script || scene.header || "-";

    const ostText = scene.on_screen_text || scene.OST || "-";
    const typeText = uploadDownload
      ? scene.scene_type || scene.Type || "-"
      : scene.Type || scene.scene_type || "-";

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

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: fileName || title || provider || filename || "Script",
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
                text: `Logline: ${logline ?? data.language ?? "-"}`,
                italics: true,
              }),
            ],
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

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${fileName || "Script"}.docx`);
  });
};

// --------------------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------------------
export const getToken = (): string | undefined => {
  const data = localStorage.getItem("authDetails");
  if (!data) return;
  try {
    return JSON.parse(data)?.access_token;
  } catch {
    return;
  }
};

export const downloadCSV = (response: any, name: string = "data") => {
  const blob = new Blob([response.data], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
};

export const getLoggedInUserType = (): number | undefined => {
  const data = localStorage.getItem("authDetails");
  if (!data) return;
  try {
    return JSON.parse(data)?.role_id;
  } catch {
    return;
  }
};

export const USERS = {
  SUPER_ADMIN: 1,
  SUPPORT_USER: 2,
};

export const formatNumberWithCommas = (input: string | number): string => {
  const num = Number(input);
  if (isNaN(num)) return "";
  return num.toLocaleString("en-US");
};

export const apiErrorHandling = (res: any) => {
  if (res?.message !== "You are not authorised to use this api") {
    toast.error(res?.message ?? "Something went wrong!");
  }
};

export const formatRelativeTime = (
  date: string | number | Date,
  format: string = "DD MMM YYYY, hh:mm:ss A"
): string => {
  if (!date) return "-";
  return dayjs.utc(date).tz("Asia/Kolkata").format(format);
};
