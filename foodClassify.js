var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

var visualRecognition = new VisualRecognitionV3({
  version: '2018-03-19',
  iam_apikey: 'VbjqsT-PXE3dPtTd2p0T_GL9ZK1X8Hu65IwMBylfoPMG'
});

const shit_words = ["lunch", "food table", "dessert", "meal", "buffet", "appetizer", "non-food", "snack"]
const fs = require('fs');
const good_classify = 0.6;

var imageFile = fs.createReadStream('./food images/kabab.jpg');
var classifier_ids = ["food"];

var params = {
  images_file: imageFile,
  classifier_ids: classifier_ids
};

var ingridients = [];
var json = {
	name: "",
	capacity: ""
};
visualRecognition.classify(params, function(err, response) {
  if (err)
    console.error(err);
  else {
    console.log(JSON.stringify(response, null, 2))
	curClass = response.images[0].classifiers[0].classes[0];
	json.name = curClass.class;
	if (shit_words.includes(curClass.class)){	
		json.capacity = 0;
	} else if (curClass.score > good_classify) {
					json.capacity = 1;
				} else {
					json.capacity = 0;
				}
	// for (i = 0; i < response.images.length; i++) { 
	// 	for (j = 0; j < response.images[i].classifiers.length; j++) {
	// 		for (m = 0; m < response.images[i].classifiers[j].classes.length; m++){
	// 			curClass = response.images[i].classifiers[j].classes[m]
				
	// 			if (shit_words.includes(curClass.class)) {
	// 				continue;
	// 			} else if (curClass.score > good_classify) {
	// 				ingridients.push(curClass.class);
	// 				json.name = curClass.class;
	// 				json.capacity = 1;
	// 			}
	// 		}
	// 	}
	// }
	// ingridients = response;
	 console.log(json);
	postData(json);
}});


function postData(obj) {
	const http = require('http');
	const data = JSON.stringify(obj);
const options = {
	hostname: 'localhost',
	port: '8080',
	path: '/food',
	method: 'post',
	headers: {
		'Content-Type': 'application/json',
		'Content-Length': data.length
	}
}
const req = http.request(options, (res) => {
	console.log(`statusCode: ${res.statusCode}`)
	res.on('data', (d) => {
		process.stdout.write(d);
	})
})

req.on('error', (error) => {
	console.error(error);
})
req.write(data);
req.end();

}
