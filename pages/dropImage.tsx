import React from "react";
import DragnDrop from "../components/DragnDrop";
import Teste from "../components/teste";
// refactor rules for types using acceptedFormats object.
const DropImage: React.FC = () => {
  return (
    <>
      <DragnDrop
        acceptedTypes={["image/jpeg", "image/webp"]}
        src={"/assets/pic.png"}
        minFileSize={10}
        maxFileSize={3000}
        text="drop your IMAGES here."
        rules="accept img, png, jpeg.
    maxSize 5mb"
        title="TITULO1"
        subTitle="subtitulo1"
      />
      <Teste />
    </>
  );
};

export default DropImage;
