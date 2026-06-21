import { usersApi } from "@/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

const useUpdateAvatar = () => {
  const client = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async (fileId: number) =>
      await usersApi.custom("/custom/profile-photo", {
        method: "PUT",
        body: {
          fileId,
        },
      }),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["current-user"] });
      Toast.show({
        type: "success",
        text1: t("profile.avatarUpdated"),
      });
    },
  });
};

export default useUpdateAvatar;
