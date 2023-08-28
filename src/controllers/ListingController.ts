import { Request, Response } from "express";
import ListingRepository from "@repositories/ListingRepository";
import CategoryRepository from "@repositories/CategoryRepository";
import { response } from "@utils/response";
import {
  deleteImage,
  isImages,
  nameImage,
  readImage,
  resizeImage,
  writeImage,
} from "@utils/storage";
import path from "path";
import UserRepository from "@repositories/UserRepository";
const ListingController = {
  create: async (req: Request, res: Response) => {
    const category = await CategoryRepository.findById(req.body.categoryId);
    if (!category)
      return response({ res, status: 404, message: "Category not found" });
    const listing = await ListingRepository.create(req.user!.id, req.body);
    return response({
      res,
      status: 201,
      message: "Successfully created listing",
      data: { listing },
    });
  },
  delete: async (req: Request, res: Response) => {
    const listing = await ListingRepository.findById(
      Number(req.params.listingId)
    );
    if (!listing)
      return response({ res, status: 404, message: "Listing not found" });
    if (listing.userId !== Number(req.user!.id))
      return response({ res, status: 403, message: "Forbidden" });

    await ListingRepository.delete(Number(req.params.listingId));
    await Promise.all(
      listing.images.map(async (image) => {
        try {
          const file = await readImage(
            path.join(
              "uploads",
              "listings",
              image.url.split("/")[image.url.split("/").length - 1]
            )
          );
          if (!file) throw new Error("File not found");
          await deleteImage(
            path.join(
              "uploads",
              "listings",
              image.url.split("/")[image.url.split("/").length - 1]
            )
          );
        } catch (error) {}
      })
    );
    return response({
      res,
      status: 200,
      message: "Successfully deleted listing",
    });
  },
  update: async (req: Request, res: Response) => {
    const listing = await ListingRepository.findById(
      Number(req.params.listingId)
    );
    if (!listing)
      return response({ res, status: 404, message: "Listing not found" });
    if (listing.userId !== Number(req.user!.id))
      return response({ res, status: 403, message: "Forbidden" });
    await ListingRepository.update(Number(req.params.listingId), req.body);
    return response({
      res,
      status: 200,
      message: "Successfully updated listing",
    });
  },
  getOne: async (req: Request, res: Response) => {
    const listing = await ListingRepository.findById(
      Number(req.params.listingId)
    );
    if (!listing)
      return response({ res, status: 404, message: "Listing not found" });
    return response({
      res,
      status: 200,
      message: "Successfully retrieved listing",
      data: {
        listing: {
          ...listing,
          userId: listing.userId,
          liked: await ListingRepository.isLiked(req.user!.id, listing.id),
          owned: await ListingRepository.isOwned(req.user!.id, listing.id),
          user: {
            ...listing.user,
            chatId: await UserRepository.getChatId(
              req.user!.id,
              listing.userId
            ),
          },
        },
      },
    });
  },
  getMany: async (req: Request, res: Response) => {
    const listings = await ListingRepository.getMany(req.query);
    if (req.query.userId && req.query.byFollowed)
      return response({
        res,
        status: 400,
        message: "Bad request",
      });

    if (req.query.byFollowed && !req.user) {
      return response({
        res,
        status: 200,
        message: "Successfully retrieved listings",
        data: {
          listings: [],
        },
      });
    }
    if (req.query.category) {
      const category = await CategoryRepository.findById(
        Number(req.query.category)
      );
      if (!category)
        return response({ res, status: 404, message: "Category not found" });
    }

    return response({
      res,
      status: 200,
      message: "Successfully retrieved listings",
      data: {
        listings: await Promise.all(
          listings.map(async (listing) => ({
            ...listing,
            liked: await ListingRepository.isLiked(req.user?.id, listing.id),
            owned: await ListingRepository.isOwned(req.user?.id, listing.id),
          }))
        ),
      },
    });
  },
  like: async (req: Request, res: Response) => {
    const listing = await ListingRepository.findById(
      Number(req.params.listingId)
    );
    if (!listing)
      return response({ res, status: 404, message: "Listing not found" });
    await ListingRepository.like(req.user!.id, listing.id);
    return response({
      res,
      status: 200,
      message: "Successfully liked listing",
    });
  },
  unlike: async (req: Request, res: Response) => {
    const listing = await ListingRepository.findById(
      Number(req.params.listingId)
    );
    if (!listing)
      return response({ res, status: 404, message: "Listing not found" });
    await ListingRepository.unlike(req.user!.id, listing.id);
    return response({
      res,
      status: 200,
      message: "Successfully unliked listing",
    });
  },
  addImages: async (req: Request, res: Response) => {
    if (!req.files || !req.files.length)
      return res.status(400).json({ error: "No images provided" });
    //@ts-ignore
    const validImages = isImages(req.files);
    if (!validImages)
      return response({ res, status: 404, message: "Invalid image format" });

    const listing = await ListingRepository.findById(
      Number(req.params.listingId)
    );
    if (!listing)
      return response({ res, status: 404, message: "Listing not found" });
    if (req.user!.id !== listing.userId)
      return res.status(403).json({ error: "Forbidden" });
    if (listing.images) {
      await Promise.all(
        listing.images.map((i) => {
          return deleteImage(
            path.join(
              "uploads",
              "listings",
              i.url.split("/")[i.url.split("/").length - 1]
            )
          );
        })
      );
    }

    //@ts-ignore
    const imagePromises = req.files.map(async (file: Express.Multer.File) => {
      const fileName = nameImage(file.originalname, listing.id);
      const resizedImageBuffer = await resizeImage(file.buffer);
      await writeImage({
        path: path.join("uploads", "listings", fileName),
        buffer: resizedImageBuffer,
      });
      await ListingRepository.addImage(
        Number(req.params.listingId),
        `${process.env.ROOT_URL}/uploads/listings/${fileName}`
      );
    });
    await Promise.all(imagePromises);
    return res.status(200).json(null);
  },
};

export default ListingController;
