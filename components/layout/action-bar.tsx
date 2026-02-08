import { ArrowBack } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import React from "react";

interface Props {
  title: string;
  description: string;
  href: string;
  buttonText: string;
}

export default function ActionBar(props: Props) {
  const { title, description, href, buttonText } = props;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "linear-gradient(to right, #0d3b66, #124a78)",
        color: "white",
        p: 4,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
      }}
    >
      <Box>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1">{description}</Typography>
      </Box>

      <Link href={href} legacyBehavior passHref>
        <Button
          component="a"
          variant="outlined"
          color="inherit"
          startIcon={<ArrowBack />}
        >
          {buttonText}
        </Button>
      </Link>
    </Box>
  );
}
