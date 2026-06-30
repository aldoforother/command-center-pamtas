/**
 * Test Fixtures
 * Shared test data and configuration
 */

export const TEST_USERS = {
  admin: {
    email: process.env.E2E_ADMIN_EMAIL || 'admin@test.com',
    password: process.env.E2E_ADMIN_PASSWORD || 'password123',
    role: 'admin',
  },
  operator: {
    email: process.env.E2E_OPERATOR_EMAIL || 'operator@test.com',
    password: process.env.E2E_OPERATOR_PASSWORD || 'password123',
    role: 'operator',
  },
  viewer: {
    email: process.env.E2E_VIEWER_EMAIL || 'viewer@test.com',
    password: process.env.E2E_VIEWER_PASSWORD || 'password123',
    role: 'viewer',
  },
}

export const TEST_POS_IDS = [
  'KOTIS',
  'KT',
  'POS-01',
  'POS-02',
  'POS-03',
  'POS-04',
  'POS-05',
  'POS-06',
  'POS-07',
  'POS-08',
  'POS-09',
  'POS-10',
  'POS-11',
  'POS-12',
  'POS-13',
  'POS-14',
  'POS-15',
  'POS-16',
  'POS-17',
]

export const KERAWANAN_CATEGORIES = [
  'PELANGGARAN BATAS',
  'PERKARA SIAGA',
  'ANTISIPASI',
  'LAINNYA',
]

export const BINTER_TYPES = [
  'SOSIALISASI',
  'PEMANTAPAN',
  'PENGAWASAN',
  'PENINJAUAN',
  'PENYERAHAN',
]

export const TEST_TIMEOUTS = {
  pageLoad: 30000,
  elementVisible: 10000,
  navigation: 15000,
  animation: 2000,
}
