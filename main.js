
let products = [];

async function generateAI() {
  const form = document.forms['productForm'];
  const prompt = `Generate an SEO-optimized product listing for a greeting card with SKU: ${form.sku.value} and supplier: ${form.supplier.value}. Include a title, up to 10 comma-separated tags, and a detailed product description.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  const [titleLine, tagsLine, ...descLines] = content.split('\n').filter(Boolean);
  form.title.value = titleLine.replace(/^Title:\s*/, '');
  form.tags.value = tagsLine.replace(/^Tags:\s*/, '');
  form.description.value = descLines.join('\n');
}

function saveProduct() {
  const form = document.forms['productForm'];
  const images = uploadcare.getAll().map(widget => widget.value()).filter(url => url);
  const product = {
    sku: form.sku.value,
    barcode: form.barcode.value,
    price: form.price.value,
    minPrice: form.minPrice.value,
    maxPrice: form.maxPrice.value,
    supplier: form.supplier.value,
    condition: 'New',
    quantity: 6,
    title: form.title.value,
    description: form.description.value,
    tags: form.tags.value,
    images: images
  };
  products.push(product);
  alert("Product saved.");
}

function clearForm() {
  document.getElementById('productForm').reset();
  document.querySelectorAll('[role=uploadcare-uploader]').forEach(input => {
    uploadcare.Widget(input).value(null);
  });
}

function downloadCSV(platform) {
  let csv = '';
  if (platform === 'amazon') {
    csv = 'SKU,Price,Quantity,Condition,Barcode\n' + products.map(p => 
      `${p.sku},${p.price},${p.quantity},${p.condition},${p.barcode}`).join('\n');
  } else if (platform === 'shopify') {
    csv = 'Handle,Title,Body (HTML),Tags,Published,Variant SKU,Variant Price,Image Src\n';
    products.forEach(p => {
      if (p.images.length > 0) {
        p.images.forEach(img => {
          csv += `${p.sku},${p.title},${p.description},${p.tags},TRUE,${p.sku},${p.price},${img}\n`;
        });
      } else {
        csv += `${p.sku},${p.title},${p.description},${p.tags},TRUE,${p.sku},${p.price},\n`;
      }
    });
  } else if (platform === 'informed') {
    csv = 'SKU,Min Price,Max Price\n' + products.map(p =>
      `${p.sku},${p.minPrice},${p.maxPrice}`).join('\n');
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
