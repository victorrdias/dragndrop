import React from "react";
import DragnDrop from "../components/DragnDrop";

const DropPDF = () => {
  return (
    <DragnDrop
      src={"/assets/pdf.png"}
      minFileSize={100}
      maxFileSize={5000}
      text="drop your PDF here."
      rules="accept PDF.
      maxSize 5mb"
      title="TITULO"
      subTitle="subtitulo"
    />
  );
};

export default DropPDF;
