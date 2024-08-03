"use client";

import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Control, SubmitHandler } from "react-hook-form";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { Player } from "@lottiefiles/react-lottie-player";
import { createId } from "@paralleldrive/cuid2";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, CircleX, PencilRuler, Plus } from "lucide-react";

import { queryClient } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { fetchRouletteById, updateRoulette } from "@/actions/roulette";
import { useToast } from "@/components/ui/use-toast";
import { Roulette } from "@/schemas/roulette";
import Link from "next/link";
import { useEffect, useRef } from "react";

const Wheel = dynamic(() => import("@/components/roulette").then((mod) => mod.Roulette), {
  ssr: false,
  loading: () => (
    <div className="flex h-[445px] w-[445px] items-center justify-center">
      <Player autoplay loop src="/loader.json" className="size-32" />
    </div>
  ),
});

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: roultte,
    status,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["roulette", id],
    queryFn: () => fetchRouletteById(id),
  });

  const update = useMutation({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roulette", id] }),
    mutationFn: (roulette: Roulette) => updateRoulette(id, roulette),
  });

  const onUpdate: SubmitHandler<Roulette> = (data) => update.mutate(data);

  if (status === "pending") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-10">
        <Player autoplay loop src="/loader.json" className="size-40" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-10">
      <nav className="container fixed left-0 top-0 flex flex-row items-center justify-between p-4">
        <Button variant="secondary" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-5" />
        </Button>
        <Button asChild>
          <Link href={`/roulette/room?rouletteId=${id}`}>
            <PencilRuler className="size-5" />
            Create room
          </Link>
        </Button>
      </nav>
      <RouletteForm key={dataUpdatedAt} id={id} roulette={roultte} onSubmit={onUpdate} />
    </main>
  );
}

function RouletteForm({
  id,
  roulette,
  onSubmit,
}: {
  id: string;
  roulette?: Roulette;
  onSubmit: (data: Roulette) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<Roulette>({
    defaultValues: roulette,
    resolver: zodResolver(Roulette),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "options" });

  const { toast, dismiss } = useToast();

  const name = watch("name");

  const onDiscard = () => {
    reset(roulette);
    dismiss();
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

function RouletteWheel({ control }: { control: Control<Roulette> }) {
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
