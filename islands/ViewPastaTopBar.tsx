import { Signal } from "@preact/signals";
import { Nullable } from "decorate";
import { Pasta } from "entities/Pasta/model/Pasta.ts";
import { useCallback } from "preact/hooks";
import { TopBar as TopBarComponent } from "shared/TopBar/ui/TopBar.tsx";
import { TopBarButton } from "shared/TopBar/ui/TopBarButton.tsx";
import { copyText } from "shared/clipboard/model/copy.ts";
import {
  useToastContext,
  withToastController,
} from "shared/Toast/ui/ToastController.tsx";

export default withToastController(function ToastControllerViewPastaTopBar(
  props: Readonly<{
    pastaSignal: Signal<Nullable<Pasta>>;
  }>,
) {
  const { pastaSignal } = props;
  const showToast = useToastContext();

  const handleClick = useCallback(() => {
    if (pastaSignal.value && !pastaSignal.value.e) {
      copyText(pastaSignal.value.d).then(() => {
        showToast("Copied!");
      }).catch(() => {
        showToast("Failed to copy!");
      });
    }
  }, [showToast]);

  return (
    <TopBarComponent title={pastaSignal.value?.a ?? ""}>
      {pastaSignal.value && !pastaSignal.value.e
        ? <TopBarButton onClick={handleClick}>Copy</TopBarButton>
        : <></>}
    </TopBarComponent>
  );
});
