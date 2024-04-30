import { type Signal } from "@preact/signals";
import { useCallback } from "preact/hooks";
import { Editor } from "shared/Editor/ui/Editor.tsx";

export default function MyIsland(
  props: Readonly<{
    data: Signal<string>;
  }>,
) {
  const { data } = props;

  const handleTextChange = useCallback((text: string) => {
    data.value = text;
  }, [data]);

  return (
    <Editor
      text={data.value}
      onTextChange={handleTextChange}
      placeholder="A new note text"
    />
  );
}
