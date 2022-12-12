import React from "react";

import DropImage from "./DropImage";
import DropPDF from "./dropPDF";
import DropVideo from "./dropVideo";

const index: React.FC = () => {
  return (
    <>
      <DropImage />
      <DropPDF />
      <DropVideo />
    </>
  );
};

export default index;
