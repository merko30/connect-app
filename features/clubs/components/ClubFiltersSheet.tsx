import { FiltersSheet, FiltersSheetProps } from "@/components/FiltersSheet";

export type ClubFiltersSheetProps = FiltersSheetProps;

const ClubFiltersSheet = (props: ClubFiltersSheetProps) => (
  <FiltersSheet {...props} />
);

ClubFiltersSheet.displayName = "ClubFiltersSheet";

export default ClubFiltersSheet;
