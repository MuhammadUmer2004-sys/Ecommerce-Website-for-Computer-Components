import React, { useState, useCallback } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  Upload as UploadIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  FileCopy as FileIcon,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import "./../../components-css/ProductManagement.css";

const ProductManagement = () => {
  const [singleProduct, setSingleProduct] = useState({
    name: "",
    brand: "",
    price: "",
    description: "",
    image: null,
  });
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const handleSingleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setAlert({
        show: true,
        type: "success",
        message: "Product added successfully!",
      });
      setSingleProduct({
        name: "",
        brand: "",
        price: "",
        description: "",
        image: null,
      });
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: "Failed to add product",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    } else {
      setAlert({
        show: true,
        type: "error",
        message: "Please upload a valid CSV file",
      });
    }
  };

  const handleBulkUpload = async () => {
    if (!csvFile) return;
    setLoading(true);
    try {
      setAlert({
        show: true,
        type: "success",
        message: "Products imported successfully!",
      });
      setCsvFile(null);
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: "Failed to import products",
      });
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0].type === "text/csv") {
      setCsvFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
  });

  return (
    <Box className="product-management fade-in">
      <Container maxWidth="lg">
        <Typography variant="h3" className="page-title slide-down">
          Product Management
        </Typography>

        {alert.show && (
          <Alert
            severity={alert.type}
            onClose={() => setAlert({ ...alert, show: false })}
            className="alert slide-in"
          >
            {alert.message}
          </Alert>
        )}

        <Box className="content-grid">
          <Paper className="form-section slide-up">
            <Typography variant="h5">Add Single Product</Typography>
            <form onSubmit={handleSingleProductSubmit}>
              <TextField
                fullWidth
                label="Product Name"
                value={singleProduct.name}
                onChange={(e) =>
                  setSingleProduct({ ...singleProduct, name: e.target.value })
                }
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Brand"
                value={singleProduct.brand}
                onChange={(e) =>
                  setSingleProduct({ ...singleProduct, brand: e.target.value })
                }
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={singleProduct.price}
                onChange={(e) =>
                  setSingleProduct({ ...singleProduct, price: e.target.value })
                }
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={singleProduct.description}
                onChange={(e) =>
                  setSingleProduct({
                    ...singleProduct,
                    description: e.target.value,
                  })
                }
                required
                margin="normal"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSingleProduct({
                    ...singleProduct,
                    image: e.target.files[0],
                  })
                }
                className="file-input"
              />
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <AddIcon />
                }
                className="submit-button"
              >
                Add Product
              </Button>
            </form>
          </Paper>

          <Divider orientation="vertical" flexItem />

          <Paper className="form-section slide-up">
            <Typography variant="h5">Bulk Import Products</Typography>

            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? "active" : ""}`}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon className="upload-icon" />
              {isDragActive ? (
                <Typography>Drop the CSV file here</Typography>
              ) : (
                <Typography>
                  Drag & drop a CSV file here, or click to select
                </Typography>
              )}
              {csvFile && (
                <Box className="file-info">
                  <FileIcon />
                  <Typography>{csvFile.name}</Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCsvFile(null);
                    }}
                  >
                    ×
                  </IconButton>
                </Box>
              )}
            </div>

            <Button
              variant="contained"
              onClick={handleBulkUpload}
              disabled={!csvFile || loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <UploadIcon />
              }
              className="submit-button"
            >
              Import Products
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductManagement;
