import "@mantine/core/styles.layer.css";
import "./index.css";
import { MantineProvider } from "@mantine/core";

import { ColorSchemeToggle } from "./ColorSchemeToggle/ColorSchemeToggle";
import { theme } from "./theme";
import { Welcome } from "./Welcome/Welcome";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Welcome />
      <ColorSchemeToggle />
    </MantineProvider>
  );
}
