import React, { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Generate a preview for the image
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
    setPrediction(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setPrediction(result.prediction);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Banana Disease Prediction
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="w-full flex justify-center mb-4">
            <label
              htmlFor="fileInput"
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow cursor-pointer hover:bg-blue-600 transition duration-200"
            >
              {file ? "Change File" : "Choose File"}
            </label>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {preview && (
            <div className="mb-4 flex flex-col">
              <p className="text-center text-gray-500 mb-2">Image Preview:</p>
              <img
                src={preview}
                alt="Selected"
                className="max-w-full max-h-48 rounded-lg shadow-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition duration-200"
              >
                Remove Image
              </button>
            </div>
          )}
          <button
            type="submit"
            className={`w-max px-4 py-2 font-semibold rounded-lg shadow transition duration-200 ${
              file
                ? "bg-green-500 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!file}
          >
            Predict disease
          </button>
        </form>
        {prediction ? (
          <div
            className={`mt-6 p-4 rounded-lg ${
              prediction === "Healthy"
                ? "bg-green-100 border border-green-200 text-green-700"
                : "bg-red-100 border border-red-200 text-red-700"
            }`}
          >
            <h2 className="text-lg font-semibold text-center">
              Prediction: {prediction}
            </h2>
          </div>
        ) : (
          <p className="mt-6 text-center text-gray-500">
            Please upload an image to get a prediction.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
