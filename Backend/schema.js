import Joi from 'joi';

// Define the schema for ImageData
const ImageDataSchema = Joi.object({
  image: Joi.string().required().description('Base64 image data or image path'),
  dict_of_vars: Joi.object()
    .pattern(Joi.string(), Joi.any())
    .required()
    .description('A dictionary of variables and their values'),
});

export { ImageDataSchema };
