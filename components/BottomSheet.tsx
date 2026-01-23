import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import { StyleSheet } from "react-native";

type Props = {
  children: ReactNode;
  snapPoints?: string[];
};

export const ReusableBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ children, snapPoints = ["50%"] }, ref) => {
    const internalRef = useRef<BottomSheetModal>(null);

    // Expose internal ref to parent
    useImperativeHandle(ref, () => internalRef.current!);

    return (
      <BottomSheetModal
        ref={internalRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />
        )}
      >
        <BottomSheetView style={styles.content}>{children}</BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
});

ReusableBottomSheet.displayName = "BottomSheet";
