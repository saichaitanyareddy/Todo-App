"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Task } from "@/app/models";

export default function HomePage() {
    const [isSelected, setIsSelected] = useState([] as string[]);
    const [tasks, setTasks] = useState([] as Task[]);
    const router = useRouter();
    const handleCompletion = async (item: Task, index: number) => {
        let payload: Task = {} as Task;
        if (isSelected.includes(item.id)) {
            payload = { ...item, status: '' }
            const selectedIndex = isSelected.findIndex((x: string) => x == item.id);
            isSelected.splice(selectedIndex, 1);
            setIsSelected([...isSelected]);
        } else if (item.status == "completed") {
            payload = { ...item, status: '' }
        }
        else {
            setIsSelected([...isSelected, item.id]);
            payload = { ...item, status: 'completed' }
        }
        const modifiedTasks: Task[] = [...tasks];
        modifiedTasks[index] = payload;
        setTasks(modifiedTasks);
        const response = await fetch(`http://localhost:3200/tasks/${item.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
    }

    useEffect(() => {
        fetch('http://localhost:3200/tasks')
            .then(response => response.json())
            .then(data => setTasks(data))
            .catch(error => console.error(error));
    }, []);

    const navigateToEdit = (item: Task) => {
        const queryData = {
            itemId: item.id,
            itemTitle: item.title,
            itemColor: item.color
        }
        const queryString = new URLSearchParams(queryData).toString();
        router.push(`/edit-task?${queryString}`)
    }

    const deleteItem = async (id: string, index: number) => {
        if (confirm("Are you sure you want to delete this item?")) {
            const response = await fetch(`http://localhost:3200/tasks/${id}`, {
                method: 'DELETE'
            });
            if (response.status == 200) {
                const modifiedTasks: Task[] = [...tasks];
                modifiedTasks.splice(index, 1);
                setTasks(modifiedTasks);
            }
        }
    }

    return (
        <div className="container justify-items-center">
            <div className="container justify-items-center">
                <button className="flex w-2/3 min-w-48 bg-sky-500 py-2 h-10 justify-center rounded-lg text-white" onClick={() => router.push('/create-task')}>Create Task <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" fill="white" className="bi bi-plus-circle ps-1" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg></button>
            </div>
            <br />
            <hr></hr>
            <div className="w-2/3 min-w-96">
                <p className="inline-block text-sky-600 font-extrabold">Tasks: <span className="bg-slate-600 rounded px-1">{tasks.length}</span></p>
                <p className="float-right text-sky-600 font-extrabold">Completed:  <span className="bg-slate-600 rounded px-1">{tasks.length > 0 ? (<>{tasks.filter((x: any) => x.status == 'completed').length} of {tasks.length}</>) : <>0</>}</span></p>
            </div>
            {tasks.length > 0 ? tasks.sort((a: Task, b: Task) => {
                if (a.status == null || b.status == null) {
                    return 0;
                }
                return a.status.localeCompare(b.status)
            }).map((item: Task, index: number) => (
                <div key={index} className="py-1 w-2/3">
                    <Card style={{ backgroundColor: item.color }} className={` border rounded py-5 ps-3`}>
                        <CardBody className="flex">
                            <input type="checkbox" className="rounded-full" checked={item.status == 'completed' || isSelected.includes(item.id)} onChange={() => handleCompletion(item, index)} />
                            <p className="px-3" style={{ textDecoration: item.status || isSelected.includes(item.id) ? 'line-through' : 'none' }}>{item.title}</p>
                            <div className="flex ml-auto">
                                <p className="ml-auto pr-2" onClick={() => navigateToEdit(item)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                                </svg></p>
                                <p className="ml-auto pr-2" onClick={() => deleteItem(item.id, index)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                </svg></p>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )) : (<div className="text-center py-24">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="45" className="bi bi-clipboard fill-[#fbfbfb8a] justify-self-center" viewBox="0 0 16 16">
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
                </svg>
                <p className="font-extrabold text-[#fbfbfb8a]">You don't have any tasks registered yet.</p>
                <p className="font-large text-[#fbfbfb8a]">Create tasks and organize your todo items.</p>
            </div>)}
        </div>
    );
}
