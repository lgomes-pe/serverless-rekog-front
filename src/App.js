import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from "react";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone, { defaultClassNames } from "react-dropzone-uploader";
import axios from "axios";
import { isLabelWithInternallyDisabledControl } from '@testing-library/user-event/dist/utils';

//Uploader layout
const Layout = ({input, previews, submitButton, dropzoneProps, files, extra: {maxFiles}}) => {
  return (
    <div id="div1">
      <div id="uploader">
        <img src={logo} className="App-logo" alt="logo" />
        <p id="app-name">
          Serverless Rekognizer
        </p>
        <div {...dropzoneProps}>
          {files.length < maxFiles && input}
        </div>

        {files.length > 0 && submitButton}
      </div>

      <div id="div2">
        {previews}
      </div>
    </div>
  )
}

const LayoutThing = ({imageClass, meta}) => {
  const {name, previewUrl, percent, status, size} = meta
  return (
    <div id="preview_div2">
      <div id="preview_div1">
        <div id="preview">
          <img src={previewUrl}/>
        </div>
        <p>{name}</p>
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
    let ids = [];
    for(var i=0; i < files.length; i++){
      const f = files[i];
      //GET request for the presigned URL
      const response = await axios({
        method: "GET",
        url: API_ENDPOINT,
      });

      ids.push(response.data.filename)

      //PUT request to upload the file to S3
      const result = await fetch(response.data.uploadURL, {
        method: "PUT",
        body: f["file"],
      });
    }

    let labels = [];
    await new Promise(resolve => setTimeout(resolve, 2000));
    for(var i=0; i < ids.length; i++){
      const response = await axios.get('https://yzb8v1kp53.execute-api.eu-central-1.amazonaws.com/label/get_label', {params: {id: ids[i]}})
      console.log(response.data.body)
      const response2 = JSON.parse(response.data.body)
      console.log(response2.Item.Labels)
      labels = response2.Item.Labels
    }
    console.log("hey", ids)
  };


  return (
    <Dropzone
      onChangeStatus = {handleChangeStatus}
      onSubmit = {handleSubmit}
      maxFiles = {100}
      multiple = {true}
      canCancel = {true}
      LayoutComponent={Layout}
      PreviewComponent={LayoutThing}
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
