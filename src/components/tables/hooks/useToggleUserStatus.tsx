//mutation file
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserStatus } from "../../../api/userApi";
import type { User } from "../../../mocks/types";
import type { FetchUserParams } from "./useFetchUserHook";

interface SnackbarCallbacks {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function useToggleUserStatus(
  params: FetchUserParams,
  { onSuccess, onError }: SnackbarCallbacks
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: User) =>
      updateUserStatus(
        user.userId,
        user.status === "active" ? "inactive" : "active"
      ),

    onMutate: async (userToUpdate) => {
      // stop other fetching parts
      await queryClient.cancelQueries({ queryKey: ["users-list", params] });

      const previousUsers = queryClient.getQueryData(["users-list", params]);

      // optimistic ui update
      queryClient.setQueryData(["users-list", params], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          users: oldData.users.map((user: User) =>
            user.userId === userToUpdate.userId
              ? {
                  ...user,
                  status:
                    userToUpdate.status === "active" ? "inactive" : "active",
                }
              : user
          ),
        };
      });

      return { previousUsers };
    },

    //when update does not happen
    onError: (variables, context) => {
      queryClient.setQueryData(["users-list", params], context?.previousUsers);
      onError(`Failed to change user status for ${variables.name || "user"}`);
    },

    // when server updates happen
    onSuccess: (data) => {
      onSuccess(`Successfully changed user status ${data.name}`);
    },

    // refetch user list to ensure a synchronized state
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users-list", params] });
    },
  });
}
