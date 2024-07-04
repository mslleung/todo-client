
import { Sort, SortBy, SortOrder } from '@/models/todoTask';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useState } from 'react';

export function SortButton({
  sort,
  onSortChange,
}: {
  sort: Sort;
  onSortChange: (newSort: Sort) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [editSort, setEditSort] = useState(sort);

  const handleSortByChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditSort({
      ...editSort,
      sortBy: parseInt((event.target as HTMLInputElement).value),
    });
  };

  const handleSortOrderChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditSort({
      ...editSort,
      sortOrder: parseInt((event.target as HTMLInputElement).value),
    });
  };

  const handleClose = () => setIsDialogOpen(false);

  return (
    <>
      <Button variant="text" onClick={() => setIsDialogOpen(true)}>
        Sort
      </Button>
      <Dialog
        open={isDialogOpen}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            onSortChange(editSort);

            handleClose();
          },
        }}
      >
        <DialogTitle>Sort</DialogTitle>
        <DialogContent>
          <FormControl>
            <FormLabel>Sort by:</FormLabel>
            <RadioGroup
              defaultValue={sort.sortBy}
              value={editSort.sortBy}
              onChange={handleSortByChange}
            >
              <FormControlLabel
                value={SortBy.Name}
                control={<Radio />}
                label="Name"
              />
              <FormControlLabel
                value={SortBy.DueDate}
                control={<Radio />}
                label="Due date"
              />
              <FormControlLabel
                value={SortBy.Status}
                control={<Radio />}
                label="Status"
              />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Sort order:</FormLabel>
            <RadioGroup
              defaultValue={sort.sortOrder}
              value={editSort.sortOrder}
              onChange={handleSortOrderChange}
            >
              <FormControlLabel
                value={SortOrder.ASC}
                control={<Radio />}
                label="Ascending"
              />
              <FormControlLabel
                value={SortOrder.DESC}
                control={<Radio />}
                label="Descending"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
