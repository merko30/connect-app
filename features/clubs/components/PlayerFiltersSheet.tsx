import { FiltersSheet, FiltersSheetProps } from "@/components/FiltersSheet";

export type PlayerFiltersSheetProps = FiltersSheetProps;

const PlayerFiltersSheet = (props: PlayerFiltersSheetProps) => (
  <FiltersSheet {...props} />
);

PlayerFiltersSheet.displayName = "PlayerFiltersSheet";

export default PlayerFiltersSheet;
