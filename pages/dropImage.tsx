import React from "react";
import DragnDrop from "../components/DragnDrop";

const DropImage: React.FC = () => {
  return (
    <DragnDrop
      src={"/assets/pic.png"}
      minFileSize={200}
      maxFileSize={3000}
      text="drop your IMAGES here."
      rules="accept img, png, jpeg.
      maxSize 5mb"
      title="TITULO"
      subTitle="subtitulo"
    />
  );
};

export default DropImage;
