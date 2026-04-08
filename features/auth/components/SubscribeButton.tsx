import RoleBasedButton from "@/components/RoleBasedButton";
import { useSubscription } from "../hooks/useSubscription";

const Subscribe = () => {
  const { loading, subscribe } = useSubscription();

  return (
    <RoleBasedButton
      title={loading ? "Starting trial..." : "Start free trial"}
      onPress={subscribe}
      disabled={loading}
    />
  );
};

export default Subscribe;
