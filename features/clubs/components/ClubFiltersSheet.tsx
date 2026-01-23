import { ReusableBottomSheet } from "@/components/BottomSheet";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Text, TouchableOpacity } from "react-native";

type ClubFiltersSheetProps = {
  filters: any;
};

export const ClubFiltersSheet = ({ filters }: ClubFiltersSheetProps) => {
  const ref = useRef<BottomSheetModal>(null);
  return (
    <>
      <TouchableOpacity
        style={{}}
        onPress={() => {
          ref?.current?.present();
          ref?.current?.expand();
        }}
        accessibilityLabel="Filters"
      >
        <IconSymbol
          name="line.3.horizontal.decrease.circle"
          size={24}
          color="#888"
        />
      </TouchableOpacity>
      <ReusableBottomSheet ref={ref} snapPoints={["40%", "70%"]}>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
      </ReusableBottomSheet>
    </>
  );
};

ClubFiltersSheet.displayName = "ClubFiltersSheet";

export default ClubFiltersSheet;
