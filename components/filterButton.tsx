import { Filter, Status } from '@/models/todoTask';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useState } from 'react';

export function FilterButton({
  filter,
  onFilterChange,
}: {
  filter: Filter;
  onFilterChange: (newFilter: Filter) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [editFilter, setEditFilter] = useState(filter);

  const toggleStatus = (
    event: React.ChangeEvent<HTMLInputElement>,
    toggledStatus: Status,
  ) => {
    if (event.target.checked) {
      setEditFilter({
        ...editFilter,
        status: [...editFilter.status, toggledStatus],
      });
    } else {
      setEditFilter({
        ...editFilter,
        status: editFilter.status.filter((status) => status !== toggledStatus),
      });
    }
  };

  const handleClose = () => setIsDialogOpen(false);

  return (
    <>
      <Button variant="outlined" onClick={() => setIsDialogOpen(true)}>
        Change filter
      </Button>
      <Dialog
        open={isDialogOpen}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            onFilterChange(editFilter);

            handleClose();
          },
        }}
      >
        <DialogTitle>New filter</DialogTitle>
        <DialogContent>
          <DialogContentText>Filter by due date:</DialogContentText>
          <FormControl fullWidth>
            From:
            <DatePicker
              slotProps={{ field: { clearable: true } }}
              value={
                editFilter.startDueDate ? dayjs(editFilter.startDueDate) : null
              }
              onChange={(day) => {
                if (day) {
                  const date = day.toDate();
                  date.setHours(0);
                  date.setMinutes(0);
                  date.setSeconds(0);
                  date.setMilliseconds(0);
                  setEditFilter({
                    ...editFilter,
                    startDueDate: date,
                  });
                } else {
                  setEditFilter({
                    ...editFilter,
                    startDueDate: null,
                  });
                }
              }}
            />
            To:
            <DatePicker
              slotProps={{ field: { clearable: true } }}
              value={
                editFilter.endDueDate ? dayjs(editFilter.endDueDate) : null
              }
              onChange={(day) => {
                if (day) {
                  const date = day.toDate();
                  date.setHours(23);
                  date.setMinutes(59);
                  date.setSeconds(59);
                  date.setMilliseconds(999);
                  setEditFilter({
                    ...editFilter,
                    endDueDate: date,
                  });
                } else {
                  setEditFilter({
                    ...editFilter,
                    endDueDate: null,
                  });
                }
              }}
            />
          </FormControl>

          <DialogContentText sx={{ marginTop: '1rem' }}>
            Filter by status:
          </DialogContentText>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={editFilter.status.includes('NotStarted')}
                  onChange={(event) => toggleStatus(event, 'NotStarted')}
                />
              }
              label="Not started"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={editFilter.status.includes('InProgress')}
                  onChange={(event) => toggleStatus(event, 'InProgress')}
                />
              }
              label="In Progress"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={editFilter.status.includes('Completed')}
                  onChange={(event) => toggleStatus(event, 'Completed')}
                />
              }
              label="Completed"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
