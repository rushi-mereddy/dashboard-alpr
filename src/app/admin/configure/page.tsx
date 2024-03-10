"use client"

// Page.tsx
import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
// import { editor as ImageMapper } from '@overlapmedia/imagemapper';

// import { Canvas } from 'fabric';
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import Image from "next/image";
import DrawingSVG from "./DrawingSVG";

const Config = () => {
  const [isImageConfigModalOpen, setImageConfigModalOpen] = useState(false);
  const [isDrawingModalOpen, setDrawingModalOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<{
    name: string;
    ipAddress: string;
  } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ x: number; y: number }[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [cameraDetails, setCameraDetails] = useState({
    name: "",
    ipAddress: "",
  });
  const [cameras, setCameras] = useState<{ name: string; ipAddress: string }[]>(
    []
  );

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveCamera = () => {
    if (
      cameraDetails.name.trim() === "" ||
      cameraDetails.ipAddress.trim() === ""
    ) {
      alert("Please fill in all fields before saving.");
      return;
    }

    setCameras([...cameras, cameraDetails]);
    setCameraDetails({ name: "", ipAddress: "" });
    handleCloseModal();
  };

  const handleOpenImageConfigModal = (
    camera: { name: string; ipAddress: string } | null
  ) => {

     const imageUrl = "https://d27p8o2qkwv41j.cloudfront.net/wp-content/uploads/2017/10/shutterstock_521926666-e1508347182482.jpg";
    setSelectedImage(imageUrl);
    setDrawingModalOpen(true);
    // setSelectedCamera(camera);
    // setImageConfigModalOpen(true);
  };

  const handleCloseImageConfigModal = () => {
    setImageConfigModalOpen(false);
  };

const handleSubmitImage = (image: string) => {
   const imageUrl = "https://d27p8o2qkwv41j.cloudfront.net/wp-content/uploads/2017/10/shutterstock_521926666-e1508347182482.jpg";
    setSelectedImage(imageUrl);
  setDrawingModalOpen(true);
};


  const handleCloseDrawingModal = () => {
    setDrawingModalOpen(false);
    setCoordinates([]); // Clear coordinates after closing the modal
  };

  const handleSaveCoordinates = () => {
    alert(`Coordinates: ${JSON.stringify(coordinates)}`);
    handleCloseDrawingModal();
  };

  useEffect(() => {

  }, [isDrawingModalOpen, selectedImage]);

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

              {cameras.map((camera, index) => (
                <Card
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    margin: "20px",
                  }}
                  key={index}
                >
                  <Typography variant="h6">{camera.name}</Typography>
                  <Typography>{camera.ipAddress}</Typography>
                  <Button
                    variant="outlined"
                    style={{
                      marginTop: "8px",
                      marginBottom: "15px",
                    }}
                    onClick={() => handleOpenImageConfigModal(camera)}
                  >
                    Configure
                  </Button>
                </Card>
              ))}

              <Button variant="contained" onClick={handleOpenModal}>
                Add Camera
              </Button>

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
                  <Typography
                    variant="h6"
                    style={{
                      marginTop: "8px",
                      marginBottom: "15px",
                    }}
                  >
                    Add Camera
                  </Typography>
                  <TextField
                    label="Camera Name"
                    value={cameraDetails.name}
                    style={{
                      marginTop: "8px",
                      marginBottom: "15px",
                    }}
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
                    style={{
                      marginTop: "8px",
                      marginBottom: "15px",
                    }}
                    onChange={(e) =>
                      setCameraDetails({
                        ...cameraDetails,
                        ipAddress: e.target.value,
                      })
                    }
                  />
                  <Button
                    variant="contained"
                    style={{
                      marginTop: "8px",
                      marginBottom: "15px",
                    }}
                    onClick={handleSaveCamera}
                  >
                    Save
                  </Button>
                </Box>
              </Modal>

              <Modal
                open={isImageConfigModalOpen}
                onClose={handleCloseImageConfigModal}
              >
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
                  <Typography
                    variant="h6"
                    style={{
                      marginTop: "8px",
                      marginBottom: "15px",
                    }}
                  >
                    Image Configuration
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) {
                        const imageUrl = URL.createObjectURL(selectedFile);
                        handleSubmitImage(imageUrl);
                      }
                    }}
                    style={{ marginBottom: "15px" }}
                  />
                  <Button
                    variant="contained"
                    style={{
                      marginTop: "8px",
                      marginBottom: "15px",
                    }}
                    onClick={() => handleCloseImageConfigModal()}
                  >
                    Submit
                  </Button>
                </Box>
              </Modal>

        {/* Drawing Modal */}
              <Modal open={isDrawingModalOpen} onClose={handleCloseDrawingModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            style={{
              marginTop: '8px',
              marginBottom: '15px',
            }}
          >
            Draw Lines
          </Typography>
          {/* Display the selected image */}
          {selectedImage && (
            <DrawingSVG
    imageUrl={selectedImage}
    onCoordinatesSave={() => setCoordinates(coordinates)}
/>


          )}
          {/* <Button variant="contained" onClick={handleSaveCoordinates}>
            Save Coordinates
          </Button> */}
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
