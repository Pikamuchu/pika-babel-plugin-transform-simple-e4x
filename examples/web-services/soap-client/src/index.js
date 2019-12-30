const service = require('./tempConvertService');

service.fahrenheitToCelsius(32).then(temperature => console.log('temperature is ' + temperature));
