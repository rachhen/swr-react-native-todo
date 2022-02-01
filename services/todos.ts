import { Fetcher } from "swr";
import { Todo } from "../types";
import { MyError } from "../utils/errors";

const baseUrl = "http://localhost:3000";

export const getTodos: Fetcher<Todo[], string> = async (path) => {
  const res = await fetch(`${baseUrl}${path}`);

  if (!res.ok) {
    const error = new MyError("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const createTodo = async (body: Omit<Todo, "id">) => {
  const res = await fetch(`${baseUrl}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = new MyError("An error occurred while creating todo.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const updateTodo = async (
  id: string,
  data: Partial<Omit<Todo, "id">>
): Promise<Todo> => {
  const res = await fetch(`${baseUrl}/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = new MyError("An error occurred while updating todo.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const deleteTodo = async (id: string) => {
  const res = await fetch(`${baseUrl}/todos/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = new MyError("An error occurred while deleting todo.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};
