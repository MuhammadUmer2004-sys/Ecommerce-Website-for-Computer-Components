// src/utils/productParser.js

export const parseProductDescription = (productDesc) => {
  const [brand, specs, features, description] = productDesc.split('\\');
  
  const specsObject = specs.split(', ').reduce((acc, spec) => {
    const [key, value] = spec.split(': ');
    acc[key] = value;
    return acc;
  }, {});

  const featuresArray = features.split(', ');

  return {
    brand,
    specs: specsObject,
    features: featuresArray,
    description
  };
};