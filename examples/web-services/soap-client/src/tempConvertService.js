const https = require('https');
const XML = require('simple4x');

export function fahrenheitToCelsius(temperature) {
  const options = {
    hostname: 'www.w3schools.com',
    port: 443,
    path: '/xml/tempconvert.asmx',
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml',
      'SOAPAction': 'https://www.w3schools.com/xml/FahrenheitToCelsius'
    }
  };

  const soapData = <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
      <FahrenheitToCelsius xmlns="https://www.w3schools.com/xml/">
        <Fahrenheit>{temperature}</Fahrenheit>
      </FahrenheitToCelsius>
    </soap12:Body>
  </soap12:Envelope>;

  soapCall(options, soapData, data => {
    const response = new XML(data);
    console.log('temperature is ' + response.toXMLString());
    const temperature = response['soap:Envelope']['soap:body'].FahrenheitToCelsiusResponse.FahrenheitToCelsiusResult;
    console.log('temperature is ' + temperature);
  });
}

function soapCall(options, soapData, callback) {
  const req = https.request(options, res => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
    res.on('data', data => {
      callback(data);
    });
  });
  req.on('error', e => {
    console.error(e);
    callback(null);
  });
  req.write(soapData.toXMLString());
  req.end();
}


