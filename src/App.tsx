import { Box } from "@mui/material";
import { AppBar } from "./components/AppBar";
import { Queens } from "./Queens";

export const App = () => {
  return (
    <Box>
      <AppBar />
      <Box className="mt-32">
        <Queens />
      </Box>
    </Box>
  );
};

export default App;
