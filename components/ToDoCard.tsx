"use client";
import React, { useEffect, useState } from "react";
import { Todo, TypedColumn } from "@/typing";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useBoardStore } from "@/store/BoarsStore";
import getUrl from "@/lib/getUrl";
import Image from "next/image";
interface Iprops {
  id: TypedColumn;
  todo: Todo;
  index: number;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

const ToDoCard = ({
  id,
  todo,
  index,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Iprops) => {
  const [deleteTask] = useBoardStore((state) => [state.deleteTask]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getUrl(todo.image!);
        if (url) {
          setImageUrl(url.toString());
        }
      };
      fetchImage();
    }
  }, [todo]);
  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md "
      {...dragHandleProps}
      {...draggableProps}
      ref={innerRef}
    >
      <div className="flex justify-between items-center p-5 ">
        <p>{todo.title}</p>
        <button
          className="text-red-500 hover:text-red-600 "
          onClick={() => deleteTask(index, todo, id)}
        >
          <XCircleIcon className="ml-5 h-8 w-8 " />
        </button>
      </div>
      {imageUrl && (
        <div className="relative h-full w-full rounded-b-md ">
          <Image
            src={imageUrl}
            alt="image"
            width={400}
            height={200}
            className=" object-fit rounded-b-md w-[400px] h-[200px] "
          />
        </div>
      )}
    </div>
  );
};

export default ToDoCard;
