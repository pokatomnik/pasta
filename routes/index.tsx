import { useSignal } from "@preact/signals";
import Editor from "islands/Editor/ui/Editor.tsx";
import CreatePastaTopBar from "islands/CreatePastaTopbar/ui/CreatePastaTopBar.tsx";
import { ShareBottomSheet } from "islands/ShareBottomSheet/ui/ShareBottomSheet.tsx";

export default function Home() {
  const textState = useSignal("");
  const shareDialogVisible = useSignal(false);
  return (
    <>
      <div className="fixed left-0 top-0 bottom-0 right-0 flex flex-col flex-1 basis-full overflow-hidden bg-gray-200">
        <CreatePastaTopBar
          textSignal={textState}
          shareSignal={shareDialogVisible}
        />
        <div className="flex flex-1 basis-full justify-center transition-all duration-150 pt-0 pb-0 2xl:pt-4 xl:pt-4 lg:pt-4 2xl:pb-4 xl:pb-4 lg:pb-4">
          <div className="flex p-4 transition-all duration-150 w-full 2xl:w-1/2 xl:w-1/2 lg:w-3/4 bg-white">
            <Editor data={textState} />
          </div>
        </div>
      </div>
      <ShareBottomSheet
        unpacked={textState}
        visibility={shareDialogVisible}
      />
    </>
  );
}
