import { TodoLayout } from '@/components/todoLayout';
import { Box } from '@mui/material';

export default function Page() {
  return (
    <main>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          overflow: 'auto',
          justifyContent: 'center',
        }}
      >
        <TodoLayout />
      </Box>
    </main>
  );
}
