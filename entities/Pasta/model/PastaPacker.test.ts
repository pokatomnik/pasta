import { assertEquals } from "$std/assert/assert_equals.ts";
import { assertNotEquals } from "$std/assert/assert_not_equals.ts";
import {
  decompress,
  decrypt,
  PastaPacker,
} from "entities/Pasta/model/PastaPacker.ts";
import { AES } from "shared/encryption/model/AES.ts";

Deno.test("PastaPacker - happy pass with encryption", async () => {
  const encryption = new AES();
  const packer = new PastaPacker(encryption);
  const noteName = "My new note";
  const text = 'Hello, Мир!"№;%:?*(';
  const key = "very secure";
  const packed = await packer.pack({ n: noteName, d: text, e: true }, key);
  if (!packed) {
    return assertNotEquals(packed, null);
  }
  const unpacked = await decompress(packed);
  if (!unpacked) {
    return assertNotEquals(packed, null);
  }
  const decrypted = await decrypt(encryption, unpacked, key);
  if (!decrypted) {
    return assertNotEquals(decrypted, null);
  }
  assertEquals(decrypted.n, noteName);
  assertEquals(decrypted.d, text);
  assertEquals(decrypted.e, true);
});

Deno.test("PastaPacker - happy pass without encryption", async () => {
  const encryption = new AES();
  const packer = new PastaPacker(encryption);
  const noteName = "My new note";
  const text = 'Hello, Мир!"№;%:?*()';
  const key = "very secure";
  const packed = await packer.pack({ n: noteName, d: text, e: true });
  if (!packed) {
    return assertNotEquals(packed, null);
  }
  const unpacked = await decompress(packed);
  if (!unpacked) {
    return assertNotEquals(packed, null);
  }
  const decrypted = await decrypt(encryption, unpacked, key);
  if (!decrypted) {
    return assertNotEquals(decrypted, null);
  }
  assertEquals(unpacked.n, noteName);
  assertEquals(unpacked.d, text);
  assertEquals(unpacked.e, false);
});

Deno.test("PastaPacker - incorrect key", async () => {
  const encryption = new AES();
  const packer = new PastaPacker(encryption);
  const noteName = "My new note";
  const text = "Hello, Мир!";
  const key = "very secure";
  const packed = await packer.pack({ n: noteName, d: text, e: true }, key);
  if (!packed) {
    return assertNotEquals(packed, null);
  }
  const unpacked = await decompress(packed);
  if (!unpacked) {
    return assertNotEquals(unpacked, null);
  }
  const decrypted = await decrypt(encryption, unpacked, "another key");
  assertEquals(decrypted, null);
});

Deno.test("PaastaPacker - missing key", async () => {
  const encryption = new AES();
  const packer = new PastaPacker(encryption);
  const noteName = "New note name";
  const text = "Hello, Мир!";
  const key = "very secure";
  const packed = await packer.pack({ n: noteName, d: text, e: true }, key);
  if (!packed) {
    return assertNotEquals(packed, null);
  }
  const unpacked = await decompress(packed);
  if (!unpacked) {
    return assertNotEquals(unpacked, null);
  }
  const decrypted = await decrypt(encryption, unpacked, "");
  assertEquals(decrypted, null);
});
