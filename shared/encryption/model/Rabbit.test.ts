import { Rabbit } from "shared/encryption/model/Rabbit.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import { assertNotEquals } from "$std/assert/assert_not_equals.ts";

Deno.test("Encryption - Rabbit - correct key", async () => {
  const rabbit = new Rabbit();
  const data = 'Hello, мир!123!"№%:,.;()';
  const key = "such secure";
  const encrypted = await rabbit.encrypt(data, key);
  if (!encrypted) {
    return assertNotEquals(encrypted, null);
  }
  const decrypted = await rabbit.decrypt(encrypted, key);
  assertEquals(decrypted, data);
});

Deno.test("Encryption - Rabbit - incorrect key", async () => {
  const rabbit = new Rabbit();
  const data = 'Hello, мир!123!"№%:,.;()';
  const key = "such secure";
  const encrypted = await rabbit.encrypt(data, key);
  if (!encrypted) {
    return assertNotEquals(encrypted, null);
  }
  const decrypted = await rabbit.decrypt(encrypted, "another key");
  assertEquals(decrypted, null);
});
