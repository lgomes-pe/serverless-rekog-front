import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from "react";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone, { defaultClassNames } from "react-dropzone-uploader";
import axios from "axios";

//Uploader layout
const Layout = ({input, previews, submitButton, dropzoneProps, files, extra: {maxFiles}}) => {
  return (
    <div id="div1">
      <div id="uploader">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Uploader
        </p>
        <div {...dropzoneProps}>
          {files.length < maxFiles && input}
        </div>

        {files.length > 0 && submitButton}
      </div>

      <div id="preview">
        {previews}
      </div>
    </div>
  )
}

const Uploader = () => {
  const axios = require("axios").default;

  const API_ENDPOINT = 'https://onhw31kegd.execute-api.eu-central-1.amazonaws.com/default/getSignedUrl'
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
      console.log(f)
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
      maxFiles = {10}
      multiple = {true}
      canCancel = {true}
      LayoutComponent={Layout}
      //PreviewComponent={PreviewLayout}
      classNames={{inputLabelWithFiles: defaultClassNames.inputLabel}}
      inputContent = {(files, extra) => (extra.reject ? 'Only images are allowed !' : "Drop Files or Click to browse")}
      styles = {{
        dropzone: {width: 400, height: 200},
        dropzoneActive: {borderColor: "blue"},
        dropzoneReject: {borderColor: 'FF0000', backgroundColor: '#F1BDAB'},
        inputLabel: (files, extra) => (extra.reject ? {color: '#A02800'} : {})
      }}
      accept = "image/*"
    />
  );
}




function App() {
  return (
    <div className="App">
      <header className="App-header">

        <Uploader />
      </header>
    </div>
  );
}

export default App;
