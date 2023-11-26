"use client"

import { useState } from 'react';

export default function TodoBox() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-8/12 h-7/12 p-4">
        <h1 className="text-3xl">Todo!</h1>
        <div className="p-5 border-2 border-black rounded">
          <AddTask/>
          <ProgressBar/>
          <Task/>
          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-600"></hr>
        </div>
      </div>
    </div>
  );
};

function AddTask() {
  return (
    <div className="w-12/12 flex space-x-4">
      <input className="w-11/12 h-2/12 appearance-none border-2 border-black rounded" type="text" placeholder="Send the task boss..."/>
      <button className="w-1/12 h-2/12 appearance-none border-2 border-black rounded bg-black text-white">Add</button>
    </div>  
  );
};

function ProgressBar() {
  return (
    <>
      <div className="w-full mt-2 bg-gray-600 rounded-full h-1.5 mb-4 dark:bg-gray-200">
        <div className="w-6/12 bg-gray-200 h-1.5 rounded-full dark:bg-gray-600"></div>
      </div>
    </>
  );
};

function Task() {
  const [checked, setChecked] = useState(false);

  function handleClick() {
    setChecked(!checked);
  }

  return (
    <div className="w-12/12 flex items-center space-x-2">
      <input type="checkbox" value="" className="w-6 h-6 text-white-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-600 dark:focus:ring-gray-800 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
      <label className="text-xl font-medium text-black">Doing the task boss...</label>
    </div>
  );
};