const https = require('https');
const XML = require('simple4x');

function createSoapRequest(soapData) {
  return (
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
      <soap12:Body>
        {soapData}
      </soap12:Body>
    </soap12:Envelope>
  );
}

export function soapCall(params, soapData) {
  return new Promise(function(resolve, reject) {
      var req = https.request(params, function(res) {
          if (res.statusCode < 200 || res.statusCode >= 300) {
              return reject(new Error('statusCode=' + res.statusCode));
          }
          res.on('data', data => {
            const response = new XML(data);
            resolve(response['soap:Body']);
          });
      });
      // reject on request error
      req.on('error', function(err) {
          reject(err);
      });
      if (soapData) {
        req.write(createSoapRequest(soapData).toXMLString());
      }
      req.end();
  });
}
