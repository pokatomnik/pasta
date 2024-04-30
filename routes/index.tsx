import { useSignal } from "@preact/signals";
import Editor from "islands/Editor.tsx";
import TopBar from "islands/TopBar.tsx";

export default function Home() {
  const text = useSignal("");
  return (
    <div className="flex flex-col flex-1 basis-full h-screen overflow-hidden bg-gray-200">
      <TopBar onEncryptClick={() => {}} />
      <div className="flex flex-1 basis-full justify-center pt-0 pb-0 2xl:pt-4 xl:pt-4 lg:pt-4 2xl:pb-4 xl:pb-4 lg:pb-4">
        <div className="flex p-4 w-full 2xl:w-1/2 xl:w-1/2 lg:w-3/4 bg-white">
          <Editor data={text} />
        </div>
      </div>
    </div>
  );
}
