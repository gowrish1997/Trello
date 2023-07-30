import { create } from "zustand";
import { TypedColumn, Column, Todo } from "@/typing";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumns";
import { Board } from "@/typing";
import { databases, storage, ID } from "@/appwrite";
import { Image } from "@/typing";
import uploadImage from "@/lib/uploadImage";
import { data } from "autoprefixer";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;
  newTaskInput: string;
  setNewTaskInput: (input: string) => void;
  newTaskType: TypedColumn;
  setNewTaskType: (columnId: TypedColumn) => void;
  image: File | null;
  setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },

  setBoardState: (board) => set({ board }),
  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASEID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTIONID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;
    if (image) {
      const fileUpload = await uploadImage(image);
      if (fileUpload) {
        file = {
          bucketId: fileUpload.bucketId,
          fileId: fileUpload.$id,
        };
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASEID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTIONID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );
    set({ newTaskInput: "" });
    set((state) => {
      const newColumns = new Map(state.board.columns);
      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      };
      const column = newColumns.get(columnId);
      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }
      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },
  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumn = new Map(get().board.columns);
    newColumn.get(id)?.todos.splice(taskIndex, 1);
    set({ board: { columns: newColumn } });

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASEID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTIONID!,
      todo.$id
    );
  },

  searchString: "",
  setSearchString: (searchString: string) => set({ searchString }),
  newTaskInput: "",
  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
  newTaskType: "todo",
  setNewTaskType: (tasktype: TypedColumn) => set({ newTaskType: tasktype }),
  image: null,
  setImage: (image: File | null) => set({ image: image }),
}));
