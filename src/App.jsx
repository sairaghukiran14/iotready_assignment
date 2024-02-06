import React, { useState, useEffect } from "react";
import "./App.css";

import CloudinaryTest from "./Components/CloudinaryTest";

const App = () => {
  return (
    <div className="content_section w-[90%] mx-auto mt-24 justify-start flex p-4">
      {/* <Restart /> */}
      <CloudinaryTest />
    </div>
  );
};

export default App;
