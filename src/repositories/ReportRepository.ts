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
        type: query.type,
        listingId: query.listingId,
        userId: query.userId,
        messageId: query.messageId,
      },
    });
  },
  findByType: (type: ReportCreateType["type"]) => {
    return prisma.report.findMany({ where: { type } });
  },
};

export default ReportRepository;
