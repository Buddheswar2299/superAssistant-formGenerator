import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, } from 'react-bootstrap';
import "./App.css"; 
import CategorizeForm from "./components/Categorize";
import FillTheBlank from "./components/FillTheBlank";
import Comprehension from "./components/Comprehension";


const App = () => {

  
    

  return(
    <div>
      <DndProvider backend={HTML5Backend}>
        <CategorizeForm />
        <FillTheBlank />
        <Comprehension />

       
      </DndProvider>

      <div className="flex items-center justify-center">
        <Button
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => {
            window.location.href = "https://response-form-superassistant.netlify.app/";
            
          }}
        >
          Generate Form
        </Button>
      </div>


      </div>
  )

};

export default App;
