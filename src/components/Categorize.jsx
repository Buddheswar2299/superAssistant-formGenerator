import React, { useState,useEffect } from "react";
import {  useDrag, useDrop } from "react-dnd";
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
 

const CategorizeForm = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Category 1" },
    { id: 2, name: "Category 2" },
  ]);

  const [items, setItems] = useState([
    { id: 1, name: "Item 1", belongsTo: "Category 1" },
    { id: 2, name: "Item 2", belongsTo: "Category 2" },
  ]);

  const [questionTitle, setQuestionTitle] = useState("Drag items to their respective categories"); // Added state for question title
  const [questionDescription, setQuestionDescription] = useState(""); // Added state for description

  const moveItem = (itemId, categoryId) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, belongsTo: categoryId } : item
    );
    setItems(updatedItems);
  };

  const addCategory = () => {
    const newCategory = {
      id: categories.length + 1,
      name: `Category ${categories.length + 1}`,
    };
    setCategories([...categories, newCategory]);
  };

  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      name: `Item ${items.length + 1}`,
      belongsTo: null,
    };
    setItems([...items, newItem]);
  };

  const Item = ({ item }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "ITEM",
      item: { id: item.id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    return (
      <div
        ref={drag}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className="p-2 bg-gray-200 rounded border mb-2 cursor-pointer"
      >
        {item.name}
      </div>
    );
  };

  const Category = ({ category }) => {
    const [, drop] = useDrop(() => ({
      accept: "ITEM",
      drop: (draggedItem) => moveItem(draggedItem.id, category.name),
    }));

    const categoryItems = items.filter(
      (item) => item.belongsTo === category.name
    );

    return (
      <div ref={drop} className="p-4 border rounded mb-4">
        <input
          type="text"
          value={category.name}
          onChange={(e) =>
            setCategories(
              categories.map((cat) =>
                cat.id === category.id ? { ...cat, name: e.target.value } : cat
              )
            )
          }
          className="w-full p-1 border mb-2"
        />
        {categoryItems.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    );
  };

  const handleSave = async () => {
    if (!questionTitle  || categories.length === 0 || items.length === 0) {
      alert("Please complete all fields before submitting.");
      return;
    }
  
    const formData = {
      question: questionTitle,
      description: questionDescription,
      categories: categories.map((category)=>({
        id: category.id,
        name: category.name
      })),
      items: items.map((item) => ({
        item: item.name,
        belongsTo: item.belongsTo,
      })),
    };
  
    try {
      const response = await fetch("https://superassistant-backend-server.onrender.com/api/updateForm/675021db457e496639befc45", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert("Question 1 updated");

      } else {
        alert("Failed to save form data.");
      }
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };

 


  return (
    <Card style={{margin:"2rem"}}>
        <h1>Question 1</h1>
    <div>
      
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">Categorize Form Builder</h1>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter Question Title"
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
              className="w-full p-2 mb-2 border"
            />
            <textarea
              placeholder="Enter Question Description"
              value={questionDescription}
              onChange={(e) => setQuestionDescription(e.target.value)}
              className="w-full p-2 border"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="font-bold mb-2">Categories</h2>
              {categories.map((category) => (
                <Category key={category.id} category={category} />
              ))}
              <button
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                onClick={addCategory}
              >
                Add Category
              </button>
            </div>

            <div>
              <h2 className="font-bold mb-2">Items</h2>
              {items.map((item) => (
                <div key={item.id} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      setItems(
                        items.map((i) =>
                          i.id === item.id ? { ...i, name: e.target.value } : i
                        )
                      )
                    }
                    className="flex-grow p-1 border mr-2"
                  />
                  <select
                    value={item.belongsTo || ""}
                    onChange={(e) => moveItem(item.id, e.target.value)}
                    className="p-1 border"
                  >
                    <option value="">None</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <button
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                onClick={addItem}
              >
                Add Item
              </button>
            </div>
          </div>
        </div>

      <button
        onClick={handleSave}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        update changes
      </button>
    </div>
    </Card>
  );
};

export default CategorizeForm;
