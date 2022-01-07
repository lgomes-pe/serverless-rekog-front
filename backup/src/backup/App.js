import logo from './logo.svg';
import './App.css';
import React from "react";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import axios from "axios";


const Uploader = () => {
  const axios = require("axios").default;

  const API_ENDPOINT = 'https://gpzvvcu9c8.execute-api.us-east-2.amazonaws.com/default/getPresignedURL-test'
  const handleChangeStatus = ({meta, remove}, status) => {
    console.log(status, meta);
  };

  const handleSubmit = async(files) => {
    for(var i=0; files.length; i++){
      const f = files[i];
      //GET request for the presigned URL
      const response = await axios({
        method: "GET",
        url: API_ENDPOINT,
      });

      //PUT request to upload the file to S3
      const result = await fetch(response.data.uploadURL, {
        method: "PUT",
        body: f["file"],
      });
    }
  };

  return (
    <Dropzone
      onChangeStatus = {handleChangeStatus}
      onSubmit = {handleSubmit}
      maxFiles = {100}
      multiple = {true}
      canCancel = {true}
      inputContent = "Drop Files"
      styles = {{
        dropzone: {width: 400, height: 200},
        dropzoneActive: {borderColor: "blue"},
      }}
    />
  );
}




function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Uploader
        </p>
        <Uploader />
      </header>
    </div>
  );
}

export default App;
