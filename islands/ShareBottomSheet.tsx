import { type Signal } from "@preact/signals";
import { BottomSheet } from "shared/BottomSheet/ui/BottomSheet.tsx";

export const ShareBottomSheet = (
  props: Readonly<{
    visibility: Signal<boolean>;
  }>,
) => {
  const { visibility } = props;
  return (
    <BottomSheet position="bp75" visibility={visibility}>
      <button>Share</button>
    </BottomSheet>
  );
};
