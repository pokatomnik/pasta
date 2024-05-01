import { BrotliCompressor } from "shared/compression/model/BrotliCompressor.ts";
import { AES } from "shared/encryption/model/AES.ts";
import { PastaPacker } from "entities/Pasta/model/PastaPacker.ts";
import { assertNotEquals } from "$std/assert/assert_not_equals.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";

Deno.test("PastaPacker - happy pass with encryption", async () => {
  const packer = new PastaPacker(new BrotliCompressor(), new AES());
  const author = "John Doe";
  const text = 'Hello, Мир!"№;%:?*(';
  const key = "very secure";
  const packed = await packer.pack({ a: author, d: text, e: true }, key);
  if (!packed) {
    return assertNotEquals(packed, null);
  }
  const unpacked = await packer.unpack(packed, key);
  if (!unpacked) {
    return assertNotEquals(packed, null);
  }
  assertEquals(unpacked.a, author);
  assertEquals(unpacked.d, text);
  assertEquals(unpacked.e, true);
});

Deno.test("PastaPacker - happy pass without encryption", async () => {
  const packer = new PastaPacker(new BrotliCompressor(), new AES());
  const author = "John Doe";
  const text = 'Hello, Мир!"№;%:?*()';
  const key = "very secure";
  const packed = await packer.pack({ a: author, d: text, e: true });
  if (!packed) {
    return assertNotEquals(packed, null);
  }
  const unpacked = await packer.unpack(packed, key);
  if (!unpacked) {
    return assertNotEquals(packed, null);
  }
  assertEquals(unpacked.a, author);
  assertEquals(unpacked.d, text);
  assertEquals(unpacked.e, false);
});

Deno.test("PastaPacker - incorrect key", async () => {
  const packer = new PastaPacker(new BrotliCompressor(), new AES());
  const author = "John Doe";
  const text = "Hello, Мир!";
  const key = "very secure";
  const packed = await packer.pack({ a: author, d: text, e: true }, key);
  if (!packed) {
    return assertNotEquals(packed, null);
  }
  const unpacked = await packer.unpack(packed, "another key");
  assertEquals(unpacked, null);
});

Deno.test("PaastaPacker - missing key", async () => {
  const packer = new PastaPacker(new BrotliCompressor(), new AES());
  const author = "John Doe";
  const text = "Hello, Мир!";
  const key = "very secure";
  const packed = await packer.pack({ a: author, d: text, e: true }, key);
  if (!packed) {
    return assertNotEquals(packed, null);
  }
  const unpacked = await packer.unpack(packed);
  assertEquals(unpacked, null);
});
