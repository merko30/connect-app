import { createStyle, useStyle } from "@/theme";
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

type Props = {
  children: ReactNode;
  snapPoints?: string[];
};

export const ReusableBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ children, snapPoints = ["100%"] }, ref) => {
    const internalRef = useRef<BottomSheetModal>(null);
    const styles = useStyle(stylesheet);
    // Expose internal ref to parent
    useImperativeHandle(ref, () => internalRef.current!);

    return (
      <BottomSheetModal
        ref={internalRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        handleStyle={styles.bg}
        backgroundStyle={styles.bg}
        handleIndicatorStyle={styles.handle}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />
        )}
      >
        <BottomSheetView style={styles.content}>{children}</BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const stylesheet = createStyle((t) => ({
  content: {
    backgroundColor: t.colors.background,
    flex: 1,
    padding: 16,
  },
  handle: {
    backgroundColor: t.colors.text,
  },
  bg: {
    backgroundColor: t.colors.background,
    borderTopRightRadius: t.radii.xl,
    borderTopLeftRadius: t.radii.xl,
  },
}));

ReusableBottomSheet.displayName = "BottomSheet";
