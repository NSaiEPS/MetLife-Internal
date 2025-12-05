// utils.ts
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
import { Page, Text, View, StyleSheet, Font, pdf } from "@react-pdf/renderer";
import regular from "../assets/NotoSans-Regular.ttf";
import arabic from "../assets/NotoSansArabic-Regular.ttf";
import devnagri from "../assets/NotoSansDevanagari-Regular.ttf";
import bengali from "../assets/NotoSansBengali-Regular.ttf";
import PdfDocument from "../components/common/Pdf/PdfDocument";
import React from "react";

dayjs.extend(utc);
dayjs.extend(timezone);

// ==========================
// TYPES
// ==========================
export interface SceneItem {
  ["Scene No."]?: number;
  Script?: string;
  description?: string;
  header?: string;
  on_screen_text?: string;
  OST?: string;
  Type?: string;
  scene_type?: string;
}

export interface PDFData {
  title?: string;
  filename?: string;
  provider?: string;
  language?: string;
  logline?: string;
  suggested_duration_minutes?: string | number;
  scenes?: SceneItem[];
  source?: string;
}

// ==========================
// Font registration
// ==========================
Font.register({ family: "NotoEnglish", src: regular });
Font.register({ family: "NotoHindiNepali", src: devnagri });
Font.register({ family: "NotoBangla", src: bengali });
Font.register({ family: "NotoArabic", src: arabic });

// Detect font
export const detectFont = (text: string = ""): string => {
  if (/[\u0600-\u06FF]/.test(text)) return "NotoArabic";
  if (/[\u0900-\u097F]/.test(text)) return "NotoHindiNepali";
  if (/[\u0980-\u09FF]/.test(text)) return "NotoBangla";
  return "NotoEnglish";
};

// ==========================
// PDF STYLES
// ==========================
const styles = StyleSheet.create({
  page: { padding: 25, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  infoText: { fontSize: 14, marginBottom: 4 },
  table: {
    display: "flex",
    width: "100%",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableRow: { flexDirection: "row" },
  tableHeader: { backgroundColor: "#1AA06D" },
  th: {
    flex: 1,
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: "#fff",
  },
  td: {
    flex: 1,
    fontSize: 11,
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  tdLast: { flex: 1, fontSize: 11, padding: 6 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#ddd" },
});

// ==========================
// PDF DOWNLOAD
// ==========================
export const downloadScriptPdf = async (data :any, uploadDownload = false) => {
  
  const fileName = localStorage.getItem("file_name") || "Script";

  const blob = await pdf(
    React.createElement(PdfDocument, { data, uploadDownload })
  ).toBlob();

  saveAs(
    blob,
    data?.source == "file"
      ? `${data?.filename}.pdf`
      : `${data?.language.slice(0, 2) + "_"}${data?.title}.pdf`
  );
};

// ==========================
// WORD DOWNLOAD
// ==========================
export const downloadScriptWord = (data : any, uploadDownload = false) => {
  const fileName = localStorage.getItem("file_name");
  if (!data) return;
  console.log(data, "data_checK_word");

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
  const tableRows = scenes.map((scene: any, index : number) => {
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
                  // fileName ?? title ?? data?.provider ?? filename ?? "Script",
                  title ?? data?.provider ?? filename ?? "Script",
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
    saveAs(
      blob,
      data?.source == "file"
        ? `${data?.filename}.docx`
        : `${data?.language.slice(0, 2) + "_"}${data?.title}.docx`
    );
  });
};


export const getToken = (): string | undefined => {
  const data = JSON.parse(localStorage.getItem("authDetails") || "null");
  return data?.access_token;
};

export const downloadCSV = (
  response: { data: BlobPart },
  name: string = "data"
): void => {
  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const getLoggedInUserType = (): number | undefined => {
  const data = localStorage.getItem("authDetails");
  const parsed = data ? JSON.parse(data) : null;
  return parsed?.role_id;
};

export const USERS = {
  SUPER_ADMIN: 1,
  SUPPORT_USER: 2,
};

export const formatNumberWithCommas = (input: number | string): string => {
  const num = Number(input);
  if (isNaN(num)) return "";
  return num.toLocaleString("en-US");
};

export const apiErrorHandling = (res: any): void => {
  if (res?.message !== "You are not authorised to use this api") {
    toast.error(res?.message ?? "Something went wrong!");
  }
};

export const formatRelativeTime = (
  date: string,
  format: string = "DD MMM YYYY, hh:mm:ss A"
): string => {
  if (!date) return "-";
  return dayjs.utc(date).tz("Asia/Kolkata").format(format);
};

export const convertToISTParts = (isoString: string): number => {
  if (!isoString) return 0;
  const backendDate = new Date(isoString);
  const now = new Date();

  const IST_OFFSET = 5.5 * 60 * 60 * 1000;

  const backendIST = new Date(backendDate.getTime() + IST_OFFSET);
  const nowIST = new Date(now.getTime());

  return Math.floor((backendIST.getTime() - nowIST.getTime()) / 1000) + 60;
};
