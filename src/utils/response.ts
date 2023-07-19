import express from "express";
interface ResponseStructure {
  meta: {
    date: Date;
    status: number;
    message: string;
    pagination?: {
      offset: number;
      limit: number;
    };
  };
  data?: object;
}

type ResponseConfig = {
  res: express.Response;
  status: number;
  message: string;
  data?: object;
  pagination?: {
    offset: number;
    limit: number;
  };
};

export const response = ({
  res,
  status,
  message,
  data,
  pagination,
}: ResponseConfig) => {
  const formattedResponse: ResponseStructure = {
    meta: {
      date: new Date(),
      message,
      status,
      pagination,
    },
    data: data,
  };
  res.status(status).send(formattedResponse);
};
