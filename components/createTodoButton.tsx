'use client';

import { createTodo } from '@/application/todoFeatures';
import { TodoTask } from '@/models/todoTask';
import { Button } from '@mui/material';
import { useState } from 'react';
import { TodoDialog } from './todoDialog';

export function CreateTodoButton({
  onTodoCreated,
}: {
  onTodoCreated: (todoTask: TodoTask) => void;
}) {
  const [todoDraft, setTodoDraft] = useState<TodoTask | null>(null);

  const onDialogOpen = () => {
    setTodoDraft(new TodoTask('', '', new Date(), 'NotStarted'));
  };

  const handleClose = () => {
    setTodoDraft(null);
  };

  const handleSubmit = (todoTask: TodoTask) => {
    createTodo(
      todoTask.name,
      todoTask.description,
      todoTask.dueDate,
      todoTask.status,
    ).then((id) => {
      todoTask.id = id;
      onTodoCreated(todoTask);
    });
    handleClose();
  };

  return (
    <>
      <Button variant="contained" onClick={onDialogOpen}>
        + New Task
      </Button>
      <TodoDialog
        todoTask={todoDraft}
        onDelete={() => {}}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </>
  );
}
