import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateProjectEstimate,
  convertEstimateToQuoteItems,
  createDefaultPricingInput,
} from './pricingEngine';

test('default showcase estimate computes expected baseline and reconciles milestones', () => {
  const input = createDefaultPricingInput('showcase', 'DZD');
  const result = calculateProjectEstimate(input);

  assert.equal(result.selectedTotal, 58500);
  assert.equal(result.designTierPrices.template, 48500);
  assert.equal(result.designTierPrices.custom, 58500);
  assert.equal(result.designTierPrices.premium, 75000);
  assert.equal(
    result.milestones.start + result.milestones.mid + result.milestones.end,
    result.selectedTotal
  );
  assert.ok(result.minRange < result.selectedTotal);
  assert.ok(result.maxRange > result.selectedTotal);
});

test('urgency, client type, and multi-language multipliers scale total accurately', () => {
  const base = createDefaultPricingInput('landing', 'DZD');
  const baseResult = calculateProjectEstimate(base);

  const scaled = {
    ...base,
    urgency: 'rush' as const,       // +25%
    clientType: 'enterprise' as const, // +35%
    languages: 2 as const,          // +30%
  };
  const scaledResult = calculateProjectEstimate(scaled);

  assert.ok(scaledResult.selectedTotal > baseResult.selectedTotal * 2);
  assert.equal(
    scaledResult.milestones.start + scaledResult.milestones.mid + scaledResult.milestones.end,
    scaledResult.selectedTotal
  );
});

test('extra pages and toggled features update base subtotal and timeline', () => {
  const input = createDefaultPricingInput('ecommerce', 'USD');
  const first = calculateProjectEstimate(input);

  const expanded = {
    ...input,
    extraPages: 4,
    selectedFeatures: [...input.selectedFeatures, 'epayment', 'analytics-reports'],
  };
  const second = calculateProjectEstimate(expanded);

  assert.ok(second.selectedTotal > first.selectedTotal);
  assert.ok(second.totalWeight > first.totalWeight);
});

test('convertEstimateToQuoteItems produces items matching selectedTotal plus hosting', () => {
  const input = {
    ...createDefaultPricingInput('saas', 'EUR'),
    hostingAnnual: 120,
  };
  const result = calculateProjectEstimate(input);
  const items = convertEstimateToQuoteItems(input, result, 'en');

  const itemsSum = items.reduce((acc, item) => acc + item.total, 0);
  assert.equal(itemsSum, result.selectedTotal + input.hostingAnnual);
  assert.equal(items.length, 3);
});
