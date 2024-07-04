'use client';

import { Status, TodoTask } from '@/models/todoTask';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

export function TodoDialog({
  todoTask,
  onClose,
  onSubmit,
  onDelete,
}: {
  todoTask: TodoTask | null;
  onClose: () => void;
  onSubmit: (todoTask: TodoTask) => void;
  onDelete: (todoTask: TodoTask) => void;
}) {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<Dayjs>(dayjs());
  const [status, setStatus] = useState<Status>('NotStarted');

  useEffect(() => {
    if (todoTask) {
      setName(todoTask.name);
      setDescription(todoTask.description);
      setDueDate(dayjs(todoTask.dueDate));
      setStatus(todoTask.status);
    }
  }, [todoTask]);

  const onNameFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onDescriptionFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  return (
    <Dialog
      open={todoTask !== null}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();

          onSubmit(
            new TodoTask(
              name,
              description,
              dueDate.toDate(),
              status,
              todoTask?.id,
            ),
          );
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <DialogTitle>Todo task</DialogTitle>
        {todoTask && todoTask.id && (
          <IconButton onClick={() => onDelete(todoTask!)} sx={{width: '64px', height: '64px'}}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          label="Task name"
          type="text"
          fullWidth
          variant="standard"
          inputProps={{ maxLength: 30 }}
          value={name}
          onChange={onNameFieldChange}
        />
        <TextField
          required
          margin="dense"
          label="Task description"
          type="text"
          fullWidth
          multiline
          variant="standard"
          value={description}
          onChange={onDescriptionFieldChange}
        />
        <FormControl fullWidth sx={{ marginY: '1rem' }}>
          Due date:
          <DatePicker
            value={dueDate}
            onChange={(newDueDate) => {
              setDueDate(newDueDate!);
            }}
          />
        </FormControl>
        <FormControl fullWidth sx={{ marginY: '1rem' }}>
          <InputLabel id="select-status">Status</InputLabel>
          <Select
            labelId="select-status"
            id="select-status"
            value={status}
            label="Age"
            onChange={(status) => setStatus(status.target.value as Status)}
          >
            <MenuItem value={'NotStarted'}>Not started</MenuItem>
            <MenuItem value={'InProgress'}>In Progress</MenuItem>
            <MenuItem value={'Completed'}>Completed</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
