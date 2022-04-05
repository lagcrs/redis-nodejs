const axios = require('axios');
const express = require('express');
const client = require('./database');

const routes = express.Router();

routes.get('/shoes', (req, res) => {
	const searchTerm = req.query.search;

	try {
		client.get(searchTerm, async (err, shoes) => {
			if (err) throw err;

			if (shoes) {
				res.status(200).send({
					shoes: JSON.parse(shoes),
					message: `Pegou busca: ${shoes} do redis!`
				})
			} else {
				const shoes = await axios.get(`https://www.netshoes.com.br/busca?q=${searchTerm}`);
				client.set(searchTerm, shoes);
				client.expire(searchTerm, 10);

				res.status(200).send({
					shoes: shoes.data,
					message: 'Não tinha no redis'
				})
			}
		})
	} catch {
		res.status(500).send({
			message: 'Deu ruim'
		});
	}
});

module.exports = routes;