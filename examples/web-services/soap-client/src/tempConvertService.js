const soapUtils = require('./soapUtils');

function createFahrenheitToCelsiusSoapParams() {
  return {
    hostname: 'www.w3schools.com',
    port: 443,
    path: '/xml/tempconvert.asmx',
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml',
      SOAPAction: 'https://www.w3schools.com/xml/FahrenheitToCelsius'
    }
  };
}

function createFahrenheitToCelsiusSoapData(tempFahrenheit) {
  return (
    <FahrenheitToCelsius xmlns="https://www.w3schools.com/xml/">
      <Fahrenheit>{tempFahrenheit}</Fahrenheit>
    </FahrenheitToCelsius>
  );
}

export async function fahrenheitToCelsius(tempFahrenheit) {
  let tempCelsius;
  try {
    const response = await soapUtils.soapCall(
      createFahrenheitToCelsiusSoapParams(),
      createFahrenheitToCelsiusSoapData(tempFahrenheit)
    );
    console.log("Response xml " + response);
    tempCelsius = response.FahrenheitToCelsiusResponse.FahrenheitToCelsiusResult;
  } catch(e) {
    console.log("Error " + e);
  }
  return tempCelsius;
}
