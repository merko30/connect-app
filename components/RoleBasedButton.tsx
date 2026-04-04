import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { ThemedButton, ThemedButtonProps } from "./ThemedButton";

const RoleBasedButton = (props: ThemedButtonProps) => {
  const { data: user } = useGetCurrentUser();
  const isClubOrCoach = !!user?.club || !!user?.coach;

  return (
    <ThemedButton
      variant={!isClubOrCoach ? "outlineSecondary" : "outline"}
      {...props}
    />
  );
};

export default RoleBasedButton;
