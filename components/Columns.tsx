"use client";
import { Todo, TypedColumn } from "@/typing";
import React, { useState } from "react";
import ToDoCard from "./ToDoCard";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useBoardStore } from "@/store/BoarsStore";
import Modal from "./Modal";
import { useModalStore } from "@/store/ModalStore";
interface Iprops {
  id: TypedColumn;
  todos: Todo[];
  index: number;
}

const idToColumnText = {
  todo: "TO Do",
  inprogress: "In Progress",
  done: "Done",
};

const Column = ({ id, todos, index }: Iprops) => {
  const openModal = useModalStore((state) => state.openModal);
  const [searchString, setNewTaskType] = useBoardStore((state) => [
    state.searchString,
    state.setNewTaskType,
  ]);
  const handleNewToDo = () => {
    setNewTaskType(id);
    openModal();
  };

  return (
    <>
      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Droppable droppableId={index.toString()} type="card">
              {(provided, snapshot) => {
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`p-2 rounded-2xl shadow-sm ${
                      snapshot.isDraggingOver ? "bg-green-200 " : "bg-white/50 "
                    } `}
                  >
                    <h2 className="flex justify-between font-bold text-xl p-2 ">
                      {idToColumnText[id]}
                      <span className="text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-sm font-normal">
                        {!searchString
                          ? todos.length
                          : todos.filter((todo) =>
                              todo.title
                                .toLowerCase()
                                .includes(searchString.toLocaleLowerCase())
                            ).length}
                      </span>
                    </h2>
                    <div className="space-y-2 ">
                      {todos.map((todo, index) => {
                        if (
                          searchString &&
                          !todo.title
                            .toLowerCase()
                            .includes(searchString.toLocaleLowerCase())
                        )
                          return null;
                        return (
                          <Draggable
                            key={todo.$id}
                            draggableId={todo.$id}
                            index={index}
                          >
                            {(provided) => {
                              return (
                                <ToDoCard
                                  todo={todo}
                                  index={index}
                                  id={id}
                                  innerRef={provided.innerRef}
                                  draggableProps={provided.draggableProps}
                                  dragHandleProps={provided.dragHandleProps}
                                ></ToDoCard>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                      <div className="flex items-end justify-end p-2 ">
                        <button
                          className="text-green-500 hover:text-green-600 "
                          onClick={() => handleNewToDo()}
                        >
                          <PlusCircleIcon className="h-10 w-10 " />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }}
            </Droppable>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default Column;
