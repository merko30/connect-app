import { Image } from "react-native";

const AvatarOrInitials = ({
  avatarUrl,
  name,
  size = 40,
  style,
}: {
  avatarUrl?: string | null;
  name: string;
  size?: number;
  style?: any;
}) => {
  return (
    <Image
      source={{
        uri:
          avatarUrl ??
          `https://ui-avatars.com/api/?name=${name}&background=ddd`,
      }}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    />
  );
};

export default AvatarOrInitials;
