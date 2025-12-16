import { usersApi } from "@/api/auth";
import { User } from "@/types/users";
import { useQuery } from "@tanstack/react-query";

const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: () => usersApi.custom<User>("/users/me"),
  });
};

export default useGetCurrentUser;
