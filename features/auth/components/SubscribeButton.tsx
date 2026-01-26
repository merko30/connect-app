import { ThemedButton } from "@/components/ThemedButton";
import { useSubscription } from "../hooks/useSubscription";

const Subscribe = () => {
  const { loading, subscribe } = useSubscription();

  return (
    <ThemedButton
      title={loading ? "Starting trial..." : "Start free trial"}
      onPress={subscribe}
      disabled={loading}
    />
  );
};

export default Subscribe;
