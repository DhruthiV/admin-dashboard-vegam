import type { User } from "../mocks/types";

//api calls to user data get and patch
//get from users
export async function getUsers(params: {
  page: number;
  pageSize: number;
  sorting?: unknown;
  query?: string;
}): Promise<{ users: User[]; totalCount: number }> {
  const { page, pageSize, query } = params;
  const queryParams = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    query: query || "",
  }).toString();
  const response = await fetch(`/api/users?${queryParams}`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  const result = await response.json();
  return { users: result.users, totalCount: result.totalCount };
}

//patch to users
export const updateUserStatus = async (userId: string): Promise<User> => {
  const response = await fetch(`/api/users/${userId}`, {
    method: "PATCH",
  });
  if (!response.ok) {
    throw new Error("Failed to toggle user status");
  }
  return response.json();
};
