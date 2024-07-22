"use server";

import type { SQL } from "drizzle-orm";
import { eq, inArray, sql } from "drizzle-orm";
import { differenceWith, intersectionWith, isEqual } from "es-toolkit";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { db } from "@/db";
import { rouletteOptions } from "@/db/schema/roulette-options";
import { roulettes } from "@/db/schema/roulettes";

import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

import type { Roulette, RouletteOption } from "@/schemas/roulette";
import { revalidatePath } from "next/cache";

export async function createRoulette(formData: FormData) {
  const name = z.string().min(1).max(255).parse(formData.get("name"));
  const session = await getServerSession(authOptions);

  const [roulette] = await db
    .insert(roulettes)
    .values({ name, userId: session?.user.id })
    .returning();

  await db.insert(rouletteOptions).values([
    { name: "Option 1", rouletteId: roulette.id },
    { name: "Option 2", rouletteId: roulette.id },
  ]);

  redirect(`/roulette/${roulette.id}`);
}

export async function deleteRoulette(id: string) {
  await db.delete(roulettes).where(eq(roulettes.id, id));
  revalidatePath("/roulette");
}

export async function fetchAllRoulettes() {
  const session = await getServerSession(authOptions);

  return await db.select().from(roulettes).where(eq(roulettes.userId, session!.user.id));
}

export async function fetchRouletteById(id: string) {
  const session = await getServerSession(authOptions);

  const result = await db.query.roulettes.findFirst({
    where: (roulettes, { eq }) => eq(roulettes.id, id),
    with: { options: true },
  });

  if (result && result.userId !== session!.user.id) redirect("/");

  return result;
}

function optionEdited(oldOptions: RouletteOption, newOptions: RouletteOption) {
  const { id: oldId, ...oldOption } = oldOptions;
  const { id: newId, ...newOption } = newOptions;

  return oldId === newId && !isEqual(oldOption, newOption);
}

export async function updateRoulette(id: string, roulette: Roulette) {
  const result = await fetchRouletteById(id);

  if (!result) throw new Error("Roulette not found");

  if (result.name !== roulette.name) {
    await db.update(roulettes).set({ name: roulette.name }).where(eq(roulettes.id, id));
  }

  const created = differenceWith(
    roulette.options,
    result.options,
    (a, b) => a.id === b.id
  );
  const deleted = differenceWith(
    result.options,
    roulette.options,
    (a, b) => a.id === b.id
  );
  const edited = intersectionWith(roulette.options, result.options, optionEdited);

  await updateRouletteOptions(edited);

  if (created.length > 0) {
    await db.insert(rouletteOptions).values(created);
  }

  if (deleted.length > 0) {
    await db.delete(rouletteOptions).where(
      inArray(
        rouletteOptions.id,
        deleted.map((option) => option.id)
      )
    );
  }
}

async function updateRouletteOptions(options: RouletteOption[]) {
  if (options.length === 0) return;

  const nameSql: SQL[] = [sql`(case`];
  const textColorSql: SQL[] = [sql`(case`];
  const backgroundColorSql: SQL[] = [sql`(case`];

  for (const option of options) {
    nameSql.push(sql`when ${rouletteOptions.id} = ${option.id} then ${option.name}`);
    textColorSql.push(
      sql`when ${rouletteOptions.id} = ${option.id} then ${option.textColor}`
    );
    backgroundColorSql.push(
      sql`when ${rouletteOptions.id} = ${option.id} then ${option.backgroundColor}`
    );
  }

  nameSql.push(sql`end)`);
  textColorSql.push(sql`end)`);
  backgroundColorSql.push(sql`end)`);

  await db
    .update(rouletteOptions)
    .set({
      name: sql.join(nameSql, sql.raw(" ")),
      textColor: sql.join(textColorSql, sql.raw(" ")),
      backgroundColor: sql.join(backgroundColorSql, sql.raw(" ")),
    })
    .where(
      inArray(
        rouletteOptions.id,
        options.map((option) => option.id)
      )
    );
}
