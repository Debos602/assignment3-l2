import { Request, Response } from 'express';
import { CarServices } from './car.service';

const createCarInfo = async (req: Request, res: Response) => {
  try {
    const result = await CarServices.createCar({
      ...JSON.parse(req.body.car),
      image: req.file?.path,
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Car created successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the car',
      error: err,
    });
  }
};

const getAllCar = async (req: Request, res: Response) => {
  try {
    const result = await CarServices.getAllCar(req.query);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Cars retrieved successfully',
      data: result.result,
      meta: result.meta,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving all cars',
      error: err,
    });
  }
};

const getAvailableCar = async (req: Request, res: Response) => {
  try {
    const result = await CarServices.getAvailableCar();
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Cars retrieved successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving all cars',
      error: err,
    });
  }
};

const getSingleCar = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await CarServices.getSingleCar(id);
    if (!result) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'No data found',
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Car retrieved successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the car',
      error: err,
    });
  }
};

const updateCarInDb = async (req: Request, res: Response) => {
  try {
    // Parse the car information from the request body
    // console.log(Object.fromEntries(req.body));
    const carInfo = JSON.parse(req.body.car);

    // Check if carInfo is valid before accessing its properties
    if (!carInfo || !carInfo._id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid car information',
      });
    }

    // Construct the car object with safe access for the image
    const car = {
      ...carInfo,
      image: req.file?.path || carInfo.image || '', // Ensure image has a fallback
    };

    const result = await CarServices.updateCar(carInfo._id, car);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Car updated successfully',
      data: result,
    });
  } catch (err) {
    console.error('Error updating car:', err);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the car',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

const deleteCarformDb = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await CarServices.deleteCar(id);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Car deleted successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the car',
      error: err,
    });
  }
};

export const CarControllers = {
  createCarInfo,
  getAllCar,
  getSingleCar,
  updateCarInDb,
  deleteCarformDb,
  getAvailableCar,
};
