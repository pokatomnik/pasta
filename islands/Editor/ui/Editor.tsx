import { type Signal } from "@preact/signals";
import { useCallback } from "preact/hooks";
import { Editor as EditorComponent } from "shared/Editor/ui/Editor.tsx";

export default function Editor(
  props: Readonly<{
    data: Signal<string>;
  }>,
) {
  const { data } = props;

  const handleTextChange = useCallback((text: string) => {
    data.value = text;
  }, [data]);

  return (
    <EditorComponent
      text={data.value}
      onTextChange={handleTextChange}
      placeholder="A new note text"
    />
  );
}
