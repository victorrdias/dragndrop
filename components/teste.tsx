import React from "react";

const validateIsNumber = (value: any) => {
  if (typeof value === "number") {
    return value;
  } else {
    return false;
  }
};

const Teste: React.FC = () => {
  const [myNumber, setMyNumber] = React.useState(0);
  const numberFromAPI = "asdasd";
  React.useEffect(() => {
    const validatedNumber = validateIsNumber(numberFromAPI);
    if (validatedNumber) {
      setMyNumber(validatedNumber);
    }
  }, []);

  return <div>{myNumber}</div>;
};

export default Teste;
