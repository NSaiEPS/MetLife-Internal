import React from 'react'
import {
    AppBar,
    Toolbar,
    Typography,   
} from "@mui/material";
 const OneFrameHeader = () => {
  return (
           <AppBar position="static" sx={{ backgroundColor: "#333", boxShadow: "none" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", fontFamily: "serif", fontSize: "1.5rem" }}>
                        OneFrame
                    </Typography>
                </Toolbar>
            </AppBar>
  )
}

export default OneFrameHeader
