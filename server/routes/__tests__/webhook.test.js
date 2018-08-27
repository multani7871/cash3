// const axios = require('axios');

// async function testWebhook() {
//   try {
//     const response = await axios.post('http://localhost:5000/api/plaidWebHook', {
//       webhook_type: 'TRANSACTIONS',
//       webhook_code: 'INITIAL_UPDATE',
//       // webhook_code: 'HISTORICAL_UPDATE',
//       item_id: 'zLjJ3KQBArTkmgzBWJ6aFJgJzBz6ldco5GlLg',
//       error: null,
//       new_transactions: 19,
//     });
//     console.log(JSON.stringify(response.data));
//   } catch (error) {
//     console.log(error);
//   }
// }
// testWebhook();

test('stub', () => {
  expect(1).toEqual(1);
});
