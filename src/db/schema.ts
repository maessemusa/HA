export const schema = {
  professionals: `
    CREATE TABLE IF NOT EXISTS professionals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      department TEXT NOT NULL,
      specialization TEXT NOT NULL,
      status TEXT NOT NULL
    )
  `,
  rooms: `
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      number TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      current_patient_id TEXT,
      current_professional_id TEXT
    )
  `,
  patients: `
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      ticket_number TEXT NOT NULL,
      department TEXT NOT NULL,
      status TEXT NOT NULL,
      room TEXT,
      professional_id TEXT,
      estimated_wait_time INTEGER
    )
  `
};