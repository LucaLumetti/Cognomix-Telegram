const request = require('request')
const cheerio = require('cheerio')
const json = require('./regions.json')

const BASE_URL = 'http://www.cognomix.it/mappe-dei-cognomi-italiani/'

function check_surname(surname, callback){
	let results = []
	let total = 0;

	request(`${BASE_URL}${surname}`, function (error, response, body) {
		if(response.statusCode !== 200)
			return;
		let $ = cheerio.load(body);

		$('.map-tabella > .pure-g').children().each((i,e)=>{
			$(e).children().each((j,f)=>{
				let region = json[$(f).attr('id')]
				let num = parseInt($(f).text().split('\ ')[0])
				total += num
				results.push({"region": region, "num": num, "ratio": 0})
			});
		})

		results.map((res, i)=>{
			results[i].ratio = (100*res.num/total).toFixed(2)
		})

		callback(surname, results)
	})
}

exports.check_surname = check_surname
