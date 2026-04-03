"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Typography, IconButton } from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";

interface InspirationCarouselProps {
  ideas: string[];
}

const DELAY = 2000;

export default function InspirationCarousel({
  ideas,
}: InspirationCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const hovering = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (dir: "up" | "down") => {
      setDirection(dir);
      setVisible(false);
      setTimeout(() => {
        setCurrent((c) =>
          dir === "down"
            ? (c + 1) % ideas.length
            : (c - 1 + ideas.length) % ideas.length,
        );
        setVisible(true);
      }, 220);
    },
    [ideas.length],
  );

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!hovering.current) go("down");
    }, DELAY);
  }, [go]);

  useEffect(() => {
    setCurrent(0);
    setVisible(true);
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [ideas, startInterval]);

  const handlePrev = () => {
    go("up");
    startInterval();
  };
  const handleNext = () => {
    go("down");
    startInterval();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        width: "40%",
      }}
      onMouseEnter={() => {
        hovering.current = true;
      }}
      onMouseLeave={() => {
        hovering.current = false;
      }}
    >
      <IconButton
        onClick={handlePrev}
        size="small"
        sx={{ color: "white", p: 0.5 }}
      >
        <KeyboardArrowUp />
      </IconButton>

      <div
        style={{
          width: "100%",
          height: 20,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "white",
            lineHeight: 1.4,
            textAlign: "center",
            fontWeight: 500,
            px: 1,
            transition: "opacity 0.22s ease, transform 0.22s ease",
            opacity: visible ? 1 : 0,
            transform: visible
              ? "translateY(0)"
              : direction === "down"
                ? "translateY(-10px)"
                : "translateY(10px)",
          }}
        >
          {ideas[current]}
        </Typography>
      </div>

      <IconButton
        onClick={handleNext}
        size="small"
        sx={{ color: "white", p: 0.5 }}
      >
        <KeyboardArrowDown />
      </IconButton>
    </div>
  );
}
