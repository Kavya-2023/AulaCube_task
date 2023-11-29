import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TodoList from './components/TodoList';
import AddTask from './components/AddTask';
import "./App.css";
const App = () => {
  const [tasks, setTasks] = useState([]);
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <TodoList tasks={tasks} setTasks={setTasks} />
        </Route>
        <Route path="/add-task">
          <AddTask tasks={tasks} setTasks={setTasks} />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;