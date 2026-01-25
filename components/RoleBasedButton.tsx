import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { ThemedButton, ThemedButtonProps } from "./ThemedButton";

const RoleBasedButton = (props: ThemedButtonProps) => {
  const { data: user } = useGetCurrentUser();
  const isClub = !!user?.club;

  return (
    <ThemedButton
      variant={!isClub ? "outlineSecondary" : "outline"}
      {...props}
    />
  );
};

export default RoleBasedButton;
