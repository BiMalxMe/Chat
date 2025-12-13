import type{ Request, Response } from "express";
import { saveChatConversation, getConversation } from "../services/chatService";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { from, to, msg } = req.body;
    const saved = await saveChatConversation({ from, to, msg });
    res.status(200).json(saved);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const fetchConversation = async (req: Request, res: Response) => {
  try {
    const { userEmail1, userEmail2 } = req.query as any;
    const messages = await getConversation({ userEmail1, userEmail2 });
    res.status(200).json(messages);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
