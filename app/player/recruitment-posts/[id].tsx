import {
  addRecruitmentPostInterest,
  recruitmentPostsApi,
  removeRecruitmentPostInterest,
} from "@/api/recruitment-posts";
import Header from "@/components/Header";
import { ThemedButton } from "@/components/ThemedButton";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { createStyle, useStyle } from "@/theme";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function RecruitmentPostDetailScreen() {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isInterested, setIsInterested] = useState(false);
  const { data: currentUser } = useGetCurrentUser();

  const {
    data: postData,
    isPending,
    error,
  } = useQuery({
    queryKey: ["recruitment-posts", id],
    queryFn: () =>
      recruitmentPostsApi.get(id, {
        populate: {
          interested: {
            fields: ["id"],
          },
          club: { populate: { logo: true } },
        } as any,
      }),
    enabled: !!id,
  });

  const post = postData?.data;

  const initialInterest = useMemo(
    () =>
      (post?.interested ?? []).some((user: any) => user.id === currentUser?.id),
    [post?.interested, currentUser?.id],
  );

  useEffect(() => {
    setIsInterested(initialInterest);
  }, [initialInterest]);

  const addInterestMutation = useMutation({
    mutationFn: (postId: string | number) => addRecruitmentPostInterest(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitment-posts", id] });
      Toast.show({
        type: "success",
        text1: t("recruitmentPost.interestedContactSoon"),
      });
    },
    onError: () => {
      setIsInterested(false);
      Alert.alert(t("errorOccurred"));
    },
  });

  const removeInterestMutation = useMutation({
    mutationFn: (postId: string | number) =>
      removeRecruitmentPostInterest(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitment-posts", id] });
    },
    onError: () => {
      setIsInterested(true);
      Alert.alert(t("errorOccurred"));
    },
  });

  const isInterestLoading =
    addInterestMutation.isPending || removeInterestMutation.isPending;

  const onToggleInterest = () => {
    const postId = post?.id;
    if (!postId || isInterestLoading) return;

    if (isInterested) {
      setIsInterested(false);
      removeInterestMutation.mutate(postId);
      return;
    }

    setIsInterested(true);
    addInterestMutation.mutate(postId);
  };

  const club = post?.club;
  const clubName = club?.clubName ?? "-";
  const logoUrl = (club as any)?.logo?.data?.attributes?.url;

  const contractTypeLabel = post?.contractType
    ? t(`contractTypes.${post.contractType}`)
    : null;
  const levelLabel = post?.level ? t(`experienceLevels.${post.level}`) : null;
  const statusLabel = post?.postStatus
    ? t(`recruitmentPost.status.${post.postStatus}`)
    : null;

  const statusColors: Record<string, string> = {
    open: "#27ae60",
    paused: "#f39c12",
    closed: "#e74c3c",
  };
  const statusColor = post?.postStatus
    ? (statusColors[post.postStatus] ?? "#888")
    : "#888";

  console.log(error);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <Header title={t("recruitmentPost.detail")} />
      {isPending || !post ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Club header */}
          <View style={styles.clubRow}>
            <Image
              source={{
                uri:
                  logoUrl ??
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(clubName)}&background=ddd`,
              }}
              style={styles.logo}
            />
            <Text style={styles.clubName}>{clubName}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{post.title}</Text>

          {/* Badges row */}
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{post.position}</Text>
            </View>
            {contractTypeLabel && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{contractTypeLabel}</Text>
              </View>
            )}
            {levelLabel && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{levelLabel}</Text>
              </View>
            )}
            {statusLabel && (
              <View
                style={[styles.badge, { backgroundColor: `${statusColor}22` }]}
              >
                <Text style={[styles.badgeText, { color: statusColor }]}>
                  {statusLabel}
                </Text>
              </View>
            )}
          </View>

          {/* Deadline */}
          {post.deadline && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {t("recruitmentPost.deadline")}
              </Text>
              <Text style={styles.infoValue}>
                {new Date(post.deadline).toLocaleDateString()}
              </Text>
            </View>
          )}

          {/* Note */}
          {post.note ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t("recruitmentPost.noteLabel")}
              </Text>
              <Text style={styles.sectionBody}>{post.note}</Text>
            </View>
          ) : null}

          {/* Requirements */}
          {post.requirements ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t("recruitmentPost.requirements")}
              </Text>
              <Text style={styles.sectionBody}>{post.requirements}</Text>
            </View>
          ) : null}

          <ThemedButton
            title={
              isInterested
                ? t("recruitmentPost.interestedSelected")
                : t("recruitmentPost.interested")
            }
            onPress={onToggleInterest}
            loading={isInterestLoading}
            variant={isInterested ? "outline" : "primary"}
            style={styles.interestedButton}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const stylesheet = createStyle((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: t.spacing.lg,
    paddingBottom: t.spacing.xl * 2,
  },
  clubRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: t.spacing.md,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#eee",
    marginRight: t.spacing.sm,
  },
  clubName: {
    fontSize: 15,
    fontWeight: "600",
    color: t.colors.text,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: t.colors.text,
    marginBottom: t.spacing.md,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: t.spacing.xs,
    marginBottom: t.spacing.md,
  },
  badge: {
    backgroundColor: `${t.colors.primary}18`,
    borderRadius: t.radii.full,
    paddingHorizontal: t.spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: t.colors.primary,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: t.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.surface,
  },
  infoLabel: {
    fontSize: 13,
    color: t.colors.secondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: t.colors.text,
  },
  section: {
    marginTop: t.spacing.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: t.colors.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: t.spacing.xs,
  },
  sectionBody: {
    fontSize: 15,
    color: t.colors.text,
    lineHeight: 22,
  },
  interestedButton: {
    marginTop: t.spacing.xl,
  },
}));
