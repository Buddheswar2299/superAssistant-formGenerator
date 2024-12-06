import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { FaPlus, FaCopy, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const Comprehension = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "According to the passage, one key feature of the water cycle is that:",
      options: [
        "Water evaporates from the surface into the atmosphere.",
        "Water only exists in liquid form.",
        "Water moves from the surface to deep underground.",
        "Water remains in the clouds forever."
      ],
      selectedOption: null
    }
  ]);
  const [passage, setPassage] = useState('');

  const handleAddQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      question: "New Question",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      selectedOption: null
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleCopyQuestion = (id) => {
    const questionToCopy = questions.find((q) => q.id === id);
    const copiedQuestion = { ...questionToCopy, id: questions.length + 1 };
    setQuestions([...questions, copiedQuestion]);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleOptionChange = (questionId, option) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, selectedOption: option } : q
      )
    );
  };

  const handleSaveToDatabase = async () => {
    try {
      const response = await axios.put('https://superassistant-backend-server2.onrender.com/api/comprehensionfillForm/6751a0f3c59dbb63149f475d', {
        passage,
        questions,
      });
    //   alert(response.data.message);
      alert('Question 3 Updated')
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data to the database.');
    }
  };

  return (
    <Card style={{ margin: '2rem' }}>
        <h2>Question 3</h2>
      <Card style={{ margin: '2rem' }}>
        <textarea
          placeholder="Enter passage here"
          onChange={(e) => setPassage(e.currentTarget.value)}
          value={passage}
          style={{
            backgroundColor: 'whitesmoke',
            width: "100%",
            padding: "1rem",
            resize: "none",
            outline: 'none',
          }}
        />
      </Card>

      <Container style={{ padding: "2rem" }}>
        {questions.map((question) => (
          <Card key={question.id} style={{ marginBottom: "1rem", padding: "1rem" }}>
            <Row className="align-items-center">
              <Col xs={10}>
                <h5>{`Question 3. ${question.id}`}</h5>
                <p>{question.question}</p>
                <Form>
                  {question.options.map((option, index) => (
                    <Form.Check
                      key={index}
                      type="radio"
                      id={`question-${question.id}-option-${index}`}
                      name={`question-${question.id}`}
                      label={option}
                      checked={question.selectedOption === option}
                      onChange={() => handleOptionChange(question.id, option)}
                    />
                  ))}
                </Form>
              </Col>
              <Col xs={2} className="text-end">
                <Button
                  variant="link"
                  onClick={handleAddQuestion}
                  title="Add New Question"
                >
                  <FaPlus />
                </Button>
                <Button
                  variant="link"
                  onClick={() => handleCopyQuestion(question.id)}
                  title="Copy Question"
                >
                  <FaCopy />
                </Button>
                <Button
                  variant="link"
                  onClick={() => handleDeleteQuestion(question.id)}
                  title="Delete Question"
                >
                  <FaTrash />
                </Button>
              </Col>
            </Row>
          </Card>
        ))}
        <Button variant="primary" onClick={handleSaveToDatabase}>
          udpate changes
        </Button>
      </Container>
    </Card>
  );
};

export default Comprehension;
