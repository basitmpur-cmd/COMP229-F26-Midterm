/**
 * Midterm API Project - COMP229
 * Student: Abdulbasit Mohammadpur (301539478)
 * Student ID ends in 8 -> added 2 portable equipment items.
 * Use the array index as the ID: index 0 is the first equipment item.
 */
import express from 'express';

const app = express();
app.use(express.json());

let equipment = [
  { name: 'USB Microphone', category: 'audio', brand: 'AudioLab', year: 2021, quantity: 5 },
  { name: 'LED Panel', category: 'lighting', brand: 'BrightWorks', year: 2022, quantity: 4 },
  { name: 'Network Switch', category: 'networking', brand: 'NetCore', year: 2020, quantity: 3 },
  { name: 'Cable Tester', category: 'tools', brand: 'TestPro', year: 2019, quantity: 6 },
  { name: 'Studio Headphones', category: 'audio', brand: 'SoundCraft', year: 2023, quantity: 8 },
  // Personalized items (ID ends in 8: portable equipment)
  { name: 'Portable Mini Projector', category: 'video', brand: 'Nebula', year: 2023, quantity: 2 },
  { name: 'Portable SSD 1TB', category: 'storage', brand: 'Samsung', year: 2022, quantity: 4 }
];

// Helper: turn :id into a valid array index, or -1 if invalid
function getIndex(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id >= 0 && id < equipment.length ? id : -1;
}

// Helper: check that an item has the correct fields and types
function isValid(item) {
  return item &&
    typeof item.name === 'string' && item.name.trim() !== '' &&
    typeof item.category === 'string' && item.category.trim() !== '' &&
    typeof item.brand === 'string' && item.brand.trim() !== '' &&
    Number.isInteger(item.year) &&
    Number.isInteger(item.quantity) && item.quantity >= 0;
}

// 1) GET all equipment
app.get('/api/equipment', (req, res) => {
  res.status(200).json(equipment);
});

// 2) GET equipment by category (keep before /:id)
app.get('/api/equipment/filter', (req, res) => {
  const { category } = req.query;
  if (!category) {
    return res.status(400).json({ message: 'Please provide a category, e.g. ?category=audio' });
  }
  const result = equipment.filter(
    item => item.category.toLowerCase() === String(category).toLowerCase()
  );
  res.status(200).json(result);
});

// 3) GET equipment by index
app.get('/api/equipment/:id', (req, res) => {
  const i = getIndex(req);
  if (i === -1) return res.status(404).json({ message: 'Equipment not found' });
  res.status(200).json(equipment[i]);
});

// 4) POST a new equipment item
app.post('/api/equipment', (req, res) => {
  const { name, category, brand, year, quantity } = req.body ?? {};
  const newItem = { name, category, brand, year, quantity };
  if (!isValid(newItem)) {
    return res.status(400).json({ message: 'name, category, brand (text) and year, quantity (numbers) are required' });
  }
  equipment.push(newItem);
  res.status(201).json(newItem);
});

// 5) PUT (update) equipment by index
app.put('/api/equipment/:id', (req, res) => {
  const i = getIndex(req);
  if (i === -1) return res.status(404).json({ message: 'Equipment not found' });
  const { name, category, brand, year, quantity } = req.body ?? {};
  const updated = { ...equipment[i] };
  if (name !== undefined) updated.name = name;
  if (category !== undefined) updated.category = category;
  if (brand !== undefined) updated.brand = brand;
  if (year !== undefined) updated.year = year;
  if (quantity !== undefined) updated.quantity = quantity;
  if (!isValid(updated)) {
    return res.status(400).json({ message: 'Invalid equipment data' });
  }
  equipment[i] = updated;
  res.status(200).json(updated);
});

// 6) DELETE equipment by index
app.delete('/api/equipment/:id', (req, res) => {
  const i = getIndex(req);
  if (i === -1) return res.status(404).json({ message: 'Equipment not found' });
  const [removed] = equipment.splice(i, 1);
  res.status(200).json({ message: 'Equipment deleted', deleted: removed });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '127.0.0.1', err => {
  if (err) {
    console.error(`Cannot start on port ${PORT}: ${err.message}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});