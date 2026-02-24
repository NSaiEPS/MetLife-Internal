import {
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCharactersFilteredList,
  getCharactersFilterOptions,
  getCharactersList,
} from "../../redux/features/scriptSlice";
import FullScreenGradientLoader from "../common/GradientLoader";

const AvailableCharacters = ({ characters, setCharacterData, setForm }) => {
  const [filters, setFilters] = useState({
    gender: "",
    role: "",
    age: "",
    origin: "",
  });
  // const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  // const [ characterData, setCharacterData] = useState(null);
  const { charactersListFilters, scriptLoader } = useSelector(
    (state) => state?.Script,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCharactersList());
    dispatch(getCharactersFilterOptions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getCharactersFilteredList(
        filters.gender,
        filters.role,
        filters.age,
        filters.origin,
      ),
    );
  }, [dispatch, filters.gender, filters.role, filters.age, filters.origin]);

  const handleChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSigleCharacter = (characterData) => {
    setForm((prev) => {
      return {
        ...prev,
        name: characterData?.character_name,
        age: characterData?.age,
        gender: characterData?.gender,
        role: characterData?.role,
        origin: characterData?.origin,
        image_s3_key: characterData?.image_s3_key,
        image_url: characterData?.image_url,
        script_id: characterData?.script_id,
        skin_tone: characterData?.appearance?.skin_tone,
        accessories: characterData?.appearance?.accessories,
        build: characterData?.appearance?.build,
        face: characterData?.appearance?.face,
        hair: characterData?.appearance?.hair,
        wardrobe: characterData?.appearance?.wardrobe,
        personality: characterData?.appearance?.personality,
      };
    });
    console.log(characterData, "check");
    // setSelectedCharacterId(characterData.id);
    // setCharacterData(characterData);
  };

  // console.log(characterData, "check_character_data")

  return (
    <Box>
      <Box display="flex" gap={2} mb={4}>
        {charactersListFilters?.genders?.length > 0 && (
          <FormControl fullWidth size="small">
            <InputLabel>Gender</InputLabel>
            <Select
              value={filters.gender}
              label="Gender"
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {charactersListFilters.genders.map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {gender}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {charactersListFilters?.roles?.length > 0 && (
          <FormControl fullWidth size="small">
            <InputLabel>Role</InputLabel>
            <Select
              value={filters.role}
              label="Role"
              onChange={(e) => handleChange("role", e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {charactersListFilters.roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {charactersListFilters?.ages?.length > 0 && (
          <FormControl fullWidth size="small">
            <InputLabel>Age</InputLabel>
            <Select
              value={filters.age}
              label="Age"
              onChange={(e) => handleChange("age", e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {charactersListFilters.ages.map((age) => (
                <MenuItem key={age} value={age}>
                  {age}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {charactersListFilters?.origins?.length > 0 && (
          <FormControl fullWidth size="small">
            <InputLabel>Origin</InputLabel>
            <Select
              value={filters.origin}
              label="Origin"
              onChange={(e) => handleChange("origin", e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {charactersListFilters.origins.map((origin) => (
                <MenuItem key={origin} value={origin}>
                  {origin}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {/* 🔹 Characters Grid */}
      {scriptLoader ? (
        <>
          <FullScreenGradientLoader text="Loadig Characters" />
        </>
      ) : (
        <Grid
          container
          spacing={3}
          sx={{ ...(characters?.length === 0 && { justifyContent: "center" }) }}
        >
          {characters?.length === 0 ? (
            <>
              <Grid item xs={12}>
                <Box
                  sx={{
                    py: 8,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "#f5f5f5",
                      width: 80,
                      height: 80,
                      mb: 2,
                    }}
                  >
                    📂
                  </Avatar>

                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="text.primary"
                    gutterBottom
                  >
                    No Characters Found
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your filters to see results.
                  </Typography>
                </Box>
              </Grid>
            </>
          ) : (
            characters?.map((char) => (
              <Grid item xs={12} sm={6} md={3} key={char.id}>
                <Card
                  sx={{
                    textAlign: "center",
                    borderRadius: 3,
                    cursor: "pointer",
                    // border:
                    //   selectedCharacterId === char.id
                    //     ? "2px solid #1976d2"
                    //     : "1px solid #eee",
                    // boxShadow: selectedCharacterId === char.id ? 6 : 1,
                    // transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent onClick={() => handleSigleCharacter(char)}>
                    <Avatar
                      src={char.image_url}
                      alt={char.name}
                      variant="square"
                      sx={{
                        width: 120,
                        height: 120,
                        margin: "0 auto",
                        borderRadius: "5px",
                        mb: 2,
                      }}
                    />

                    <Typography variant="subtitle1" fontWeight={600}>
                      {char.character_name}
                    </Typography>
                    {/* 
                <Typography variant="body2" color="text.secondary">
                  Age: {char.age}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Role: {char.role}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Origin: {char.origin}
                </Typography> */}
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
};

export default AvailableCharacters;
