import { useSignal } from "@preact/signals";
import { Nullable } from "decorate";
import Viewer from "islands/Viewer/ui/Viewer.tsx";
import ViewPastaTopBar from "islands/ViewPastaTopBar/ui/ViewPastaTopBar.tsx";
import { Pasta } from "entities/Pasta/model/Pasta.ts";

export default function View() {
  const pastaSignal = useSignal<Nullable<Pasta>>(null);
  return (
    <div className="flex flex-col flex-1 basis-full fixed left-0 top-0 bottom-0 right-0 overflow-hidden bg-gray-200">
      <ViewPastaTopBar pastaSignal={pastaSignal} />
      <div className="flex flex-col flex-1 basis-full overflow-y-scroll">
        <div className="flex flex-1 basis-full justify-center transition-all duration-150 pt-0 pb-0 2xl:pt-4 xl:pt-4 lg:pt-4 2xl:pb-4 xl:pb-4 lg:pb-4">
          <div className="flex p-4 transition-all duration-150 w-full 2xl:w-1/2 xl:w-1/2 lg:w-3/4 bg-white">
            <Viewer data={pastaSignal} />
          </div>
        </div>
      </div>
    </div>
  );
}
