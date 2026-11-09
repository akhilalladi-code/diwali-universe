import { expect, test } from '@playwright/test'

test('home page renders and primary navigation works', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /some nights/i })).toBeVisible()
  await page.getByRole('button', { name: /light a diya/i }).first().click()
  await expect(page.getByRole('heading', { name: /one flame at a time/i })).toBeVisible()
})

test('diya ritual supports individual lighting, all-on and reset', async ({ page }) => {
  await page.goto('/#celebrate')
  const familyDiya = page.getByRole('button', { name: /for family/i })
  await expect(familyDiya).toHaveAttribute('aria-pressed', 'false')
  await familyDiya.click()
  await expect(familyDiya).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: /light them all/i }).click()
  await expect(page.getByText(/all five are glowing/i)).toBeVisible()
  await page.getByRole('button', { name: /reset diyas/i }).click()
  await expect(page.getByText(/0 of 5 diyas are glowing/i)).toBeVisible()
})

test('greeting preview fallback can be copied and a generated greeting exported', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/#wishes')
  await page.getByRole('button', { name: /copy this little note/i }).click()
  const initialCopy = await page.evaluate(() => navigator.clipboard.readText())
  expect(initialCopy).toContain('May there be warmth around your table')
  await page.getByLabel(/who are you thinking of/i).fill('Arjun')
  await page.getByRole('button', { name: /write my note/i }).click()
  await expect(page.getByText(/thinking of you this diwali, arjun/i)).toBeVisible()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /export as png/i }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/diwali-greeting-arjun\.png/)
})

test('mobile navigation remains readable in dark mode', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: /toggle menu/i }).click()
  await page.getByRole('button', { name: /toggle night mode/i }).click()
  const nav = page.getByRole('navigation', { name: /main navigation/i })
  await expect(nav).toBeVisible()
  await expect(nav).toHaveCSS('background-color', 'rgb(33, 26, 32)')
  await expect(nav.getByRole('button', { name: 'Little Lights' })).toBeVisible()
})

test('reduced-motion preference disables fireworks animation controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#celebrate')
  await expect(page.getByRole('button', { name: /a little sparkle/i })).toBeDisabled()
  await expect(page.getByRole('button', { name: /keep them coming/i })).toBeDisabled()
  await expect(page.getByText(/paused because your device prefers reduced motion/i)).toBeVisible()
})
