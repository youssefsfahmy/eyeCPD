import { Add, ArrowBack } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import PeriodSelector from "../dashboard/period-selector";

interface Props {
  title: string;
  description: string;
  bottomRadius?: boolean;
  button: {
    href: string;
    text: string;
    onClick?: () => void;
    icon?: "add" | "back";
  };
  secondaryButton?: {
    href: string;
    text: string;
    onClick?: () => void;
    icon?: "add" | "back";
  };
  periodSelector?: boolean;
  draftSelector?: boolean;
  mode?: "card" | "transparent";
}

export default function ActionBar(props: Props) {
  const {
    title,
    description,
    button,
    secondaryButton,
    mode = "card",
    periodSelector,
    draftSelector,
  } = props;
  const isTransparent = mode === "transparent";
  const iconMap = {
    add: <Add />,
    back: <ArrowBack />,
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: isTransparent
          ? "transparent"
          : "linear-gradient(to right, #0d3b66, #1f6fb2)",
        color: isTransparent ? "inherit" : "white",
        p: isTransparent ? 0 : 4,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        borderBottomRightRadius: props.bottomRadius ? 16 : 0,
        borderBottomLeftRadius: props.bottomRadius ? 16 : 0,
        marginBottom: props.bottomRadius ? 3 : 0,
      }}
    >
      <Box>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1">{description}</Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        {secondaryButton &&
          (secondaryButton.onClick ? (
            <Button
              variant="outlined"
              color="inherit"
              startIcon={
                secondaryButton.icon ? iconMap[secondaryButton.icon] : undefined
              }
              onClick={secondaryButton.onClick}
              sx={{
                minWidth: "9rem",
                marginTop: "2px",
              }}
            >
              {secondaryButton.text}
            </Button>
          ) : (
            <Link href={secondaryButton.href} legacyBehavior passHref>
              <Button
                component="a"
                variant="outlined"
                color="inherit"
                startIcon={
                  secondaryButton.icon
                    ? iconMap[secondaryButton.icon]
                    : undefined
                }
                sx={{
                  minWidth: "9rem",
                  marginTop: "2px",
                }}
              >
                {secondaryButton.text}
              </Button>
            </Link>
          ))}
        {button.onClick ? (
          <Button
            variant="outlined"
            color="inherit"
            startIcon={button.icon ? iconMap[button.icon] : undefined}
            onClick={button.onClick}
            sx={{
              minWidth: "9rem",
              marginTop: "2px",
            }}
          >
            {button.text}
          </Button>
        ) : (
          <Link href={button.href} legacyBehavior passHref>
            <Button
              component="a"
              variant="outlined"
              color="inherit"
              startIcon={button.icon ? iconMap[button.icon] : undefined}
              sx={{
                minWidth: "9rem",
                marginTop: "2px",
              }}
            >
              {button.text}
            </Button>
          </Link>
        )}
        {periodSelector && (
          <PeriodSelector mode={mode} draftSelector={draftSelector} />
        )}
      </Box>
    </Box>
  );
}
