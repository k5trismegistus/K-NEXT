"use client";

import { Box, Container, Tabs, Tab, Typography } from "@mui/material";
import React from "react";
import ListVideos from "../../components/ListVideos";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export default () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Video" />
          <Tab label="Comic" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <ListVideos />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
    </Container>
  );
};
