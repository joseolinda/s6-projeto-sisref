import React from "react";
import Box from "@material-ui/core/Box";

export default ({ children, sx, className }) => (
  <Box
    sx={{
      py: [6, null, 0],
      px: [4, null, 0],
      ...sx,
    }}
    className={className}
  >
    {children}
  </Box>
);
