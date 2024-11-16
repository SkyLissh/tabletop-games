"use client";

import { useEffect, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Control, useFieldArray, useForm, useWatch } from "react-hook-form";

import { createId } from "@paralleldrive/cuid2";

import { CircleX, Plus } from "lucide-react";

import { Roulette as Wheel } from "@/components/roulette";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { updateRoulette } from "@/actions/roulette";
import { Roulette } from "@/schemas/roulette";

export function RouletteForm({ id, roulette }: { id: string; roulette?: Roulette }) {
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<Roulette>({
    defaultValues: roulette,
    resolver: zodResolver(Roulette),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "options" });

  const { toast, dismiss } = useToast();

  const onDiscard = () => {
    reset(roulette);
    dismiss();
  };

  const onSubmit = (data: Roulette) => {
    updateRoulette(id, data);
  };

  useEffect(() => {
    if (!isDirty) {
      dismiss();
      return;
    }

    toast({
      title: "You have unsaved changes",
      action: (
        <div className="flex flex-row items-center gap-4">
          <Button
            variant="ghost"
            className="dark:hover:bg-slate-600"
            onClick={() => onDiscard()}
          >
            Discard
          </Button>
          <Button onClick={() => formRef.current?.requestSubmit()}>Save changes</Button>
        </div>
      ),
    });

    return () => dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  return (
    <>
      <h1 className="text-xl font-bold">{name ?? "Roulette name"}</h1>
      <div className="flex flex-col gap-6 lg:flex-row">
        <RouletteWheel control={control} />

        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <h2 className="text-lg font-bold">Edit roulette</h2>
          <label>
            <Input placeholder="Roulette name" {...register("name")} />
            <p>{errors.name?.message}</p>
          </label>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">Options</h3>
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-row gap-4">
                <label>
                  <Input placeholder="Name" {...register(`options.${index}.name`)} />
                  <p>{errors.options?.[index]?.name?.message}</p>
                </label>
                <label>
                  <Input
                    placeholder="Text color"
                    {...register(`options.${index}.textColor`)}
                  />
                  <p>{errors.options?.[index]?.textColor?.message}</p>
                </label>
                <label>
                  <Input
                    placeholder="Background color"
                    {...register(`options.${index}.backgroundColor`)}
                  />
                  <p>{errors.options?.[index]?.backgroundColor?.message}</p>
                </label>
                {fields.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-none rounded-full hover:bg-red-200 dark:hover:bg-red-800/40"
                    onClick={() => remove(index)}
                  >
                    <CircleX className="text-red-500" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                append({
                  id: createId(),
                  name: `Option ${fields.length + 1}`,
                  textColor: null,
                  backgroundColor: null,
                  rouletteId: id,
                })
              }
            >
              <Plus className="size-4" />
              Add option
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export function RouletteWheel({ control }: { control: Control<Roulette> }) {
  const options = useWatch({ control, name: "options" });

  return (
    <Wheel
      enabled={true}
      options={
        options.map((option) => ({
          option: option.name,
          style: {
            backgroundColor: option.textColor ?? undefined,
            textColor: option.backgroundColor ?? undefined,
            fontSize: option.name.length > 10 ? 15 : undefined,
          },
        })) ?? []
      }
    />
  );
}
