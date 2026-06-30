# E2E Tests — Command Center PAMTAS

End-to-end tests using Playwright for the Command Center PAMTAS dashboard.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install chromium
   ```

3. **Set up environment variables (optional):**
   Create a `.env` file or set environment variables:
   ```bash
   export E2E_ADMIN_EMAIL=your-admin-email@test.com
   export E2E_ADMIN_PASSWORD=your-password
   export E2E_OPERATOR_EMAIL=your-operator-email@test.com
   export E2E_OPERATOR_PASSWORD=your-password
   export E2E_VIEWER_EMAIL=your-viewer-email@test.com
   export E2E_VIEWER_PASSWORD=your-password
   ```

## Running Tests

### Run all tests:
```bash
npm run test:e2e
```

### Run specific test file:
```bash
npx playwright test auth.spec.js
```

### Run tests with UI:
```bash
npx playwright test --ui
```

### Run tests in headed mode:
```bash
npx playwright test --headed
```

### Run tests with debug:
```bash
npx playwright test --debug
```

### Run specific test by name:
```bash
npx playwright test -g "should display login page"
```

## Test Structure

```
e2e/
├── fixtures/           # Test data and configuration
│   └── auth.js        # User credentials and test constants
├── pages/             # Page Object Models
│   ├── BasePage.js    # Base class with common methods
│   ├── LoginPage.js   # Login page object
│   ├── HomePage.js    # Home page object
│   ├── OverviewPage.js
│   ├── InsidenPage.js
│   ├── BinterPage.js
│   ├── PosDetailPage.js
│   ├── AdminPage.js
│   ├── PanduanPage.js
│   └── LaporanPages.js
├── auth.spec.js       # Authentication tests
├── home.spec.js       # Home page tests
├── overview.spec.js   # Overview page tests
├── insiden.spec.js    # Insiden page tests
├── binter.spec.js     # Binter page tests
├── pos-detail.spec.js # POS detail page tests
├── admin.spec.js      # Admin page tests
├── panduan.spec.js    # Panduan page tests
├── laporan.spec.js    # Laporan pages tests
└── smoke.spec.js      # Smoke tests for critical flows
```

## Page Objects

Each page has a corresponding Page Object class with:
- **Selectors**: Getters for UI elements
- **Actions**: Methods for user interactions
- **Assertions**: Methods for verification

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `E2E_ADMIN_EMAIL` | Admin user email | Yes |
| `E2E_ADMIN_PASSWORD` | Admin user password | Yes |
| `E2E_OPERATOR_EMAIL` | Operator user email | For role tests |
| `E2E_OPERATOR_PASSWORD` | Operator user password | For role tests |
| `E2E_VIEWER_EMAIL` | Viewer user email | For role tests |
| `E2E_VIEWER_PASSWORD` | Viewer user password | For role tests |

## Test Categories

- **Auth**: Login/logout, validation, access control
- **Home**: Hero section, stats, navigation
- **Overview**: Map, metrics, panels
- **Insiden**: List, filters, detail panel, PDF export
- **Binter**: List, filters, detail panel, PDF export
- **POS Detail**: Tab navigation, content sections
- **Admin**: User CRUD, role filtering, validation
- **Panduan**: Tabbed guide content
- **Laporan**: Chart, timeline, tables
- **Smoke**: Critical user flows, error handling, accessibility

## CI/CD

The Playwright config is set up for CI:
- Tests run in parallel
- Failed tests are retried twice
- Screenshots and videos captured on failure
- HTML report generated

## Troubleshooting

### Tests fail due to authentication
- Ensure environment variables are set with valid credentials
- Check that the dev server is running

### Tests timeout
- Increase timeout values in `playwright.config.js`
- Check network connectivity

### Browser not found
- Run `npx playwright install chromium`
- On Windows: run `npx playwright install-deps chromium`
