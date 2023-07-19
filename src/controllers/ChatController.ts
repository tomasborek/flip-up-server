import ChatRepository from "@repositories/ChatRepository";
import MessageRepository from "@repositories/MessageRepository";
import UserRepository from "@repositories/UserRepository";
import { response } from "@utils/response";
import { type Request, type Response } from "express";
const ChatController = {
  create: async (req: Request, res: Response) => {
    const existingChat = await ChatRepository.findByUsers([
      req.user!.id,
      req.body.recieverId,
    ]);
    if (req.user!.id === req.body.recieverId) {
      return response({
        res,
        status: 400,
        message: "You can't create chat with yourself",
      });
    }
    if (existingChat) {
      return response({
        res,
        status: 409,
        message: "Chat already exists",
      });
    }
    const chat = await ChatRepository.create(req.user!.id, req.body);
    response({
      res,
      status: 201,
      message: "Successfully created chat",
      data: { chat },
    });
  },
  getOne: async (req: Request, res: Response) => {
    const chat = await ChatRepository.findById(Number(req.params.chatId), {
      include: { users: true },
    });
    if (!chat) {
      return response({
        res,
        status: 404,
        message: "Chat not found",
      });
    }
    const otherUserId = chat.users.find((u) => u.id !== req.user!.id)?.id;
    const user = await UserRepository.findById(Number(otherUserId));
    if (!user) {
      throw new Error("Internal server error");
    }
    response({
      res,
      status: 200,
      message: "Chat found",
      data: {
        chat: {
          id: chat.id,
          user,
        },
      },
    });
  },
  sendMessage: async (req: Request, res: Response) => {
    const chat = await ChatRepository.findById(Number(req.params.chatId));
    if (!chat)
      return response({
        res,
        status: 404,
        message: "Chat not found",
      });
    if (!chat.users.map((u) => u.id).includes(req.user!.id)) {
      return response({
        res,
        status: 403,
        message: "Forbidden",
      });
    }
    const message = await MessageRepository.create(
      req.user!.id,
      Number(req.params.chatId),
      {
        text: req.body.text,
        referencedListingId: req.body.referencedListingId,
        listingIds: req.body.listingIds,
      }
    );
    return response({
      res,
      status: 201,
      message: "Successfully sent message",
      data: {
        message,
      },
    });
  },
  getMessages: async (req: Request, res: Response) => {
    const chat = await ChatRepository.findById(Number(req.params.chatId));
    if (!chat) return res.status(401).send({ message: "Chat not found" });
    if (!chat.users.map((u) => u.id).includes(req.user!.id)) {
      //dont allow user to read messages if they are not part of the chat
      return res.status(403).send({ messages: "Forbidden" });
    }
    const otherUserId = chat.users.find((u) => u.id !== req.user!.id)?.id;
    if (!otherUserId) throw new Error("Internal server error");
    await ChatRepository.readAllMessages(chat.id, otherUserId);
    const messages = await ChatRepository.getMessages(
      Number(req.params.chatId),
      { limit: Number(req.query.limit), offset: Number(req.query.offset) }
    );
    return response({
      res,
      status: 200,
      message: "Success",
      pagination: {
        offset: Number(req.query.offset) || 0,
        limit: Number(req.query.limit) || 0,
      },
      data: {
        messages: messages,
      },
    });
  },
};

export default ChatController;
