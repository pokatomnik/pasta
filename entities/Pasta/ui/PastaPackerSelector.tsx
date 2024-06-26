import { Signal } from "@preact/signals";
import { Nullable } from "decorate";
import {
  packersWithEncryption,
  packerWithoutEncryption,
} from "entities/Pasta/model/PastaPacker.ts";
import { useCallback } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import {
  EncryptorName,
  isEncryptionName,
} from "shared/encryption/model/Encryptors.ts";

export const PastaPackerSelector = (
  props: Readonly<{
    state: Signal<Nullable<EncryptorName>>;
    hideUnEncrypted?: boolean;
  }>,
) => {
  const { state, hideUnEncrypted } = props;
  const handleChange: JSX.GenericEventHandler<HTMLSelectElement> = useCallback(
    (evt) => {
      const newEncryptionName = evt.currentTarget.value;
      if (isEncryptionName(newEncryptionName)) {
        state.value = newEncryptionName;
      } else {
        state.value = null;
      }
    },
    [],
  );

  const encryptionItemsJSX = (
    <>
      {packersWithEncryption.map((packer) => (
        <option
          selected={state.value === packer.encryptionName}
          value={packer.encryptionName ?? undefined}
        >
          {packer.encryptionName}
        </option>
      ))}
    </>
  );

  return (
    <select
      value={state.value ?? undefined}
      onChange={handleChange}
      className="h-9 border-2 p-1 bg-white"
      required
    >
      {!hideUnEncrypted && (
        <>
          <optgroup label="Without encryption">
            <option
              selected={!packerWithoutEncryption.encryptionName}
              value={packerWithoutEncryption.encryptionName ?? undefined}
            >
              Just share
            </option>
          </optgroup>
          <optgroup label="With encryption">
            {encryptionItemsJSX}
          </optgroup>
        </>
      )}
      {hideUnEncrypted && encryptionItemsJSX}
    </select>
  );
};
