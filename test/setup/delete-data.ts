import { readFileSync } from 'fs'
import { join } from 'path'

import AppDataSource from '../../src/config/typeorm.config'

async function deleteData() {
  try {
    await AppDataSource.initialize()
    console.log('Database connected')

    const sqlFilePath = join(__dirname, 'data-teardown.sql')
    const sql = readFileSync(sqlFilePath, 'utf-8')

    await AppDataSource.query(sql)

    console.log('SQL test data deleted successfully')
  } catch (error) {
    console.error('Error during SQL seeding:', error)
  } finally {
    await AppDataSource.destroy()
  }
}

deleteData()
