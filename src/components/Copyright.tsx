import { SxProps, Typography } from "@mui/material";

export default function Copyright(props: {
    sx: SxProps
}) {
    return (
        <p style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#666",
            fontFamily: "arial",
        }}>
            &copy; {new Date().getFullYear()} NightLight COMM
        </p>
    );
}