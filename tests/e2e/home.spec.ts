import { test, expect } from '@playwright/test';

test('loads landing page and mock data', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'AppGeoAnaliza' })).toBeVisible();
  await page.getByRole('button', { name: 'Find Places' }).click();
  await expect(page.getByText('Mercado de Triana')).toBeVisible();
});
