import fs from 'node:fs';
import vm from 'node:vm';

const catalogFiles = [
  'data.js',
  'catalog-production-extension.js',
  ...Array.from({ length: 17 }, (_, i) => `catalog-production-batch${i + 2}.js`),
];

const missingFiles = catalogFiles.filter((file) => !fs.existsSync(file));
if (missingFiles.length) {
  console.error('Missing catalog files:', missingFiles.join(', '));
  process.exit(1);
}

const context = vm.createContext({
  console,
  location: { protocol: 'https:', href: 'https://catalog-validation.invalid/' },
  window: {},
  document: {},
});

for (const file of catalogFiles) {
  const source = fs.readFileSync(file, 'utf8');
  try {
    vm.runInContext(source, context, { filename: file });
  } catch (error) {
    console.error(`Failed to evaluate ${file}:`);
    console.error(error);
    process.exit(1);
  }
}

const products = vm.runInContext('products.map((p) => ({...p}))', context);
const checkedAt = vm.runInContext("typeof checkedAt !== 'undefined' ? checkedAt : null", context);

const errors = [];
const warnings = [];
const requiredStrings = ['maker', 'model', 'status', 'doorType', 'source'];
const requiredNumbers = ['price', 'capacity', 'width', 'doors', 'freezerTotal', 'energy'];
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const exactModels = new Map();
for (const product of products) {
  for (const key of requiredStrings) {
    if (typeof product[key] !== 'string' || !product[key].trim()) {
      errors.push(`${product.model || '<unknown>'}: ${key} must be a non-empty string`);
    }
  }

  for (const key of requiredNumbers) {
    if (typeof product[key] !== 'number' || !Number.isFinite(product[key]) || product[key] < 0) {
      errors.push(`${product.model || '<unknown>'}: ${key} must be a finite non-negative number`);
    }
  }

  if (typeof product.autoIce !== 'boolean') {
    errors.push(`${product.model || '<unknown>'}: autoIce must be boolean`);
  }

  if (typeof product.smartphone !== 'boolean' && product.smartphone !== null) {
    errors.push(`${product.model || '<unknown>'}: smartphone must be boolean or null`);
  } else if (product.smartphone === null) {
    warnings.push(`${product.model}: smartphone is still unverified (null)`);
  }

  if (product.vegetable !== null && (typeof product.vegetable !== 'number' || !Number.isFinite(product.vegetable) || product.vegetable < 0)) {
    errors.push(`${product.model}: vegetable must be null or a finite non-negative number`);
  }

  if (!product.source.includes('yodobashi.com')) {
    warnings.push(`${product.model}: source is not a Yodobashi URL`);
  }

  if (product.verifiedAt == null) {
    warnings.push(`${product.model}: verifiedAt missing; falls back to checkedAt=${checkedAt || 'unknown'}`);
  } else if (typeof product.verifiedAt !== 'string' || !datePattern.test(product.verifiedAt)) {
    errors.push(`${product.model}: verifiedAt must use YYYY-MM-DD`);
  }

  const count = exactModels.get(product.model) || 0;
  exactModels.set(product.model, count + 1);
}

for (const [model, count] of exactModels) {
  if (count > 1) errors.push(`${model}: duplicate exact model appears ${count} times`);
}

const byMaker = new Map();
for (const product of products) {
  byMaker.set(product.maker, (byMaker.get(product.maker) || 0) + 1);
}

// Batch 18 audit invariants.
if (!products.some((p) => p.model === 'GR-Y600FK-EW')) {
  errors.push('GR-Y600FK-EW must be present after batch 18');
}
if (products.some((p) => p.model === 'SJ-X373P-N')) {
  errors.push('SJ-X373P-N must be removed after batch 18');
}

console.log(`Catalog products: ${products.length}`);
console.log('By maker:');
for (const [maker, count] of [...byMaker.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  console.log(`  ${maker}: ${count}`);
}
console.log(`Legacy checkedAt fallback: ${checkedAt || 'none'}`);
console.log(`Warnings: ${warnings.length}`);
for (const warning of warnings) console.log(`  WARN ${warning}`);

if (errors.length) {
  console.error(`Errors: ${errors.length}`);
  for (const error of errors) console.error(`  ERROR ${error}`);
  process.exit(1);
}

console.log('Catalog validation: PASS');
