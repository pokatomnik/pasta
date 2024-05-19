import { type Signal } from "@preact/signals";
import { useCallback, useEffect } from "preact/hooks";
import { Editor as EditorComponent } from "shared/Editor/ui/Editor.tsx";
import { broadcasters } from "features/broadcasters/model/broadcasters.ts";
import { load, save } from "islands/Editor/model/storage.ts";

const editChangeBroadcaster = broadcasters.editorTextChangeBroadcaster;

export default function Editor(
  props: Readonly<{
    data: Signal<string>;
  }>,
) {
  const { data } = props;

  const handleTextChange = useCallback((text: string) => {
    editChangeBroadcaster.publish(text);
    data.value = text;
  }, [data]);

  useEffect(() => {
    data.value = load();
  }, []);

  useEffect(() => {
    save(data.value);
  }, [data.value]);

  useEffect(() => {
    return editChangeBroadcaster.subscribe((newData) => {
      data.value = newData;
    }).unsubscribe;
  }, []);

  return (
    <EditorComponent
      autofocus
      text={data.value}
      onTextChange={handleTextChange}
      placeholder="A new note text"
    />
  );
}
