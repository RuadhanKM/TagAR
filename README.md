# TagAR
TagAR is a platform for creating real-time collaborative graffiti art, offering a creative outlet for those who might otherwise consider unauthorized expression. This alternative aims to save costs associated with unauthorized graffiti.

To clone locally on windows, type these commands (you will need git and node installed)
```
git clone https://github.com/RuadhanKM/TagAR.git
cd TagAR
npm i
```
---
You will then need to create a dotenv file that defines an address, a ssl private key, and a ssl certificate as follows
```
# TagAR/.env
ADDR=[IPV4 Address]
SSL_PRIVATE_KEY=[Private Key]
SSL_CERT=[Certificate]
```
- The IPV4 Address is the address the web server will be running on
- The private key and certificate must include a PEM format prefix and suffix (ie. `-----BEGIN CERTIFICATE-----`, `-----END PRIVATE KEY-----`, ect.) It must also be on one line and have the line breaks replaced with an explicit `\n`
---
Finally you can run :
```
npm run compile
npm run deploy
```
To run the server. You will see a link to the web page in the console