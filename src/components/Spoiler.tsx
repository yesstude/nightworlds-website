import {
  ArrowDownwardOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import { Box, Icon, Typography } from "@mui/material";
import { ReactNode, useState } from "react";

export function Spoiler(props: {
  title: string;
  children: ReactNode;
  open?: boolean;
}) {
  const [isOpen, setOpen] = useState(!!props.open);

  return (
    <Box
      sx={{
        borderTop: "1px solid #ccc",
        borderBottom: "1px solid #ccc",
        px: 2,
        py: 4,
      }}
    >
      <Box
        onClick={() => setOpen(!isOpen)}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          placeItems: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <Typography variant="h4" component="span" sx={{ m: 0 }}>
          {props.title}
        </Typography>
        <Icon
          sx={{
            backgroundColor: "#eee",
            borderRadius: 16,
            p: 2,
          }}
        >
          <ArrowDropDownOutlined
            sx={{
              rotate: isOpen ? "180deg" : "0deg",
              transition: "rotate 0.3s",
            }}
          />
        </Icon>
      </Box>
      <Box
        sx={{
          maxHeight: isOpen ? "max-content" : "0px",
          opacity: isOpen ? "100%" : "0%",
          overflow: "hidden",
          transition: "max-height 0.5s, opacity 0.5s",
        }}
      >
        <Box sx={{ py: 4 }}>{props.children}</Box>
      </Box>
    </Box>
  );
}
