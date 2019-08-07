var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

var visualRecognition = new VisualRecognitionV3({
  version: '2018-03-19',
  iam_apikey: 'VbjqsT-PXE3dPtTd2p0T_GL9ZK1X8Hu65IwMBylfoPMG'
});

const shit_words = ["lunch", "food table", "dessert", "meal", "buffet", "appetizer", "non-food", "snack"]
const fs = require('fs');
const good_classify = 0.6;

var imageFile = fs.createReadStream('C://Users/avivb/Desktop/Food/Shit/test5.jpeg');
var classifier_ids = ["food"];

var params = {
  images_file: imageFile,
  classifier_ids: classifier_ids
};

var ingridients = [];

visualRecognition.classify(params, function(err, response) {
  if (err)
    console.log(err);
  else {
    console.log(JSON.stringify(response, null, 2))
	
	for (i = 0; i < response.images.length; i++) { 
		for (j = 0; j < response.images[i].classifiers.length; j++) {
			for (m = 0; m < response.images[i].classifiers[j].classes.length; m++){
				curClass = response.images[i].classifiers[j].classes[m]
				
				if (shit_words.includes(curClass.class)) {
					continue;
				} else if (curClass.score > good_classify) {
					ingridients.push(curClass.class)
				}
			}
		}
	}
	
	console.log(ingridients)
}});


var xhr = new XMLHttpRequest();
xhr.open("POST", "localhost:21446/api/food", true);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify({
    ingridients: ingridients
}));