// src/utils/productParser.js

export const parseProductDescription = (productDesc) => {
  if (!productDesc || !productDesc.includes('\\')) {
    return {
      brand: '',
      specs: {},
      features: [],
      description: productDesc || ''
    };
  }

  const parts = productDesc.split('\\');
  const brand = parts[0] || '';
  const specsStr = parts[1] || '';
  const featuresStr = parts[2] || '';
  const description = parts[3] || '';
  
  const specsObject = specsStr.split(', ').reduce((acc, spec) => {
    if (spec.includes(': ')) {
      const [key, value] = spec.split(': ');
      acc[key] = value;
    }
    return acc;
  }, {});

  const featuresArray = featuresStr ? featuresStr.split(', ') : [];

  return {
    brand,
    specs: specsObject,
    features: featuresArray,
    description
  };
};