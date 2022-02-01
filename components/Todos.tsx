import React, { useState } from "react";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../services/todos";
import TodoItem from "./TodoItem";
import { Todo } from "../types";
import Input from "./Input";

const LIMIT = 20;
const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.length) return null;
  return `/todos?_page=${pageIndex + 1}&_limit=${LIMIT}&_sort=id&_order=desc`;
};

const Todos = () => {
  const { data, error, size, isValidating, setSize, mutate } = useSWRInfinite(
    getKey,
    getTodos
  );
  const [title, setTitle] = useState("");
  const [addError, setAddError] = useState<string | null>(null);

  const handleAdd = async () => {
    setAddError(null);
    try {
      if (!title.trim()) return;
      const body = { title, completed: false };
      await createTodo(body);
      mutate();
      setTitle("");
    } catch (error: any) {
      console.log(error);
      setAddError(error.message);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      if (data) {
        const copyData = [...data];
        for (let i = 0; i < copyData.length; i++) {
          const index = copyData[i].findIndex((item) => item.id === todo.id);
          if (index) {
            copyData[i][index] = updatedTodo;
            break;
          }
        }
        mutate(copyData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      if (data) {
        const copyData = [...data];
        for (let i = 0; i < copyData.length; i++) {
          const index = copyData[i].findIndex((item) => item.id === id);
          if (index) {
            copyData[i].splice(index, 1);
            break;
          }
        }
        mutate(copyData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const todos = data ? ([] as Todo[]).concat(...data) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < LIMIT);
  const isRefreshing = isValidating && data && data.length === size;

  if (!data) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text style={{ color: "red" }}>{error.message}</Text>;
  }

  return (
    <View style={styles.listContainer}>
      <Input
        value={title}
        onAdd={handleAdd}
        onEndEditing={handleAdd}
        onChangeText={(text) => setTitle(text)}
      />
      <FlatList
        data={todos}
        contentContainerStyle={{ marginTop: 10 }}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onCompletePress={() => handleToggleTodo(item)}
            onDeletePress={() => handleDelete(item.id)}
          />
        )}
        onEndReachedThreshold={0.0004}
        onEndReached={() => {
          if (!isLoadingMore || !isReachingEnd) {
            setSize(size + 1);
          }
        }}
      />
    </View>
  );
};

export default Todos;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
});
