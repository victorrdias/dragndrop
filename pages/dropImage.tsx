import React from "react";
import DragnDrop from "../components/DragnDrop";

const DropImage: React.FC = () => {
  return (
    <DragnDrop
      acceptedType={"image/jpeg"}
      acceptedType2={"image/webp"}
      src={"/assets/pic.png"}
      minFileSize={10}
      maxFileSize={3000}
      text="drop your IMAGES here."
      rules="accept img, png, jpeg.
      maxSize 5mb"
      title="TITULO1"
      subTitle="subtitulo1"
    />
  );
};

export default DropImage;
