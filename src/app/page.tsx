"use client"

import { useEffect, useState } from 'react';
import { Task } from './task'; // Interface de tasks as is in the backend with NestJS

export default function TodoBox() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [idCounter, setIdCounter] = useState(0);
  const [progress, setProgress] = useState(0);
  
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

  const getDone = () => {
    return tasks.filter(task => task.checked);
  }

  const getPending = () => {
    return tasks.filter(task => !task.checked)
  }

  const deleteDone = () => {
    setTasks(getPending);
  };

  useEffect(() => {
    changeProgress();
  }, [tasks]);
  
  // Main Component -> giver add task access to funtion
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-8/12 h-7/12 p-4">
        <h1 className="text-3xl">Todo!</h1>
        <div className="p-5 border-2 border-black rounded">
          <AddTask onAddTask={addTask} /> 
          <ProgressBar percentage={progress} />
          <ListTasks OnStatusChange={statusChange} tasks={tasks}/>
          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-600"></hr>
          <OptionsLine onDeleteDone={deleteDone}/>
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
    <div className="w-12/12 flex space-x-4">
      <input onChange={(e) => setTaskText(e.target.value)} value={taskText} className="w-11/12 h-2/12 appearance-none border-2 border-black rounded" type="text" placeholder="Send the task boss..."/>
      <button onClick={handleAdd} className="w-1/12 h-2/12 appearance-none border-2 border-black rounded bg-black text-white">Add</button>
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

function OptionsLine({ onDeleteDone }: { onDeleteDone: () => void}) {
  

  return (
    <div className="w-12/12 flex items-center justify-center space-x-12">
      <p>5 Tasks Pending</p>
      <div className="space-x-3">
        <a href="">All</a>
        <a href="">Pending</a>
        <a href="">Done</a>
      </div>
      <a onClick={(e) => onDeleteDone()} className="px-4 cursor-pointer border-2 border-black rounded">Clean Completed</a>
  </div>
  );
};