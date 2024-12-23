"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import { CirclePicker } from 'react-color';
import { Task } from '@/app/models';
export default function CreateTaskPage() {
    const [taskTitle, setTaskTitle] = useState('');
    const [color, setColor] = useState('');
    const [buttonText, setButtonText] = useState('Add Task');
    const router = useRouter();
    const colorsList = ["#f44336", "#ff9800", "#ffc107", "#4caf50", "#2196f3", "#673ab7", "#9c27b0", "#795548"]

    const handleSubmission = async () => {
        const payload: Task = {
            title: taskTitle,
            color: color
        } as Task;
        const response = await fetch("http://localhost:3200/tasks", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (response.status == 200) {
            setButtonText('Task created');
            router.push('/');
        }
    }

    return (
        <div className="container justify-items-center">
            <div className="w-3/5 py-5 m-3 justify-center">
                <label htmlFor='title' className="text-sky-600 text-sm font-extrabold text-gray-700">
                    Title
                </label><br></br>
                <input
                    id='title'
                    className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                /><br></br>
                <label htmlFor='color' className="text-sky-600 block text-sm font-extrabold text-gray-700">
                    Color
                </label>
                <CirclePicker width='380px' color={color} colors={colorsList} onChangeComplete={(e) => {
                    setColor(e.hex)
                }} /><br></br>
            </div>
            <div className="container justify-items-center">
                <button className="flex bg-sky-500 w-3/5  py-2 h-10 justify-center rounded-lg text-white" onClick={handleSubmission}>{buttonText}<svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" fill="white" className="bi bi-plus-circle ps-1" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg></button>
            </div>
        </div>
    );
}
