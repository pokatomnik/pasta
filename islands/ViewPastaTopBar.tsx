import { Signal } from "@preact/signals";
import { Nullable } from "decorate";
import { Pasta } from "entities/Pasta/model/Pasta.ts";
import { TopBar as TopBarComponent } from "shared/TopBar/ui/TopBar.tsx";

export default function ViewPastaTopBar(
  props: Readonly<{
    pastaSignal: Signal<Nullable<Pasta>>;
  }>,
) {
  const { pastaSignal } = props;

  return <TopBarComponent title={pastaSignal.value?.a ?? ""} />;
}
