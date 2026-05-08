import { useCallback, useState } from "react";
import {
  userService,
  type UserDetail,
  type UserListItem,
  type UserContributionItem,
} from "@/services/user.service";

interface UserListResult {
  items: UserListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export function useUsers() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [contributions, setContributions] = useState<UserContributionItem[]>(
    [],
  );
  const [pagination, setPagination] = useState<{
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  } | null>(null);

  const fetchUsers = useCallback(
    async (params?: { page?: number; size?: number; searchName?: string }) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = (await userService.getUsers(params)) as UserListResult;
        setUsers(data.items);
        setPagination({
          page: data.page,
          size: data.size,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
        });
        return data;
      } catch (err) {
        const apiError = err as { message?: string };
        const message = apiError.message || "Failed to load users.";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const fetchUserById = useCallback(async (userId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getUserById(userId);
      setSelectedUser(data);
      return data;
    } catch (err) {
      const apiError = err as { message?: string };
      const message = apiError.message || "Failed to load user details.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUserContributions = useCallback(
    async (
      userId: number,
      filters?: { year?: number; startDate?: string; endDate?: string },
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await userService.getUserContributions(userId, filters);
        setContributions(data);
        return data;
      } catch (err) {
        const apiError = err as { message?: string };
        const message = apiError.message || "Failed to load contribution data.";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    isLoading,
    error,
    users,
    selectedUser,
    pagination,
    contributions,
    fetchUsers,
    fetchUserById,
    fetchUserContributions,
    setSelectedUser,
    setContributions,
  };
}
