export type Player = {
  name: string;
  id: string;
  status: "connecting" | "connected" | "disconnected";
};
