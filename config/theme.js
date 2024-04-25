import { createTheme } from "@mui/material/styles";
import tailwindConfig from "../tailwind.config";

const {
  theme: {
    extend: { colors },
  },
} = tailwindConfig;

const theme = createTheme({
  palette: {
    primary: {
      main: colors["naasa-green"],
    },
    secondary: {
      main: colors["naasa-yellow"],
    },
  },
  //   typography: {
  //     fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
  //   },
});

export default theme;
