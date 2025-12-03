import React from "react";
import {
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Document,
} from "@react-pdf/renderer";

import type { DocumentProps } from "@react-pdf/renderer";


import regular from "../../../assets/NotoSans-Regular.ttf";
import arabic from "../../../assets/NotoSansArabic-Regular.ttf";
import devnagri from "../../../assets/NotoSansDevanagari-Regular.ttf";
import bengali from "../../../assets/NotoSansBengali-Regular.ttf";

// ---------- Types ----------
export interface SceneItem {
  Script?: string;
  description?: string;
  header?: string;
  on_screen_text?: string;
  OST?: string;
  Type?: string;
  scene_type?: string;
}

export interface ScriptData {
  title?: string;
  logline?: string;
  language?: string;
  suggested_duration_minutes?: string | number;
  scenes: SceneItem[];
}

interface PdfDocumentProps extends DocumentProps {
  data: ScriptData;
  uploadDownload?: boolean;
}


// ---------- Register Fonts ----------
Font.register({ family: "NotoEnglish", src: regular });
Font.register({ family: "NotoHindiNepali", src: devnagri });
Font.register({ family: "NotoBangla", src: bengali });
Font.register({ family: "NotoArabic", src: arabic });

// Detect font based on character language
const detectFont = (text = ""): string => {
  if (/[\u0600-\u06FF]/.test(text)) return "NotoArabic";
  if (/[\u0900-\u097F]/.test(text)) return "NotoHindiNepali";
  if (/[\u0980-\u09FF]/.test(text)) return "NotoBangla";
  return "NotoEnglish";
};

// ---------- Component ----------
const PdfDocument: React.FC<PdfDocumentProps> = ({ data, uploadDownload }) => {
  const styles = StyleSheet.create({
    page: { padding: 25, backgroundColor: "#fff" },
    title: { fontSize: 22, marginBottom: 10, fontWeight: "bold" },
    infoText: { fontSize: 14, marginBottom: 4 },
  table: {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  borderWidth: 1,
  borderColor: "#ccc",
  marginTop: 20,
},

    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    headerCell: {
      padding: 6,
      fontSize: 12,
      fontWeight: "bold",
      color: "#fff",
      backgroundColor: "#16A085",
      borderRightWidth: 1,
      borderRightColor: "#fff",
    },
    cell: {
      padding: 6,
      fontSize: 11,
      borderRightWidth: 1,
      borderRightColor: "#ccc",
    },
    lastCell: {
      padding: 6,
      fontSize: 11,
    },
  });

  const mapRows = (scene: SceneItem, index: number) => ({
    no: index + 1,
    script: scene.Script || scene.description || scene.header || "",
    ost: scene.on_screen_text || scene.OST || "",
    type: scene.Type || scene.scene_type || "",
  });

  const rows = data.scenes.map(mapRows);
  const fileName = localStorage.getItem("file_name") || "Script";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={[styles.title, { fontFamily: detectFont(data.title) }]}>
          {data.title || fileName}
        </Text>

        <Text
          style={[styles.infoText, { fontFamily: detectFont(data.logline) }]}
        >
          Logline: {data.logline ?? data.language}
        </Text>

        <Text style={styles.infoText}>
          Duration: {data.suggested_duration_minutes ?? "2 mins"}
        </Text>

        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={[styles.headerCell, { flex: 1 }]}>Scene No.</Text>
            <Text style={[styles.headerCell, { flex: 5 }]}>Script</Text>
            <Text style={[styles.headerCell, { flex: 2 }]}>OST</Text>
            <Text style={[styles.headerCell, { flex: 2 }]}>Type</Text>
          </View>

          {rows.map((row, i) => (
            <View key={i} style={styles.row}>
              <Text style={[styles.cell, { flex: 1 }]}>{row.no}</Text>

              <Text
                style={[
                  styles.cell,
                  { flex: 5, fontFamily: detectFont(row.script) },
                ]}
              >
                {row.script}
              </Text>

              <Text
                style={[
                  styles.cell,
                  { flex: 2, fontFamily: detectFont(row.ost) },
                ]}
              >
                {row.ost}
              </Text>

              <Text
                style={[
                  styles.lastCell,
                  { flex: 2, fontFamily: detectFont(row.type) },
                ]}
              >
                {row.type}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default PdfDocument;
