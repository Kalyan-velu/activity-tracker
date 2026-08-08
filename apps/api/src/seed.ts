import { pool } from './db/index.js'

function formatEmpCode(num: number): string {
  return `TSCS_${String(num).padStart(4, '0')}`
}

async function seed() {
  const client = await pool.connect()

  try {
    console.log('Starting database seeding...')

    await client.query('BEGIN')

    // Truncate tables cleanly for fresh seed
    console.log('Cleaning existing data...')
    await client.query('ALTER SEQUENCE user_emp_code_seq RESTART WITH 1;')
    await client.query('TRUNCATE TABLE activities, users, designations, roles RESTART IDENTITY CASCADE;')

    // Insert Roles
    console.log('Seeding Roles...')
    const rolesRes = await client.query(`
      INSERT INTO roles (name)
      VALUES ('Admin'), ('Manager'), ('Developer')
      RETURNING id, name;
    `)
    const roles = rolesRes.rows
    console.log('Seeded Roles:', roles)

    // Insert Designations
    console.log('Seeding Designations...')
    const desigRes = await client.query(`
      INSERT INTO designations (name)
      VALUES ('Engineering Lead'), ('Senior Software Engineer'), ('Product Manager')
      RETURNING id, name;
    `)
    const designations = desigRes.rows
    console.log('Seeded Designations:', designations)

    // Insert Users with emp_code and password
    console.log('Seeding Users...')
    const adminRole = roles.find((r) => r.name === 'Admin')?.id
    const devRole = roles.find((r) => r.name === 'Developer')?.id
    const mgrRole = roles.find((r) => r.name === 'Manager')?.id

    const leadDesig = designations.find((d) => d.name === 'Engineering Lead')?.id
    const srDesig = designations.find((d) => d.name === 'Senior Software Engineer')?.id
    const pmDesig = designations.find((d) => d.name === 'Product Manager')?.id

    const defaultPassword = '$2a$10$e8w8G8Q9.DefaultSeededPasswordHash'

    const usersRes = await client.query(
      `
      INSERT INTO users (emp_code, name, password, role_id, designation_id)
      VALUES 
        ($1, $2, $3, $4, $5),
        ($6, $7, $8, $9, $10),
        ($11, $12, $13, $14, $15)
      RETURNING id, emp_code, name, role_id, designation_id;
    `,
      [
        formatEmpCode(1), 'Alice Smith', defaultPassword, adminRole, leadDesig,
        formatEmpCode(2), 'Bob Jones', defaultPassword, devRole, srDesig,
        formatEmpCode(3), 'Charlie Brown', defaultPassword, mgrRole, pmDesig,
      ]
    )
    const users = usersRes.rows
    console.log('Seeded Users:', users)

    // Insert Activities
    console.log('Seeding Activities...')
    const activitiesRes = await client.query(
      `
      INSERT INTO activities (task, user_id)
      VALUES 
        ($1, $2),
        ($3, $4),
        ($5, $6),
        ($7, $8)
      RETURNING id, task, user_id;
    `,
      [
        'Setup PostgreSQL database container & configuration', users[0].id,
        'Implement seed script using node-postgres pg driver', users[0].id,
        'Build REST API endpoints using Hono framework', users[1].id,
        'Review architecture and user permissions', users[2].id,
      ]
    )
    console.log('Seeded Activities:', activitiesRes.rows)

    await client.query('COMMIT')
    console.log('Database seeding completed successfully!')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Error seeding database:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

seed()
