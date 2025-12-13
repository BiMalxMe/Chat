export interface SendMessagePayload {
  ws: WebSocket | null;
  from: string;
  to: string;
  msg: string;
  onSent?: () => void;
}

export const sendMessage = ({
  ws,
  from,
  to,
  msg,
  onSent,
}: SendMessagePayload) => {
  if (!msg.trim()) return;

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        from,
        to,
        msg,
        time: new Date().toLocaleTimeString(),
      })
    );

    if (onSent) onSent();
  }
};
