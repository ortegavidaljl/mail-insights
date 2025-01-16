# Mail Insights

This is the repo for Mail Insights, a project developed in PHP and JavaScript that brings together a variety of tools to check the deliverability of emails, verify the existence of accounts, perform DNS queries and detect if an IP is on a blacklist (RBL), among other things.

This project consists of a VueJS frontend and a Laravel backend. Due to the complexity of some tools, such as X-ray, some dependencies may need to be installed. Please keep reading to know the tools integrated so far and their peculiarities.

All contributions are welcomed.

## Tools

- **X-Ray**: A a tool written in Python that analyses an incoming email and generates a complete report, including information about sender authentication, server configuration and RBL listing, among other useful things. Mail Insights is capable of create random emails for users to send mails and show the generated report in a nice way.
  - Repo: https://github.com/ortegavidaljl/x-ray
 
- **Presence**: A tool that checks if an email account exists.

- **Me**: A tool that shows your IPv4/v6 and gets some info about them through RDAP.

- **Lookup**: A tool that shows the RDAP data of a domain, IP or ASN.
 
- [Future] **RBL**: A tool to check if an IP is blacklisted.

- [Future] **Query**: A tool to check DNS records on multiple servers at once to verify their information or approximate propagation status.


## Acknowledgements and Licenses

This project wouldn't be possible without these amazing packages :heart: :

- ipaddr.js
  - License: [MIT](https://github.com/whitequark/ipaddr.js/blob/main/LICENSE)
  - Repo: https://github.com/whitequark/ipaddr.js

- punycode.js
  - License: [MIT](https://github.com/mathiasbynens/punycode.js/blob/main/LICENSE-MIT.txt)
  - Repo: https://github.com/mathiasbynens/punycode.js

- uuid
  - License: [MIT](https://github.com/uuidjs/uuid/blob/main/LICENSE.md)
  - Repo: https://github.com/uuidjs/uuid

- client.rdap.org
  - License: [MIT](https://github.com/rdap-org/client.rdap.org/blob/master/LICENSE)
  - Repo: https://github.com/rdap-org/client.rdap.org

- PHPMailer
  - License: [LGPL-2.1](https://github.com/PHPMailer/PHPMailer/blob/master/LICENSE)
  - Repo: https://github.com/PHPMailer/PHPMailer  