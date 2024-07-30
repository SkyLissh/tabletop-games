import { useSyncExternalStore } from "react";

import type { Schema } from "@colyseus/schema";
import { Client, type Room } from "colyseus.js";

import type { RouletteRoomState } from "@/schemas/roulette-game-state";
import { store } from "./colyseus-store";

const colyseus = <S = Schema>(
  endpoint: string,
  schema?: new (...args: unknown[]) => S
) => {
  const client = new Client(endpoint);

  const roomStore = store<Room<S> | undefined>(undefined);
  const stateStore = store<S | undefined>(undefined);

  let connecting = false;

  const connectToColyseus = async (
    roomName: string,
    roomOptions: { roomId?: string; options: object }
  ) => {
    if (connecting || roomStore.get()) return;

    connecting = true;

    try {
      let room: Room<S> | undefined;

      if (roomOptions.roomId) {
        room = await client.joinById<S>(roomOptions.roomId, roomOptions.options, schema);
      } else {
        room = await client.joinOrCreate<S>(roomName, roomOptions.options, schema);
      }

      roomStore.set(room);
      stateStore.set(room.state);

      const updatedCollectionsMap: { [key in keyof S]?: boolean } = {};

      for (const [key, value] of Object.entries(room.state as Schema)) {
        if (
          typeof value !== "object" ||
          !value.clone ||
          !value.onAdd ||
          !value.onRemove
        ) {
          continue;
        }

        updatedCollectionsMap[key as keyof S] = false;

        value.onAdd(() => {
          updatedCollectionsMap[key as keyof S] = true;
        });

        value.onRemove(() => {
          updatedCollectionsMap[key as keyof S] = true;
        });
      }

      room.onStateChange((state) => {
        if (!state) return;

        const copy = { ...state };

        for (const [key, update] of Object.entries(updatedCollectionsMap)) {
          if (!update) continue;

          updatedCollectionsMap[key as keyof S] = false;

          const value = state[key as keyof S] as unknown;

          if ((value as Schema).clone) {
            //@ts-expect-error - ignore
            copy[key as keyof S] = value.clone();
          }
        }

        stateStore.set(copy);
      });

      console.log(`Succesfully connected to Colyseus room ${roomName} at ${endpoint}`);
    } catch (e) {
      console.error("Failed to connect to Colyseus!");
      console.log(e);

      throw e;
    } finally {
      connecting = false;
    }
  };

  const disconnectFromColyseus = async () => {
    const room = roomStore.get();
    if (!room) return;

    roomStore.set(undefined);
    stateStore.set(undefined);

    try {
      await room.leave();
      console.log("Disconnected from Colyseus!");
    } catch {}
  };

  const useColyseusRoom = () => {
    const subscribe = (callback: () => void) => roomStore.subscribe(() => callback());

    const getSnapshot = () => {
      const colyseus = roomStore.get();
      return colyseus;
    };

    const getServerSnapshot = () => roomStore.get();

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  };

  function useColyseusState(): S | undefined;
  function useColyseusState<T extends (state: S) => unknown>(
    selector: T
  ): ReturnType<T> | undefined;
  function useColyseusState<T extends (state: S) => unknown>(selector?: T) {
    const subscribe = (callback: () => void) =>
      stateStore.subscribe(() => {
        callback();
      });

    const getSnapshot = () => {
      const state = stateStore.get();
      return state && selector ? selector(state) : state;
    };

    const getServerSnapshot = () => stateStore.get();

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  }

  return {
    client,
    connectToColyseus,
    disconnectFromColyseus,
    useColyseusRoom,
    useColyseusState,
  };
};

export const {
  client,
  connectToColyseus,
  disconnectFromColyseus,
  useColyseusRoom,
  useColyseusState,
} = colyseus<RouletteRoomState>(process.env.NEXT_PUBLIC_COLYSEUS_SERVER);
