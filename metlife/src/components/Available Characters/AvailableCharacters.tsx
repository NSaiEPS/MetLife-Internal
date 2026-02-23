import {
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
} from "@mui/material";
import { useState } from "react";

const filterTabs = ["Name", "Role", "Age", "Ethnicity"];

const AvailableCharacters = ({ characters }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box>
      {/* 🔹 Filter Tabs */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        {filterTabs.map((tab, index) => (
          <Tab key={index} label={tab} />
        ))}
      </Tabs>

      {/* 🔹 Characters Grid */}
      <Grid container spacing={3}>
        {characters?.map((char) => (
          <Grid item xs={12} sm={6} md={3} key={char.id}>
            <Card
              sx={{
                textAlign: "center",
                borderRadius: 3,
                cursor: "pointer",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Avatar
                  src={char.avatar}
                  alt={char.name}
                  sx={{
                    width: 100,
                    height: 100,
                    margin: "0 auto",
                    mb: 2,
                  }}
                />

                <Typography variant="subtitle1" fontWeight={600}>
                  {char.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Age: {char.age}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Role: {char.role}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Ethnicity: {char.ethnicity}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AvailableCharacters;