import { Container, Typography } from "@mui/material";
import { UsersGrid } from "../../components/tables/UsersGrid";

function UsersPage() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography>User Dashboard Page - Vegam</Typography>
      <UsersGrid />
    </Container>
  );
}

export default UsersPage;
