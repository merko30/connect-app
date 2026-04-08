import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { Role } from "@/types/users";
import { ThemedButton, ThemedButtonProps } from "./ThemedButton";

const RoleBasedButton = ({
  variant = "primary",
  ...props
}: ThemedButtonProps) => {
  const { data: user } = useGetCurrentUser();
  const isClubStaff = user?.role?.name === Role.ClubStaff;

  const resolvedVariant =
    variant === "primary"
      ? isClubStaff
        ? "primary"
        : "secondary"
      : variant === "outline"
        ? isClubStaff
          ? "outline"
          : "outlineSecondary"
        : variant;

  return <ThemedButton variant={resolvedVariant} {...props} />;
};

export default RoleBasedButton;
