import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import faker from'faker/locale/vi';

var FCM = require('fcm-push');

var serverKey = 'AAAAtnapCd0:APA91bEytla5I1Yu5wdItlpcMkbAFRhy7QfM5O_ONZq_U2DL_BZHPibQ8-1V_zlnSNUf7xGKV5qyyXeevgFWDpXUxJ74XlVlnXjUnICufmJpeQ_JxLU4RkZ20YDhC6nLbNXq7dRMqCqj';

var fcm = new FCM(serverKey);
var registrationToken = 'dVL7rY__5AA:APA91bFs2TZbZJPE9IGQoBGVLhBmFlnCHts7TgvWCC6L7QwFzveQ_SFuh-OEnRcFvGcbUKxOlLgXZ7jsWw662uBi-FPa7-bp_KUhDK7V6SqLHe-z3NOsA4GI1bRo-LdAWh20uGQRp9iU';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.get('/pushNoti',(req, res) => {
		var message = {
			to: registrationToken, // required fill with device token or topics
			collapse_key: 'your_collapse_key', 
			data: {
				noti: 'Hello'
			},
			notification: {
				title: req.param('title'),
				body: req.param('body'),
				sound: "default",

			},
				ttl: "86400s",	
		
		};

		fcm.send(message, function(err, response){
			if (err) {
				console.log("Something has gone wrong!");
			} else {
				console.log("Successfully sent with response: ", response);
			}
		});
		res.json({ message: 'ok' });
	})

	return api;
}
