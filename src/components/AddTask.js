import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
//import { Link } from 'react-router-dom/cjs/react-router-dom.min';
//import { useNavigate } from 'react-router-dom';
//import { useHistory } from 'react-router-dom';
const AddTask = ({ tasks, setTasks }) => {

    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [priority, setPriority] = useState('low');
    const [dueDate, setDueDate] = useState("");
    //const navigate = useNavigate();
    //const history = useHistory();
    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        setTasks(savedTasks);
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform validation
        if (taskName.trim() === '') {
            alert('Task name is required');
            return;
        }

        const newTask = {
            id: Math.floor(Math.random() * 1000), // Generate unique ID
            name: taskName,
            description: taskDescription,
            priority,
            duedate: dueDate,
            completed: false,
        };
        const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = [...existingTasks, newTask];
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));

        setTasks(updatedTasks);
        // reset form fields
        setTaskName('');
        setTaskDescription('');
        setDueDate('');
        setPriority('low');
    };
    //useEffect(() => { }, [setTasks]);
    return (
        <div className='text-center container form-container shadow'>
            <h1 className='heading text-center'>Add Task</h1>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Title:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Task name"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Priority:</label>
                            <select
                                className="form-control"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Description:</label>
                            <textarea
                                className="form-control"
                                placeholder="Task description"
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Due Date:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <button type="submit" className="btn btn-primary mt-3">
                            Add Task
                        </button>
                        <Link to='/'>
                            <button type="submit" className="btn btn-primary mt-3 home-btn">
                                Your Todos
                            </button>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddTask;