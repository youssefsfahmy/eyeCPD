"use client";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CPDCycle } from "@/lib/types/generic";

export default function PeriodSelector({
  mode,
  draftSelector = true,
}: {
  mode?: "card" | "transparent";
  draftSelector?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [cycles, setCycles] = useState<CPDCycle[]>([]);
  const [currentCycle, setCurrentCycle] = useState<string>(
    searchParams.get("cycle") || "",
  );
  const [includeDraft, setIncludeDraft] = useState<boolean>(
    searchParams.get("draft") === "true",
  );
  const isDark = mode === "card";
  const searchParamsString = searchParams.toString();

  const replaceParamsIfChanged = useCallback(
    (params: URLSearchParams) => {
      const next = params.toString();
      if (next === searchParamsString) return;
      router.replace(next ? `${pathname}?${next}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParamsString],
  );

  const handleToggleDraft = (checked: boolean) => {
    setIncludeDraft(checked);
    // Update URL with new draft parameter
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.set("draft", "true");
    } else {
      params.delete("draft");
    }
    replaceParamsIfChanged(params);
  };

  const handleCycleChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value;
    const selectedCycleData = cycles.find(
      (cycle) => cycle.value === selectedValue,
    );

    if (selectedCycleData) {
      setCurrentCycle(selectedValue);

      // Update URL with new cycle parameter
      const params = new URLSearchParams(searchParams.toString());
      if (selectedCycleData.isCurrent) {
        params.delete("cycle");
      } else {
        params.set("cycle", selectedValue);
      }
      replaceParamsIfChanged(params);
    }
  };

  // Generate CPD cycles (Dec 1 to Nov 30 of following year)
  const generateCycles = (): CPDCycle[] => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // Determine the current CPD cycle
    // If we're in Dec, Jan-Nov, the cycle started in the previous December
    const currentCycleStartYear =
      currentMonth === 11 ? currentYear : currentYear - 1;

    const cyclesList: CPDCycle[] = [];

    // Generate 5 cycles: 2 past, current, 2 future
    for (let i = -2; i <= 2; i++) {
      const cycleStartYear = currentCycleStartYear + i;
      const cycleEndYear = cycleStartYear + 1;

      const startDate = new Date(cycleStartYear, 11, 1); // December 1st
      const endDate = new Date(cycleEndYear, 10, 30); // November 30th

      const isCurrent = i === 0;
      const label = `${cycleStartYear}/${cycleEndYear.toString().slice(-2)}`;
      const value = `${cycleStartYear}-${cycleEndYear}`;

      cyclesList.push({
        startDate,
        endDate,
        label,
        value,
        isCurrent,
        year: cycleEndYear.toString(),
      });
    }

    return cyclesList;
  };

  useEffect(() => {
    const generatedCycles = generateCycles();
    setCycles(generatedCycles);

    // Get cycle from URL query parameter
    const cycleFromUrl = searchParams.get("cycle");
    const draftFromUrl = searchParams.get("draft");

    if (draftFromUrl === "true") {
      setIncludeDraft(true);
    } else {
      setIncludeDraft(false);
    }

    if (
      cycleFromUrl &&
      generatedCycles.find((cycle) => cycle.value === cycleFromUrl)
    ) {
      // Use cycle from URL if it's valid
      setCurrentCycle(cycleFromUrl);
    } else {
      // Set current cycle as default and update URL
      const current = generatedCycles.find((cycle) => cycle.isCurrent);
      if (current) {
        setCurrentCycle(current.value);
        // Update URL without cycle for current cycle
        const params = new URLSearchParams(searchParams.toString());
        params.delete("cycle");
        replaceParamsIfChanged(params);
      }
    }
  }, [searchParamsString, replaceParamsIfChanged, searchParams]);

  return (
    <Box sx={{ minWidth: 300, width: "max-content" }}>
      <FormControl
        fullWidth
        size="small"
        sx={
          isDark
            ? {
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiSelect-select": { color: "white" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.6)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.9)",
                },
                "& .MuiSvgIcon-root": { color: "white" },
              }
            : undefined
        }
      >
        <InputLabel id="cycle-selector-label">CPD Cycle</InputLabel>
        <Select
          labelId="cycle-selector-label"
          id="cycle-selector"
          value={currentCycle}
          label="CPD Cycle"
          onChange={handleCycleChange}
          sx={{
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              gap: 1,
            },
          }}
        >
          {cycles.map((cycle) => (
            <MenuItem key={cycle.value} value={cycle.value}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {cycle.label}
                </Typography>
                {cycle.isCurrent && (
                  <Chip
                    label="Current"
                    size="small"
                    color="primary"
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      ml: "auto",
                    }}
                  />
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
        {draftSelector && (
          <FormControlLabel
            control={
              <Switch
                checked={includeDraft}
                onChange={(e) => handleToggleDraft(e.target.checked)}
                color="warning"
              />
            }
            label={
              <Box>
                <Typography
                  variant="caption"
                  color={isDark ? "white" : "text.secondary"}
                >
                  {includeDraft
                    ? "Draft Activities are included"
                    : "Draft Activities are excluded"}
                </Typography>
              </Box>
            }
          />
        )}
      </FormControl>
    </Box>
  );
}

// Utility function to generate all available cycles
export const generateAllCycles = (): CPDCycle[] => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const currentCycleStartYear =
    currentMonth === 11 ? currentYear : currentYear - 1;
  const cyclesList: CPDCycle[] = [];

  // Generate 5 cycles: 2 past, current, 2 future
  for (let i = -2; i <= 2; i++) {
    const cycleStartYear = currentCycleStartYear + i;
    const cycleEndYear = cycleStartYear + 1;

    const startDate = new Date(cycleStartYear, 11, 1);
    const endDate = new Date(cycleEndYear, 10, 30);

    const isCurrent = i === 0;
    const label = `${cycleStartYear}/${cycleEndYear.toString().slice(-2)}`;
    const value = `${cycleStartYear}-${cycleEndYear}`;

    cyclesList.push({
      startDate,
      endDate,
      label,
      value,
      isCurrent,
      year: cycleEndYear.toString(),
    });
  }

  return cyclesList;
};
