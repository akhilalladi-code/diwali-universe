import { expect, test } from '@playwright/test'

test('home page renders and primary navigation works', async ({ page }) => {
  await page.goto('/diwali-universe/')
  await expect(page.getByRole('heading', { name: /some nights/i })).toBeVisible()
  await page.getByRole('button', { name: /light a diya/i }).first().click()
  await expect(page.getByRole('heading', { name: /one flame at a time/i })).toBeVisible()
})

test('diya ritual supports individual lighting, all-on and reset', async ({ page }) => {
  await page.goto('/diwali-universe/#celebrate')
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
  await page.goto('/diwali-universe/#wishes')
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
  await page.goto('/diwali-universe/')
  await page.getByRole('button', { name: /toggle menu/i }).click()
  await page.getByRole('button', { name: /toggle night mode/i }).click()
  const nav = page.getByRole('navigation', { name: /main navigation/i })
  await expect(nav).toBeVisible()
  await expect(nav).toHaveCSS('background-color', 'rgb(48, 35, 43)')
  await expect(nav.getByRole('button', { name: 'Little Lights' })).toBeVisible()
})

test('reduced-motion preference disables fireworks animation controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/diwali-universe/#celebrate')
  await expect(page.getByRole('button', { name: /a little sparkle/i })).toBeDisabled()
  await expect(page.getByRole('button', { name: /keep them coming/i })).toBeDisabled()
  await expect(page.getByText(/paused because your device prefers reduced motion/i)).toBeVisible()
})


test('light and dark themes retain readable brand and navigation contrast', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/diwali-universe/')
  const brand = page.locator('.wordmark span')
  const homeNav = page.getByRole('navigation', { name: /main navigation/i }).getByRole('button', { name: 'Home' })

  await expect(brand).toHaveCSS('color', 'rgb(48, 24, 15)')
  await expect(homeNav).toHaveAttribute('aria-current', 'page')
  await page.getByRole('button', { name: /toggle night mode/i }).click()

  await expect(brand).toHaveCSS('color', 'rgb(255, 241, 223)')
  await expect(homeNav).toHaveCSS('color', 'rgb(255, 180, 203)')
  await expect(page.locator('.reference-ideas')).toHaveCSS('background-color', 'rgb(36, 27, 32)')
  await expect(page.locator('.reference-project-card.plum')).toHaveCSS('background-color', 'rgb(97, 36, 63)')

  await page.getByRole('button', { name: /toggle night mode/i }).click()
  await expect(brand).toHaveCSS('color', 'rgb(48, 24, 15)')
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 244, 232)')
})

test('dark theme remains usable on narrow mobile screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/diwali-universe/')
  await page.getByRole('button', { name: /toggle night mode/i }).click()
  await page.getByRole('button', { name: /toggle menu/i }).click()

  const nav = page.getByRole('navigation', { name: /main navigation/i })
  await expect(nav).toBeVisible()
  await expect(nav.getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
  await expect(nav).toHaveCSS('background-color', 'rgb(48, 35, 43)')
  await expect(page.locator('.reference-shortcuts')).toBeVisible()
  await expect(page.locator('.reference-project-card')).toHaveCount(4)
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }))
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport)
})

test('dark theme shortcut and project cards expose visible keyboard focus', async ({ page }) => {
  await page.goto('/diwali-universe/')
  await page.getByRole('button', { name: /toggle night mode/i }).click()
  const shortcut = page.locator('.reference-shortcut').first()
  await shortcut.evaluate((element) => (element as HTMLElement).focus({ focusVisible: true }))
  await expect(shortcut).toBeFocused()
  await expect(shortcut).toHaveCSS('outline-style', 'solid')
  const project = page.locator('.reference-project-card').first()
  await project.evaluate((element) => (element as HTMLElement).focus({ focusVisible: true }))
  await expect(project).toBeFocused()
  await expect(project).toHaveCSS('outline-style', 'solid')
})
