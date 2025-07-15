// TabPanel.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import './TabPanel.css';

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
      className="tab-panel-container"
      {...other}
    >
      {value === index && (
        <Box className="tab-panel-box">
          <Typography 
            component="div" 
            variant="body1" 
            color="text.primary"
            className="tab-panel-typography"
          >
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}
