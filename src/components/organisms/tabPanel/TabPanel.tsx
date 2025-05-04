// TabPanel.tsx
import React from "react";
import { Box, Typography } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
}

export function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div" variant="body1" color="text.primary">
            {children}
          </Typography>

        </Box>
      )}
    </div>
  );
}
