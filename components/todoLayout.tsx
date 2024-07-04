'use client';

import { connectWS } from '@/network/websocket';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { CreateTodoButton } from './createTodoButton';
import { FilterButton } from './filterButton';
import { SortButton } from './sortButton';
import { TodoList } from './todoList';
import {
  Filter,
  Sort,
  SortBy,
  SortOrder,
  Status,
  TodoTask,
} from '@/models/todoTask';
import { getAllTodos } from '@/application/todoFeatures';

export function TodoLayout() {
  useEffect(() => {
    connectWS();
  }, []);

  const [filter, setFilter] = useState<Filter>({
    startDueDate: null,
    endDueDate: null,
    status: ['NotStarted', 'InProgress', 'Completed'],
  });

  const [sort, setSort] = useState<Sort>({
    sortBy: SortBy.Name,
    sortOrder: SortOrder.ASC,
  });

  const [todoTasks, setTodoTasks] = useState<TodoTask[]>([]);

  useEffect(() => {
    getAllTodos(filter, sort).then((todoTasks) => setTodoTasks(todoTasks));
  }, [filter, sort]);

  const addSorted = (newTodoTask: TodoTask) => {
    setTodoTasks((todoTasks) => {
      const index = todoTasks.findIndex((todoTask) => {
        switch (sort.sortBy) {
          case SortBy.Name: {
            if (sort.sortOrder === SortOrder.ASC) {
              return newTodoTask.name < todoTask.name;
            } else {
              return newTodoTask.name > todoTask.name;
            }
          }
          case SortBy.DueDate: {
            if (sort.sortOrder === SortOrder.ASC) {
              return newTodoTask.dueDate < todoTask.dueDate;
            } else {
              return newTodoTask.dueDate > todoTask.dueDate;
            }
          }
          case SortBy.Status: {
            if (sort.sortOrder === SortOrder.ASC) {
              return (
                getStatusSortOrder(newTodoTask.status) <
                getStatusSortOrder(todoTask.status)
              );
            } else {
              return (
                getStatusSortOrder(newTodoTask.status) >
                getStatusSortOrder(todoTask.status)
              );
            }
          }
        }
      });

      if (index !== -1) {
        return todoTasks.toSpliced(index, 0, newTodoTask);
      } else {
        return [...todoTasks, newTodoTask];
      }
    });
  };

  const deleteFromList = (todoTaskToDelete: TodoTask) => {
    setTodoTasks((todoTasks) => {
      const index = todoTasks.findIndex(
        (todoTask) => todoTask.id! === todoTaskToDelete.id!,
      );
      if (index !== -1) {
        return todoTasks.toSpliced(index, 1);
      }

      return todoTasks;
    });
  };

  const handleTodoCreated = (todoTask: TodoTask) => {
    if (todoTask.matchesFilter(filter)) {
      addSorted(todoTask);
    }
  };

  const handleTodoUpdated = (todoTask: TodoTask) => {
    deleteFromList(todoTask);
    if (todoTask.matchesFilter(filter)) {
      addSorted(todoTask);
    }
  };

  const handleTodoDeleted = (todoTask: TodoTask) => {
    deleteFromList(todoTask);
  };

  return (
    <Box
      sx={{
        flexBasis: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '48rem',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'end',
          marginBottom: '2rem'
        }}
      >
        <CreateTodoButton onTodoCreated={handleTodoCreated} />
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <FilterButton
          filter={filter}
          onFilterChange={(newFilter) => setFilter(newFilter)}
        />
        <SortButton sort={sort} onSortChange={(newSort) => setSort(newSort)} />
      </Box>

      <TodoList
        todoTasks={todoTasks}
        onTodoUpdated={handleTodoUpdated}
        onTodoDeleted={handleTodoDeleted}
      />
    </Box>
  );
}

function getStatusSortOrder(status: Status) {
  switch (status) {
    case 'NotStarted':
      return 0;
    case 'InProgress':
      return 1;
    case 'Completed':
      return 2;
  }
}
