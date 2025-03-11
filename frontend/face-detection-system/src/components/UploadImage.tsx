import React, { useState } from "react";
import axios from "axios";

const UploadImage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [peopleCount, setPeopleCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle file change and create image preview
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create an image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Set the preview image
      };
      reader.readAsDataURL(selectedFile); // Read the file as a data URL

      setError(null); // Reset the error if a file is selected
    }
  };

  // Handle image upload
  const onUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPeopleCount(response.data.peopleCount);
      setError(null); // Reset error if successful
    } catch (error) {
      setError("Error analyzing the image.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Upload an Image for People Counting</h1>

      <div style={styles.row}>
        {/* Left Column */}
        <div style={styles.leftCol}>
          <div style={styles.uploadSection}>
            <input type="file" onChange={onFileChange} style={styles.input} />
            <button
              onClick={onUpload}
              disabled={loading}
              style={loading ? styles.buttonDisabled : styles.button}
            >
              {loading ? "Processing..." : "Upload"}
            </button>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          {peopleCount !== null && (
            <div style={styles.resultContainer}>
              <h3 style={styles.resultText}>People Count: {peopleCount}</h3>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={styles.rightCol}>
          {imagePreview && (
            <div>
              <h3 style={styles.previewTitle}>Image Preview:</h3>
              <img
                src={imagePreview}
                alt="Preview"
                style={styles.previewImage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Arial', sans-serif",
    margin: "0 auto",
    padding: "20px",
    maxWidth: "1000px",
  },
  header: {
    fontSize: "25px",
    color: "#fff",
    marginBottom: "20px",
    textAlign: "center",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },
  leftCol: {
    flex: 1,
    maxWidth: "45%",
  },
  rightCol: {
    flex: 1,
    maxWidth: "45%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadSection: {
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
    maxWidth: "300px",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "4px",
    cursor: "not-allowed",
  },
  error: {
    color: "red",
    fontSize: "16px",
    marginTop: "10px",
  },
  resultContainer: {
    marginTop: "20px",
  },
  resultText: {
    fontSize: "20px",
    color: "#fff",
    fontWeight: "bold",
  },
  previewContainer: {
    marginTop: "20px",
    width: "100%",
    textAlign: "center",
  },
  previewTitle: {
    fontSize: "18px",
    color: "#fff",
    marginBottom: "10px",
  },
  previewImage: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
};

export default UploadImage;
