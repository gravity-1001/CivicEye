// Maps event category + zone to the correct department
// Falls back to a general/default department if no exact match found

const Department = require('../models/Department');

async function routeEventToDepartment(category, zone) {
  const department = await Department.findOne({
    categories: category,
    zones: zone
  });

  if (department) return department;

  // fallback: match category only, ignore zone
  const fallback = await Department.findOne({ categories: category });
  return fallback || null;
}

module.exports = { routeEventToDepartment };