import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from "material-react-table";

import { IconButton, Tooltip, Chip, Snackbar, Alert } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useFetchUser } from "./hooks/useFetchUserHook";
import { useState, useMemo } from "react";
import type { User } from "../../mocks/types";
import { useToggleUserStatus } from "./hooks/useToggleUserStatus";

type ProcessedUser = User & {
  groupName: string;
  role: "admin" | "manager" | "member" | "";
};

export function UsersGrid() {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  //snackbar part
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "success";
  }>({
    open: false,
    message: "",
    severity: "error",
  });

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  //tanstack parts
  const { data, isLoading, isError, refetch } = useFetchUser({
    columnFilters,
    globalFilter,
    pagination,
  });

  const { mutate: toggleUserStatus } = useToggleUserStatus(
    {
      columnFilters,
      globalFilter,
      pagination,
    },
    {
      onSuccess: (message) =>
        setSnackbar({ open: true, message, severity: "success" }),
      onError: (message) =>
        setSnackbar({ open: true, message, severity: "error" }),
    }
  );

  console.log(data);

  //needs attention
  const usersData = useMemo(() => {
    return (
      data?.users?.map((user) => ({
        ...user,
        groupName: user.groups?.[0]?.name || "",
        role: user.groups?.[0]?.role?.[0]?.name || "",
      })) ?? []
    );
  }, [data]);

  // const ChiplistCell: MRT_ColumnDef<User>["Cell"] = ({ cell }) => {
  //   const groups = cell.getValue<Group[]>();
  //   return (
  //     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
  //       {groups.map((group) => (
  //         <Chip key={group.id} label={group.name} size="small" />
  //       ))}
  //     </Box>
  //   );
  // };

  const columns = useMemo<MRT_ColumnDef<ProcessedUser>[]>(
    () => [
      {
        accessorKey: "userId",
        header: "ID",
        grow: false,
        size: 50,
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "groupName",
        header: "Group Name",
        grow: false,
        size: 50,
      },
      {
        accessorKey: "role",
        header: "Role",
        grow: false,
        size: 50,
      },
      //chips for status part
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell, row }) => {
          const user = row.original;
          const status = cell.getValue<"active" | "inactive">();
          const color = status === "active" ? "success" : "default";

          const handleClick = () => {
            toggleUserStatus(user);
          };

          return (
            <Chip
              label={status}
              color={color}
              onClick={handleClick}
              sx={{ cursor: "pointer" }}
            />
          );
        },
        grow: false,
        size: 50,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        Cell: ({ cell }) =>
          new Date(cell.getValue<string>()).toLocaleDateString(),
        grow: false,
        size: 100,
      },
    ],
    [toggleUserStatus]
  );

  const table = useMaterialReactTable({
    columns,
    data: usersData,
    initialState: { showColumnFilters: true },
    manualFiltering: false, //filtering needs attention
    manualPagination: true,
    manualSorting: false,
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    ),
    rowCount: data?.totalCount ?? 0,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isLoading,
      sorting,
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
