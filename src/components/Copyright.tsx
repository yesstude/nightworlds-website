import { SxProps, Typography } from "@mui/material";

export default function Copyright(props: {
    sx: SxProps
}) {
    return (
        <Typography sx={{
            ...props.sx,
            textAlign: "center",
            fontSize: 12,
            color: "#666",
            fontFamily: "arial"
        }}>
            &copy; {new Date().getFullYear()} NightLight COMM
        </Typography>
    );
}