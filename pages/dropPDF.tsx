import React from "react";
import DragnDrop from "../components/DragnDrop";

const DropPDF = () => {
  return (
    <DragnDrop
      acceptedType={"application/pdf"}
      acceptedType2={
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      }
      src={"/assets/pdf.png"}
      minFileSize={10}
      maxFileSize={5000}
      text="drop your PDF here."
      rules="accept PDF.
      maxSize 5mb"
      title="TITUL2O"
      subTitle="subtitulo2"
    />
  );
};

export default DropPDF;
