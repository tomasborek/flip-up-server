import CityRepository from "@repositories/CityRepository";
import { response } from "@utils/response";
const CityController = {
  getAll: async (req: any, res: any) => {
    //filter ignore diacritics and casing
    const cities = CityRepository.getAll();
    if (!req.query.search)
      return response({
        res,
        status: 200,
        message: "Succesfully retrieved cities",
        data: { cities },
      });
    const filteredCities = cities.filter((city) =>
      city
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(
          req.query.search
            .toString()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        )
    );
    //only return top 20 results
    return response({
      res,
      status: 200,
      message: "Succesfully retrieved cities",
      data: { cities: filteredCities.slice(0, 20) },
    });
  },
};

export default CityController;
