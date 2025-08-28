export type User = {
  userId: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string;
  groups: Group[];
};

export type Group = {
  id: string;
  name: string;
  role: Role[];
};

export type Role = {
  id: string;
  name: "admin" | "manager" | "member";
};
