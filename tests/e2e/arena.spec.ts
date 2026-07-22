import { test, expect } from '@playwright/test'

test('a learner can run, switch, and share a challenge', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Make every match count.' })).toBeVisible()
  await page.getByLabel('Pattern').fill('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$')
  await page.getByRole('button', { name: 'Run challenge' }).click()
  await expect(page.getByText('Evaluation complete')).toBeVisible()
  await page.getByRole('button', { name: /Hex Color/ }).click()
  await expect(page.getByRole('heading', { name: 'Hex Color' })).toBeVisible()
  await page.getByRole('button', { name: 'Share challenge' }).click()
  await expect(page).toHaveURL(/#challenge=/)
})

test('invalid regex gives a recoverable error', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Pattern').fill('[')
  await page.getByRole('button', { name: 'Run challenge' }).click()
  await expect(page.getByText('Fix the pattern and try again.')).toBeVisible()
})

test('keyboard users can choose a challenge and save a local score', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Hex Color/ }).focus()
  await page.keyboard.press('Enter')
  await page.getByLabel('Pattern').fill('^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$')
  await page.getByRole('button', { name: 'Run challenge' }).click()
  await page.getByRole('button', { name: 'Save score' }).click()
  await expect(page.getByText('Saved to this browser’s local leaderboard.')).toBeVisible()
})
