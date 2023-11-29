import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import "../App.css";
const TodoList = ({ tasks, setTasks }) => {
    const [editedTask, setEditedTask] = useState(null);
    const [pageSize, setPageSize] = useState(4);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(Math.ceil(tasks.length / pageSize));
    const [records, setRecords] = useState([]);
    const [cardColors, setCardColors] = useState([]);
    const [sortedRecords, setSortedRecords] = useState([]);
    const onPageChange = (index) => {
        if (index >= 0 && index < pageCount) {
            setCurrentPage(index);
            handleSortByPriority('asc');
        }
    }
    //const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    useEffect(() => {
        let savedTodos = JSON.parse(localStorage.getItem('tasks'));

        if (Array.isArray(savedTodos)) {

            setTasks(savedTodos);

            const calculatedPageCount = Math.ceil(savedTodos.length / pageSize);
            setPageCount(calculatedPageCount);

            const startIndex = currentPage * pageSize;
            const endIndex = startIndex + pageSize;

            const paginatedTasks = savedTodos.slice(startIndex, endIndex);
            setRecords(paginatedTasks);
            let colors = localStorage.getItem('cardColors');
            if (!colors || JSON.parse(colors).length !== paginatedTasks.length) {
                colors = paginatedTasks.map(() => getRandomColor());
                localStorage.setItem('cardColors', JSON.stringify(colors));
            } else {
                colors = JSON.parse(colors);
            }
            setCardColors(colors);

            const sortedPaginatedTasks = [...paginatedTasks];
            sortedPaginatedTasks.sort((taskA, taskB) => {
                const priorityA = priorityValues[taskA.priority];
                const priorityB = priorityValues[taskB.priority];
                return priorityA - priorityB;
            });

            setRecords(paginatedTasks);
            setSortedRecords(sortedPaginatedTasks);
        }
    }, [tasks, setTasks, pageSize, currentPage]);
    const getRandomColor = () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };


    const handleSetEditTask = (task) => {
        setEditedTask(task);
    };

    const handleEdit = () => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === editedTask.id) {
                return editedTask;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
        setEditedTask(null);
    };
    const handleDelete = (id) => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
    };
    const handleComplete = (id) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
    };
    const priorityValues = {
        low: 1,
        medium: 2,
        high: 3
    };
    const handleSortByPriority = (order) => {
        const sortedTasks = [...records];

        sortedTasks.sort((taskA, taskB) => {
            const priorityA = priorityValues[taskA.priority];
            const priorityB = priorityValues[taskB.priority];

            if (order === 'desc') {
                return priorityB - priorityA;
            } else {
                return priorityA - priorityB;
            }
        });

        setSortedRecords([...sortedTasks]);
    };

    return (
        <div className="todo-container">
            <div className="top-container text-center">
                <h1 className="heading">Todo List</h1>
                <Link to="/add-task">
                    <button className="btn btn-primary">create task</button>
                </Link>
                {editedTask && (
                    <form onSubmit={handleEdit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Title:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Task name"
                                        value={editedTask.name}
                                        onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Priority:</label>
                                    <select
                                        className="form-control"
                                        value={editedTask.priority}
                                        onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
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
                                        value={editedTask.description}
                                        onChange={(e) => setEditedTask(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Due Date:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={editedTask.duedate}
                                        onChange={(e) => setEditedTask(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <button type="submit" className="btn btn-primary mt-3">
                                    save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                )}
                <div className="mt-3">
                    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0} className="btn btn-outline-primary">Prev</button>
                    {Array(pageCount).fill(null).map((_, index) => (
                        <button key={index} onClick={() => onPageChange(index)} className={`${currentPage === index ? 'active-btn' : ''} btn btn-outline-primary`}>
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === pageCount - 1} className="btn btn-outline-primary">Next</button>
                </div>
            </div>
            <div className="bottom-container m-5 p-2">
                <span className="bottom-heading">Task List:</span>
                <button className="btn btn-outline-primary btns m-1" onClick={() => handleSortByPriority('asc')} data-toggle="tooltip"
                    title="Sort by Priority (Ascending)">
                    <FontAwesomeIcon icon={faArrowUp} />
                </button>
                <button className="btn btn-outline-primary btns m-1" onClick={() => handleSortByPriority('desc')} data-toggle="tooltip"
                    title="Sort by Priority (Descending)">
                    <FontAwesomeIcon icon={faArrowDown} />
                </button>
                <div className="row">
                    {sortedRecords.map((task, index) => (
                        <div className="col-md-4 mb-3" key={task.id}>
                            <div className="card card-container shadow" style={{ borderTop: `5px solid ${cardColors[index]}` }}>
                                <div className="card-body">
                                    <h5 className="card-title text-primary">{task.name}</h5>
                                    <p className="card-text text-secondary">Description: {task.description}</p>
                                    <p className="card-text text-secondary">Priority: {task.priority}</p>
                                    <p className="card-text text-secondary">Due Date: {task.duedate}</p>
                                    <p className="card-text text-secondary">
                                        Status: {task.completed ? 'Completed' : 'Not Completed'}
                                        <button className="btn btn-link p-0 ml-2" onClick={() => handleComplete(task.id)}>
                                            {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                                        </button>
                                    </p>
                                    <button className="btn btn-outline-danger" onClick={() => handleDelete(task.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                    <button className="btn btn-outline-primary btns" onClick={() => handleSetEditTask(task)}>
                                        <FontAwesomeIcon icon={faEdit} className="icon" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default TodoList;