import {
  ReportCreateType,
  ReportFindManyType,
} from "@validators/ReportValidator";
import { prisma } from "@db/prisma";
const ReportRepository = {
  create: (authorId: number, data: ReportCreateType) => {
    return prisma.report.create({ data: { ...data, authorId } });
  },
  delete: (id: number) => {
    return prisma.report.delete({ where: { id } });
  },
  findById: (id: number) => {
    return prisma.report.findUnique({ where: { id } });
  },
  findMany: (query: ReportFindManyType) => {
    return prisma.report.findMany({
      where: {
        type: query.type || undefined,
        listingId: Number(query.listingId) || undefined,
        userId: Number(query.userId) || undefined,
        messageId: Number(query.messageId) || undefined,
      },
      skip: Number(query.offset) || 0,
      include: {
        author: true,
        listing: true,
        user: true,
        message: { include: { user: true, referencedListing: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },
  findByType: (type: ReportCreateType["type"]) => {
    return prisma.report.findMany({ where: { type } });
  },
};

export default ReportRepository;
