// סקריפט המרת CSV ל-JSON
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '..', 'manufacturers_models_new.csv');
const jsonPath = path.join(__dirname, '..', 'public', 'data', 'manufacturers_models.json');

// קריאת קובץ CSV
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n').slice(1); // דילוג על שורת הכותרת

const models = [];
const manufacturersSet = new Set();

lines.forEach((line) => {
  if (!line.trim()) return;
  
  // פירוק שורה CSV (טיפול במירכאות)
  const match = line.match(/(\d+),"([^"]+)","([^"]+)"/);
  
  if (match) {
    const id = parseInt(match[1]);
    let manufacturer = match[2].trim();
    const model = match[3].trim();
    
    // ניקוי BOM וסימנים מיוחדים
    manufacturer = manufacturer.replace(/^\ufeff/, '').replace(/﻿/g, '');
    
    models.push({
      id,
      manufacturer,
      model,
    });
    
    manufacturersSet.add(manufacturer);
  }
});

// יצירת רשימת יצרנים ייחודית
const manufacturers = Array.from(manufacturersSet)
  .sort((a, b) => a.localeCompare(b, 'he'))
  .map((name, index) => ({
    id: index + 1,
    name,
  }));

// יצירת אובייקט JSON
const data = {
  manufacturers,
  models,
  total_manufacturers: manufacturers.length,
  total_models: models.length,
  generated_at: new Date().toISOString(),
};

// יצירת תיקייה אם לא קיימת
const publicDataDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

// כתיבת JSON
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');

console.log('✅ המרה הושלמה בהצלחה!');
console.log(`📊 יצרנים: ${manufacturers.length}`);
console.log(`🚗 דגמים: ${models.length}`);
console.log(`📁 נשמר ב: ${jsonPath}`);

