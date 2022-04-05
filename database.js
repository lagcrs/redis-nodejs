const redis = require('redis');

const client = redis.createClient({
	host: '127.0.0.1',
	port: 6379
});
client.connect();
client.on('connect', () => console.log('Redis On'));

module.exports = client;