import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSWRConfig } from "swr";
import { deleteTodo, updateTodo } from "../services/todos";
import { Todo } from "../types";

type TodoItemProps = {
  todo: Todo;
  onCompletePress?: () => void;
  onDeletePress?: () => void;
};

const TodoItem = ({ todo, onCompletePress, onDeletePress }: TodoItemProps) => {
  const { mutate } = useSWRConfig();

  const handleToggleTodo = useCallback(async () => {
    try {
      mutate("/todos", async (cacheTodos: Todo[]) => {
        const updatedTodo = await updateTodo(todo.id, {
          completed: !todo.completed,
        });
        const filteredTodos = cacheTodos.filter((item) => item.id !== todo.id);
        return [...filteredTodos, updatedTodo];
      });
    } catch (error) {
      console.log(error);
    }
  }, [todo]);

  const handleDelete = useCallback(() => {
    try {
      mutate("/todos", async (cacheTodos: Todo[]) => {
        await deleteTodo(todo.id);
        return cacheTodos.filter((item) => item.id !== todo.id);
      });
    } catch (error) {
      console.log(error);
    }
  }, [todo]);

  return (
    <View style={styles.list}>
      <Text
        style={[styles.listText, todo.completed ? { fontStyle: "italic" } : {}]}
      >
        {todo.title}
      </Text>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={onCompletePress}>
          <Text style={styles.completeBtnText}>
            {todo.completed ? "Completed" : "Complete"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={onDeletePress}>
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TodoItem;

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomColor: "#eaeaea",
    borderBottomWidth: 1,
  },
  listText: {
    flex: 1,
  },
  btnContainer: {
    flexDirection: "row",
  },
  completeBtnText: {
    color: "blue",
  },
  btn: {
    marginLeft: 5,
  },
  deleteBtnText: {
    color: "red",
  },
});
