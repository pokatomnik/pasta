import { DES } from "shared/encryption/model/DES.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import { assertNotEquals } from "$std/assert/assert_not_equals.ts";

Deno.test("Encryption - DES - correct key", async () => {
  const des = new DES();
  const data = 'Hello, мир!123!"№%:,.;()';
  const key = "such secure";
  const encrypted = await des.encrypt(data, key);
  if (!encrypted) {
    return assertNotEquals(encrypted, null);
  }
  const decrypted = await des.decrypt(encrypted, key);
  assertEquals(decrypted, data);
});

Deno.test("Encryption - DES - incorrect key", async () => {
  const des = new DES();
  const data = 'Hello, мир!123!"№%:,.;()';
  const key = "such secure";
  const encrypted = await des.encrypt(data, key);
  if (!encrypted) {
    return assertNotEquals(encrypted, null);
  }
  const decrypted = await des.decrypt(encrypted, "another key");
  assertEquals(decrypted, null);
});
