import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test('shazoo: открытие второй статьи по клику на её изображение', async ({ page }) => {
  await allure.step('Открываем страницу новостей', async () => {
    await page.goto('https://shazoo.ru/news');
    await page.waitForLoadState('networkidle');
  });

  await allure.step('Проверяем наличие статей', async () => {
    const articles = page.locator('div.flex.flex-col.gap-2.py-6');
    const articlesCount = await articles.count();
    expect(articlesCount).toBeGreaterThan(1);
    await allure.attachment('Found Articles Count', `${articlesCount}`, 'text/plain');
  });

  let articleTitle: string | null = '';
  
  await allure.step('Получаем информацию о второй статье', async () => {
    const secondArticle = page.locator('div.flex.flex-col.gap-2.py-6').nth(1);
    await expect(secondArticle).toBeVisible();

    const imageLink = secondArticle.locator('div.flex-shrink-0 a').first();
    const imageTitleAttr = await imageLink.getAttribute('title');
    
    const articleHeading = secondArticle.locator('h4 a').first();
    articleTitle = await articleHeading.textContent();
    
    await allure.attachment('Article Title Before Click', articleTitle || '', 'text/plain');
    await allure.attachment('Image Title Attribute', imageTitleAttr || '', 'text/plain');
    
    expect(imageTitleAttr).toBe(articleTitle?.trim());
  });

  await allure.step(`Кликаем по изображению статьи "${articleTitle}"`, async () => {
    const imageLink = page.locator('div.flex.flex-col.gap-2.py-6').nth(1).locator('div.flex-shrink-0 a').first();
    await Promise.all([
      page.waitForNavigation(),
      imageLink.click()
    ]);
  });

  await allure.step('Проверяем открытую статью', async () => {
    const openedArticleTitle = await page.locator('h1').first().textContent();
    await allure.attachment('Article Title After Click', openedArticleTitle || '', 'text/plain');
    
    expect(openedArticleTitle?.trim()).toBe(articleTitle?.trim());
    
    const articleContent = page.locator('.break-words').first();
    await expect(articleContent).toBeVisible();

    // Сохраняем скриншот открытой статьи
    const screenshot = await page.screenshot();
    await allure.attachment('Opened Article Screenshot', screenshot, 'image/png');
  });
});