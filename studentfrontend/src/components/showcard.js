import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button } from '@mui/material';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD'
};

// Card component that can be dragged
const DraggableCard = ({ card, moveCard, onEdit }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'CARD',
        item: { card },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));
    const role = localStorage.getItem('role'); // Check the role from localStorage
    //console.log(role)

    return (
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <Card sx={{ minWidth: 275, margin: '20px' }}>
                <CardContent>
                    <h2>{card.task}</h2>
                    <p> Description: {card.description}</p>
                    <p>Start Date: {formatDate(card.startdate)}</p>
                    <p>End Date: {formatDate(card.enddate)}</p>
                    {/* <p>Status: {card.status}</p> */}
                    
                    {/* Flex container for buttons */}
                    {role === 'admin' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            <Tooltip title="Edit" arrow>
                            <Button
                                variant="text"
                                startIcon={<EditIcon />}
                                onClick={() => onEdit(card.id)}  // Use onEdit for navigation
                                sx={{
                                    backgroundColor: 'transparent',
                                    color: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                    },
                                }}
                            >
                                
                            </Button>
                            </Tooltip>
                            <Tooltip title="Delete" arrow>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: 'red',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'darkred',
                                            boxShadow: 3,  // Add shadow on hover for emphasis
                                            transform: 'scale(1.05',  // Slightly enlarge the button
                                        },
                                        transition: 'background-color 0.3s, transform 0.3s',  // Smooth transition for the effects
                                    }}
                                    startIcon={<DeleteIcon />}
                                    onClick={() => deleteCard(card.id)}
                                >
                                </Button>
                            </Tooltip>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

// Column component that accepts dropped cards
const StatusColumn = ({ status, cards, moveCard, onEdit }) => {
    const role = localStorage.getItem('role'); // Check the role from localStorage

    const [{ isOver }, drop] = useDrop({
        accept: 'CARD',
        drop: (item) => {
            if (role === 'admin') {
                moveCard(item.card, status); // Only allow move if the role is 'admin'
            } else {
                console.log('Only admins can move cards.');
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div
            ref={drop}
            style={{
                flex: 1,
                margin: '10px',
                backgroundColor: isOver ? 'lightgreen' : 'white',
                minHeight: '300px', // Set a minimum height for the column
            }}
        >
            <h3 style={{ textAlign: 'center' }}>{status.toUpperCase()}</h3>
            {cards.length > 0 ? (
                cards.map((card) => (
                    <DraggableCard key={card.id} card={card} moveCard={moveCard} onEdit={onEdit} />
                ))
            ) : (
                <p>No tasks in this status.</p> // Empty message or placeholder
            )}
        </div>
    );
};

const CardColumns = () => {
    const [cards, setCards] = useState([]);
    const navigate = useNavigate(); // Hook for navigation
    const apiURL = 'http://localhost:8080/board/getall'; // Replace with your API URL
    const apiURL1 = 'http://localhost:8080/board/update';

    // Define the 3 different statuses explicitly
    const statuses = ['To Do', 'In Progress', 'Done'];

    // Fetch data from API when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(apiURL);
                const data = await response.json(); // Parse JSON from response
                setCards(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Function to move a card to a new column (status)
    const moveCard = async (card, newStatus) => {
        const updatedCard = { ...card, status: newStatus };

        // Optimistically update the state
        setCards((prevCards) =>
            prevCards.map((c) => (c.id === card.id ? updatedCard : c))
        );

        // Send the updated status to the backend
        try {
            await axios.put(`${apiURL1}/${card.id}`, {
                task: card.task,
                description: card.description,
                startdate: card.startdate,
                enddate: card.enddate,
                status: newStatus,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Status updated successfully!');
        } catch (error) {
            console.error('Error updating status:', error);

            // Revert the change if there's an error
            setCards((prevCards) =>
                prevCards.map((c) => (c.id === card.id ? card : c))
            );
        }
    };

    // Edit card function that navigates to the edit form
    const EditCard = (id) => {
        navigate(`/edit/${id}`); // Navigate to the edit form with the card ID
    };

    // Group the cards by status
    const groupedCards = cards.reduce((acc, card) => {
        if (!acc[card.status]) {
            acc[card.status] = [];
        }
        acc[card.status].push(card);
        return acc;
    }, {});

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ display: 'flex' }}>
                {statuses.map((status) => (
                    <StatusColumn
                        key={status}
                        status={status}
                        cards={groupedCards[status] || []} // Ensure we pass an empty array if no cards are present for this status
                        moveCard={moveCard}
                        onEdit={EditCard} // Pass EditCard function to StatusColumn
                    />
                ))}
            </div>
        </DndProvider>
    );
};

const deleteCard = async (id) => {
    const apiURLDelete = "http://localhost:8080/board/delete";

    // Send the delete request to the backend
    try {
        await axios.delete(`${apiURLDelete}/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Card deleted successfully!');
    } catch (error) {
        console.error('Error deleting card:', error);
    }
    window.location.reload();
};

export default CardColumns;
