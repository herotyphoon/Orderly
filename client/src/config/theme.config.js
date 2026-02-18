import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#52c73d",
      contrastText: "#0a1c08",
    },
    secondary: {
      main: "#89dcb3",
      contrastText: "#0a1c08",
    },
    divider: "#6fb4be",
    text: {
      primary: "rgb(10, 28, 8)",
      secondary: "rgba(10, 28, 8, 0.6)",
      disabled: "rgba(10, 28, 8, 0.38)",
      hint: "rgb(111, 180, 190)",
    },
    background: {
      default: "#f0fbef",
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4dc238",
      contrastText: "#051004",
    },
    secondary: {
      main: "#23764d",
      contrastText: "#e5f7e3",
    },
    divider: "#418690",
    text: {
      primary: "rgb(229, 247, 227)",
      secondary: "rgba(229, 247, 227, 0.6)",
      disabled: "rgba(229, 247, 227, 0.38)",
      hint: "rgb(65, 134, 144)",
    },
    background: {
      default: "#051004",
      paper: "#0a1c08",
      banner: "#0f2b0d",
    },
  },
});
