import { SxProps, Typography } from "@mui/material";
import Link from "next/link";

export default function Copyright(props: { sx: SxProps }) {
  return (
    <p
      style={{
        textAlign: "center",
        fontSize: "12px",
        color: "#666",
        fontFamily: "arial",
      }}
    >
      ИНН 434584407807 | <Link href="/documents">Договор-оферта, политика конфиденциальности, документы</Link> | &copy; {new Date().getFullYear()}
    </p>
  );
}
