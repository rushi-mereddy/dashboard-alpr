"use client";

// Import necessary libraries
import { useState } from "react";
import {
  Grid,
  Box,
  Card,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";

// components
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import { Margin } from "@mui/icons-material";

const Config = () => {
  // State to manage the modal visibility and camera details
  const [isModalOpen, setModalOpen] = useState(false);
  const [cameraDetails, setCameraDetails] = useState({
    name: "",
    ipAddress: "",
  });
  const [cameras, setCameras] = useState<{ name: string; ipAddress: string }[]>([]);

  // Function to handle opening the modal
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Function to handle saving the camera details
  const handleSaveCamera = () => {
    // Check if any field is empty before saving
    if (cameraDetails.name.trim() === "" || cameraDetails.ipAddress.trim() === "") {
      // Display an alert or handle the empty fields scenario
      alert("Please fill in all fields before saving.");
      return;
    }

    setCameras([...cameras, cameraDetails]);
    setCameraDetails({ name: "", ipAddress: "" });
    handleCloseModal();
  };

  return (
    <PageContainer title="Config" description="this is Config page">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>

              {/* Displaying camera cards */}
              {cameras.map((camera, index) => (
                <Card style={{padding: "10px", textAlign: "center", margin: "20px"}} key={index}>
                  <Typography variant="h6">{camera.name}</Typography>
                  <Typography>{camera.ipAddress}</Typography>
                </Card>
              ))}

                            {/* Button to open the modal */}
              <Button variant="contained" onClick={handleOpenModal}>
                Add Camera
              </Button>
              {/* Modal for adding camera details */}
              <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 300,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                  }}
                >
                  <Typography variant="h6" style={{marginTop: "8px", marginBottom: "15px"}}>Add Camera</Typography>
                  <TextField
                    label="Camera Name"
                    value={cameraDetails.name}
                     style={{marginTop: "8px", marginBottom: "15px"}}
                    onChange={(e) =>
                      setCameraDetails({
                        ...cameraDetails,
                        name: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="IP Address"
                    value={cameraDetails.ipAddress}
                     style={{marginTop: "8px", marginBottom: "15px"}}
                    onChange={(e) =>
                      setCameraDetails({
                        ...cameraDetails,
                        ipAddress: e.target.value,
                      })
                    }
                  />
                  <Button variant="contained"  style={{marginTop: "8px", marginBottom: "15px"}} onClick={handleSaveCamera}>
                    Save
                  </Button>
                </Box>
              </Modal>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Config;
