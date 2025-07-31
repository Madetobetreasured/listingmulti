
let products = [];

function saveProduct() {
  const form = document.forms['productForm'];
  const product = {
    sku: form.sku.value,
    barcode: form.barcode.value,
    price: form.price.value,
    supplier: form.supplier.value,
    condition: 'New',
    quantity: 6,
    asin: '',
    title: 'AI Generated Title',
    description: 'AI Generated Description',
    tags: 'greeting card, occasion',
    images: []
  };
  products.push(product);
  alert("Product saved.");
}

function clearForm() {
  document.getElementById('productForm').reset();
}

function downloadCSV(platform) {
  let csv = '';
  if (platform === 'amazon') {
    csv = 'SKU,Price,Quantity,Condition,Barcode\n' + products.map(p => 
      `${p.sku},${p.price},${p.quantity},${p.condition},${p.barcode}`).join('\n');
  } else if (platform === 'shopify') {
    csv = 'Handle,Title,Body (HTML),Tags,Published,Variant SKU,Variant Price,Image Src\n' + products.map(p =>
      `${p.sku},${p.title},${p.description},${p.tags},TRUE,${p.sku},${p.price},${p.images[0] || ''}`).join('\n');
  } else if (platform === 'informed') {
    csv = 'SKU,Min Price,Max Price\n' + products.map(p =>
      `${p.sku},${p.price * 0.9},${p.price * 1.1}`).join('\n');
  } else if (platform === 'veeqo') {
    csv = 'SKU,Barcode,Supplier,Quantity\n' + products.map(p =>
      `${p.sku},${p.barcode},${p.supplier},${p.quantity}`).join('\n');
  }
  const blob = new Blob([csv], {type: 'text/csv'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `${platform}_products.csv`);
  a.click();
}

function generateAI() {
  alert("AI Generation would go here. GPT-4 API key needed.");
}
