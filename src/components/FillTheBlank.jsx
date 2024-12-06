import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Form, Container } from 'react-bootstrap';
import {  useDrag, useDrop } from "react-dnd";
import axios from "axios";

export default function FillTheBlank() {
    const [sentence, setSentence] = useState('I am a good boy');
    const [underlined, setUnderlined] = useState([]);

    const handleUnderline = (word, index, event) => {
        if (!underlined.includes(word)) {
            setUnderlined((prev) => [...prev, word]);
        }

        if (event.target.style.textDecoration === 'underline') {
            event.target.style.textDecoration = 'none';
            setUnderlined((prev) => prev.filter((w) => w !== word));
        } else {
            event.target.style.textDecoration = 'underline';
            const splittedSentence = sentence.split(' ');
            splittedSentence[index] = '___';
            const joinedSentence = splittedSentence.join(' ');
            setSentence(joinedSentence);
        }
    };

    useEffect(() => {
        if (sentence.trim() === '') {
            setUnderlined([]);
        }
    }, [sentence]);
    useEffect(()=>{
        console.log(underlined)
    },[underlined])

    const moveUnderlinedItem = (dragIndex, hoverIndex) => {
        const updatedUnderlined = [...underlined];
        const [draggedItem] = updatedUnderlined.splice(dragIndex, 1);
        updatedUnderlined.splice(hoverIndex, 0, draggedItem);
        setUnderlined(updatedUnderlined);
    };

    const DraggableItem = ({ word, index }) => {
        const [{ isDragging }, dragRef] = useDrag({
            type: "UNDERLINED_ITEM",
            item: { index },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });

        const [, dropRef] = useDrop({
            accept: "UNDERLINED_ITEM",
            hover: (item) => {
                if (item.index !== index) {
                    moveUnderlinedItem(item.index, index);
                    item.index = index;
                }
            },
        });   

        return (
            <Card
                ref={(node) => dragRef(dropRef(node))}
                style={{
                    width: "6rem",
                    textAlign: "center",
                    opacity: isDragging ? 0.5 : 1,
                    marginBottom: "0.5rem",
                    cursor: "move",
                }}
            >
                {word}
            </Card>
        );
    };
//http://localhost:2021/api/fillForm
    const handleSave = async () => {
        try {
            const response = await axios.put('https://superassistant-backend-server1.onrender.com/api/updatefillForm/6751644252c34f067160ab1c', {
                sentence,
                underlined,
            });
            alert('Question 2 Updated')
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }; 

    return (
        
            <div style={{ padding: "2rem" }}>
                <h1>Question 2</h1>
                <Card style={{ padding: "1rem" }}>
                    <Form>
                        <Container style={{ marginBottom: "12px" }}>
                            <p>Make the Blanks Here</p>
                            {sentence.split(' ').map((word, index) => (
                                <span style={{ backgroundColor: "aliceblue", padding: "6px" }} key={index}>
                                    <span
                                        value={word}
                                        onClick={(event) => handleUnderline(word, index, event)}
                                        style={{ cursor: "pointer", marginRight: '5px' }}
                                    >
                                        {word}
                                    </span>
                                </span>
                            ))}
                        </Container>
                        <Container>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Sentence</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={sentence}
                                    style={{ background: "whitesmoke", outline: "none", boxShadow: 'none', border: "none" }}
                                    onChange={(e) => setSentence(e.currentTarget.value)}
                                />
                            </Form.Group>
                        </Container>
                    </Form>

                    <Container>
                        {underlined.map((word, index) => (
                            <div key={index}>
                            <DraggableItem  word={word} index={index} />
                            <button onClick={()=>setUnderlined((prev)=> [...prev.filter((w)=> w!== word)])} style={{color:'red'}} >Remove</button>
                            </div>
                        ))}
                    </Container>
                    <Button onClick={handleSave} variant="primary" style={{ marginTop: "20px" ,width:"12%"}}>
                    update changes
                </Button>
                </Card>
            </div>

    );
}
