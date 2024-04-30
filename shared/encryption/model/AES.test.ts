import { AES } from "shared/encryption/model/AES.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import { assertNotEquals } from "$std/assert/assert_not_equals.ts";

Deno.test("Encryption - AES - correct key", async () => {
  const aes = new AES();
  const data = 'Hello, мир!123!"№%:,.;()';
  const key = "such secure";
  const encrypted = await aes.encrypt(data, key);
  if (!encrypted) {
    return assertNotEquals(encrypted, null);
  }
  const decrypted = await aes.decrypt(encrypted, key);
  assertEquals(decrypted, data);
});

Deno.test("Encryption - AES - incorrect key", async () => {
  const aes = new AES();
  const data = 'Hello, мир!123!"№%:,.;()';
  const key = "such secure";
  const encrypted = await aes.encrypt(data, key);
  if (!encrypted) {
    return assertNotEquals(encrypted, null);
  }
  const decrypted = await aes.decrypt(encrypted, "another key");
  assertEquals(decrypted, null);
});
