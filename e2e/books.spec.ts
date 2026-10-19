import { test, expect } from '@playwright/test';

const mockOwners = [
  {
    name: 'Jane',
    age: 23,
    books: [
      { name: 'Zebra', type: 'Hardcover' },
      { name: 'Apple', type: 'Paperback' },
    ],
  },
  { name: 'Tim', age: 10, books: [{ name: 'Moon', type: 'Hardcover' }] },
];

test.beforeEach(async ({ page }) => {
  // Mock the API so the test doesn't depend on the live service.
  await page.route('**/api/v1/bookowners', (route) => route.fulfill({ json: mockOwners }));
  await page.goto('/');
});

test('Get Books shows all books grouped by age category', async ({ page }) => {
  await page.getByRole('button', { name: 'Get Books' }).click();

  await expect(page.getByRole('heading', { name: 'Books owned by Adults' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Books owned by Children' })).toBeVisible();
  await expect(page.getByText('Apple')).toBeVisible();
});

test('Hardcover only filters books and updates headings', async ({ page }) => {
  await page.getByRole('button', { name: 'Hardcover only' }).click();

  await expect(
    page.getByRole('heading', { name: 'Hardcover Books owned by Adults' }),
  ).toBeVisible();
  await expect(page.getByText('Zebra')).toBeVisible();
  await expect(page.getByText('Apple')).toHaveCount(0);
});
