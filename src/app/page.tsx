"use client"

import { useEffect, useState } from 'react';
import { Task } from './task'; // Interface de tasks as is in the backend with NestJS

const getDone = (tasks: Task[]) => {
  return tasks.filter(task => task.checked);
}

const getPending = (tasks: Task[]) => {
  return tasks.filter(task => !task.checked)
}

export default function TodoBox() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [idCounter, setIdCounter] = useState(0);
  const [progress, setProgress] = useState(0);
  const [filter, setFilter] = useState('all');
  
  const addTask = (taskText: string) => {
    const newTask = new Task(idCounter, taskText, false, 0); // supposed the same label for all
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setIdCounter(idCounter + 1);
  };

  const changeProgress = () => {
    const completedTasks = tasks.filter(task => task.checked).length;
    const totalTasks = tasks.length;
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    setProgress(percentage);
  };

  const statusChange = (taskId: number) => {
    setTasks((tasks) => 
      tasks.map((task) =>
        task.id === taskId ? { ...task, checked: !task.checked } : task
      )
    );
  };

  const filterTasks = () => {
    switch (filter) {
      case "pending":
        return getPending(tasks);
      case "done":
        return getDone(tasks);
      default:
        return tasks;
    }
  }

  const deleteDone = () => {
    setTasks(getPending(tasks));
  };

  useEffect(() => {
    changeProgress();
  }, [tasks]);
  
  // Main Component -> giver add task access to funtion
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-8/12 h-7/12 p-4">
        <h1 className="text-4xl">Todo!</h1>
        <div className="p-5 border-2 border-black rounded">
          <AddTask onAddTask={addTask} /> 
          <ProgressBar percentage={progress} />
          <ListTasks OnStatusChange={statusChange} tasks={filterTasks()}/>
          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-600"></hr>
          <OptionsLine tasks={tasks} filter={filter} OnFilterChange={setFilter} OnDeleteDone={deleteDone}/>
        </div>
      </div>
    </div>
  );
};

// New task input and button to create task
function AddTask({ onAddTask }: { onAddTask: (taskText: string) => void}) {
  console.log('chamei addTask');
  const [taskText, setTaskText] = useState('');

  const handleAdd = () => {
    if (taskText.trim() !== '') {
      onAddTask(taskText);
      setTaskText('');
    };
  };

  return (
    <div className="w-12/12 flex space-x-4 text-xl">
      <input onChange={(e) => setTaskText(e.target.value)} value={taskText} className="w-11/12 appearance-none border-2 border-black rounded" type="text" placeholder="Send the task boss..."/>
      <button onClick={handleAdd} className="w-1/12 appearance-none border-2 border-black rounded bg-black text-white">Add</button>
    </div>  
  );
}; 

// Progress bar to show how many tasks are left
function ProgressBar({percentage}: { percentage: number }) {
  console.log('entrou no progressBar', percentage);
  return (
    <>
      <div className="w-full mt-2 bg-gray-600 rounded-full h-1.5 mb-4 dark:bg-gray-200">
        <div style = {{width: `${percentage}%`}}
          className={` bg-gray-200 h-1.5 rounded-full dark:bg-gray-600`}></div>
      </div>
    </>
  );
};

// Layout of added task
function AddedTask({ task, OnStatusChange }: { OnStatusChange: (taskId: number) => void; task: Task}) {
  return (
    <div className="w-12/12 flex items-center space-x-2">
      <input onChange={(e) => OnStatusChange(task.id)} 
      type="checkbox" checked={task.checked} className="w-6 h-6 text-white-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-600 dark:focus:ring-gray-800 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
      <label className="text-xl font-medium text-black">{task.text}</label>
    </div>
  );
};

// All Tasks
function ListTasks({ tasks, OnStatusChange }: { OnStatusChange: (taskId: number) => void; tasks: Task[]}) {
  const listTasks = tasks.map(task => 
    <AddedTask key={task.id} OnStatusChange={OnStatusChange} task={task} />
  );
  return (
    <>
      {listTasks}
    </>
  );
};

function OptionsLine({ tasks, filter, OnFilterChange, OnDeleteDone }: { tasks: Task[]; filter: string; OnFilterChange: (filter: string) => void; OnDeleteDone: () => void}) {
  

  return (
    <div className="w-12/12 flex items-center justify-center space-x-12">
      <p>Tasks pending: {getPending(tasks).length}</p>
      <button onClick={() => OnFilterChange("all")} className={`${
        filter === "all" ? 'border-b-2 border-black' : ''
      }`}>All</button>
      <button onClick={() => OnFilterChange("pending")} className={`${
        filter === "pending" ? 'border-b-2 border-black' : ''
      }`}>Pending</button>
      <button onClick={() => OnFilterChange("done")} className={`${
        filter === "done" ? 'border-b-2 border-black' : ''
      }`}>Done</button>
      <button onClick={() => OnDeleteDone()} className="px-4 cursor-pointer border-2 border-black rounded">Clean Completed</button>
  </div>
  );
};