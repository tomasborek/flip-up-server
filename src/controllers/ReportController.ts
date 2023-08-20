import type { Request, Response } from "express";
import { response } from "@utils/response";
import ReportRepository from "@repositories/ReportRepository";
const ReportController = {
  create: async (req: Request, res: Response) => {
    await ReportRepository.create(req.user!.id, req.body);
    return response({ res, status: 201, message: "Report created" });
  },
  delete: async (req: Request, res: Response) => {
    const report = await ReportRepository.findById(Number(req.params.reportId));
    if (!report) {
      return response({ res, status: 404, message: "Report not found" });
    }
    await ReportRepository.delete(report.id);
    return response({ res, status: 200, message: "Report deleted" });
  },
  findMany: async (req: Request, res: Response) => {
    const reports = await ReportRepository.findMany(req.query);
    return response({
      res,
      status: 200,
      message: "Report found succesfully",
      data: { reports },
    });
  },
  findOne: async (req: Request, res: Response) => {
    const report = await ReportRepository.findById(Number(req.params.reportId));
    if (!report) {
      return response({ res, status: 404, message: "Report not found" });
    }
    return response({
      res,
      status: 200,
      message: "Report found succesfully",
      data: { report },
    });
  },
};

export default ReportController;
