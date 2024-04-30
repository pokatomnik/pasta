import { Blowfish } from "shared/encryption/model/Blowfish.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import { assertNotEquals } from "$std/assert/assert_not_equals.ts";

Deno.test("Encryption - Blowfish - correct key", async () => {
  const blowfish = new Blowfish();
  const data = 'Hello, мир!123!"№%:,.;()';
  const key = "such secure";
  const encrypted = await blowfish.encrypt(data, key);
  if (!encrypted) {
    return assertNotEquals(encrypted, null);
  }
  const decrypted = await blowfish.decrypt(encrypted, key);
  assertEquals(decrypted, data);
});

Deno.test("Encryption - Blowfish - incorrect key", async () => {
  const blowfish = new Blowfish();
  const data = 'Hello, мир!123!"№%:,.;()';
  const key = "such secure";
  const encrypted = await blowfish.encrypt(data, key);
  if (!encrypted) {
    return assertNotEquals(encrypted, null);
  }
  const decrypted = await blowfish.decrypt(encrypted, "another key");
  assertEquals(decrypted, null);
});
