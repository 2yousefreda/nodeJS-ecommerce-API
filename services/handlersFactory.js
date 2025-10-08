const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const { modelName } = require("../models/brandModel");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new ApiError(`No item found with id ${req.params.id}`, 404));
    }

    res.status(204).json({
      status: "success",
      message: "Deleted successfully",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doc) {
      return next(new ApiError(`No item found with id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: doc });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ data: doc });
  });

exports.getOne = (Model)=>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findById(id);
    if (!doc) {
      return next(new ApiError(`item not found with id ${id}`, 404));
    }
    res.status(200).json({ data: doc });
  });

exports.getAll = (Model, modelName='') => asyncHandler(async (req, res) => {
  let filter = {};
  if (req.params.categoryId){
    filter = req.filterObj;
  } 

  const countDocuments = await Model.countDocuments();
  const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
    .filter()
    .search(modelName)
    .sort()
    .limitFields()
    .paginate(countDocuments);
  const { mongooseQuery, paginationResult } = apiFeatures;
  const docs = await mongooseQuery;
  res
    .status(200)
    .json({ length: docs.length, paginationResult, data: docs });
});