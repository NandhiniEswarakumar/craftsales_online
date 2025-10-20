const cartController = require('./cartController');

test('add item to cart', () => {
  const cart = [];
  const item = { id: 1, name: 'Test Item' };
  cartController.addItem(cart, item);
  expect(cart).toContain(item);
});

test('remove item from cart', () => {
  const cart = [{ id: 1, name: 'Test Item' }];
  cartController.removeItem(cart, 1);
  expect(cart).not.toContainEqual({ id: 1, name: 'Test Item' });
});