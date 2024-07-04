'use client';

import {
  deleteTodo,
  getAllTodos,
  updateTodo,
} from '@/application/todoFeatures';
import { Status, TodoTask } from '@/models/todoTask';
import {
  Box,
  ButtonBase,
  Card,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { TodoDialog } from './todoDialog';

function TodoListRow({
  todoTask,
  onClick,
}: {
  todoTask: TodoTask;
  onClick: () => void;
}) {
  return (
    <Card key={todoTask.id} sx={{ width: '100%', marginY: '1rem' }}>
      <ButtonBase
        sx={{ width: '100%', textAlign: 'initial' }}
        onClick={() => onClick()}
      >
        <CardContent sx={{width: '100%'}}>
          <Typography variant="h5" gutterBottom>
            {todoTask.name}
          </Typography>
          <Typography variant="body1">{todoTask.description}</Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body1">
              Due: {todoTask.dueDate.toLocaleString('en')}
            </Typography>
            <Chip variant="outlined" label={toDisplayString(todoTask.status)} />
          </Box>
        </CardContent>
      </ButtonBase>
    </Card>
  );
}

export function TodoList({
  todoTasks,
  onTodoUpdated,
  onTodoDeleted,
}: {
  todoTasks: TodoTask[];
  onTodoUpdated: (todoTask: TodoTask) => void;
  onTodoDeleted: (todoTask: TodoTask) => void;
}) {
  const [editingTodoTask, setEditingTodoTask] = useState<TodoTask | null>(null);

  const onCardClick = (todoTask: TodoTask) => {
    setEditingTodoTask(todoTask);
  };

  const onDeleteTodo = (todoTask: TodoTask) => {
    deleteTodo(todoTask).then(() => onTodoDeleted(todoTask));
    onDialogClose();
  };

  const onSubmitTodo = (todoTask: TodoTask) => {
    updateTodo(todoTask).then(() => onTodoUpdated(todoTask));
    onDialogClose();
  };

  const onDialogClose = () => {
    setEditingTodoTask(null);
  };

  return (
    <>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {todoTasks.map((todoTask) => {
          return (
            <TodoListRow
              key={todoTask.id}
              todoTask={todoTask}
              onClick={() => onCardClick(todoTask)}
            />
          );
        })}
      </Box>
      <TodoDialog
        todoTask={editingTodoTask}
        onClose={onDialogClose}
        onDelete={onDeleteTodo}
        onSubmit={onSubmitTodo}
      />
    </>
  );
}

function toDisplayString(status: Status) {
  switch (status) {
    case 'NotStarted':
      return 'Not started';
    case 'InProgress':
      return 'In progress';
    case 'Completed':
      return 'Completed';
  }
}
