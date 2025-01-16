import ipaddr from 'ipaddr.js'
import punycode from 'punycode/'
import { useMainStore } from '@/stores/main'

export const rdapStatusInfo = {
  "validated": "Signifies that the data of the object instance has been found to be accurate. This type of status is usually found on entity object instances to note the validity of identifying contact information.",
  "renew prohibited": "Renewal or reregistration of the object instance is forbidden.",
  "update prohibited": "Updates to the object instance are forbidden.",
  "transfer prohibited": "Transfers of the registration from one registrar to another are forbidden. This type of status normally applies to DNR domain names.",
  "delete prohibited": "Deletion of the registration of the object instance is forbidden. This type of status normally applies to DNR domain names.",
  "proxy": "The registration of the object instance has been performed by a third party. This is most commonly applied to entities.",
  "private": "The information of the object instance is not designated for public consumption. This is most commonly applied to entities.",
  "removed": "Some of the information of the object instance has not been made available and has been removed. This is most commonly applied to entities.",
  "obscured": "Some of the information of the object instance has been altered for the purposes of not readily revealing the actual information of the object instance. This is most commonly applied to entities.",
  "associated": "The object instance is associated with other object instances in the registry. This is most commonly used to signify that a nameserver is associated with a domain or that an entity is associated with a network resource or domain.",
  "active": "The object instance is in use. For domain names, it signifies that the domain name is published in DNS. For network and autnum registrations it signifies that they are allocated or assigned for use in operational networks. This maps to the Extensible Provisioning Protocol (EPP) [RFC5730] 'OK' status.",
  "inactive": "The object instance is not in use. See 'active'.",
  "locked": "Changes to the object instance cannot be made, including the association of other object instances.",
  "pending create": "A request has been received for the creation of the object instance but this action is not yet complete.",
  "pending renew": "A request has been received for the renewal of the object instance but this action is not yet complete.",
  "pending transfer": "A request has been received for the transfer of the object instance but this action is not yet complete.",
  "pending update": "A request has been received for the update or modification of the object instance but this action is not yet complete.",
  "pending delete": "A request has been received for the deletion or removal of the object instance but this action is not yet complete. For domains, this might mean that the name is no longer published in DNS but has not yet been purged from the registry database.",
  "add period": "This grace period is provided after the initial registration of the object. If the object is deleted by the client during this period, the server provides a credit to the client for the cost of the registration. This maps to the Domain Registry Grace Period Mapping for the Extensible Provisioning Protocol (EPP) [RFC3915] 'addPeriod' status.",
  "auto renew period": "This grace period is provided after an object registration period expires and is extended (renewed) automatically by the server. If the object is deleted by the client during this period, the server provides a credit to the client for the cost of the auto renewal. This maps to the Domain Registry Grace Period Mapping for the Extensible Provisioning Protocol (EPP) [RFC3915] 'autoRenewPeriod' status.",
  "client delete prohibited": "The client requested that requests to delete the object MUST be rejected. This maps to the Extensible Provisioning Protocol (EPP) Domain Name Mapping [RFC5731], Extensible Provisioning Protocol (EPP) Host Mapping [RFC5732], and Extensible Provisioning Protocol (EPP) Contact Mapping [RFC5733] 'clientDeleteProhibited' status.",
  "client hold": "The client requested that the DNS delegation information MUST NOT be published for the object. This maps to the Extensible Provisioning Protocol (EPP) Domain Name Mapping [RFC5731] 'clientHold' status.",
  "client renew prohibited": "The client requested that requests to renew the object MUST be rejected. This maps to the Extensible Provisioning Protocol (EPP) Domain Name Mapping [RFC5731] 'clientRenewProhibited' status.",
  "client transfer prohibited": "The client requested that requests to transfer the object MUST be rejected. This maps to the Extensible Provisioning Protocol (EPP) Domain Name Mapping [RFC5731] and Extensible Provisioning Protocol (EPP) Contact Mapping [RFC5733] 'clientTransferProhibited' status.",
  "client update prohibited": "The client requested that requests to update the object (other than to remove this status) MUST be rejected. This maps to the Extensible Provisioning Protocol (EPP) Domain Name Mapping [RFC5731], Extensible Provisioning Protocol (EPP) Host Mapping [RFC5732], and Extensible Provisioning Protocol (EPP) Contact Mapping [RFC5733] 'clientUpdateProhibited' status.",
  "pending restore": "An object is in the process of being restored after being in the redemption period state. This maps to the Domain Registry Grace Period Mapping for the Extensible Provisioning Protocol (EPP) [RFC3915] 'pendingRestore' status.",
  "redemption period": "A delete has been received, but the object has not yet been purged because an opportunity exists to restore the object and abort the deletion process. This maps to the Domain Registry Grace Period Mapping for the Extensible Provisioning Protocol (EPP) [RFC3915] 'redemptionPeriod' status.",
  "renew period": "This grace period is provided after an object registration period is explicitly extended (renewed) by the client. If the object is deleted by the client during this period, the server provides a credit to the client for the cost of the renewal. This maps to the Domain Registry Grace Period Mapping for the Extensible Provisioning Protocol (EPP) [RFC3915] 'renewPeriod' status.",
  "server delete prohibited": "The server set the status so that requests to delete the object MUST be rejected. This maps to the Extensible Provisioning Protocol (EPP) Domain Name Mapping [RFC5731], Extensible Provisioning Protocol (EPP) Host Mapping [RFC5732], and Extensible Provisioning Protocol (EPP) Contact Mapping [RFC5733] 'serverDeleteProhibited' status.",
  "server renew prohibited": "The server set the status so that requests to renew the object MUST be rejected. This maps to the Extensible Provisioning Protocol (EPP) Domain Name Mapping [RFC5731] 'serverRenewProhibited' status.",
  "server transfer prohibited": "The server set the status so that requests to transfer the object MUST be rejected. This maps to the Extensible Provisioning Protocol (EPP) Domain Name Mapping [RFC5731] and Extensible Provisioning Protocol (EPP) Contact Mapping [RFC5733] 'serverTransferProhibited' status.",
  "server update prohibited": "The server set the status so that requests to update the object (other than to remove this status) MUST be rejected. This maps to the Extensible Provisioning Protocol (EPP) Domain Name Mapping [RFC5731], Extensible Provisioning Protocol (EPP) Host Mapping [RFC5732], and Extensible Provisioning Protocol (EPP) Contact Mapping [RFC5733] 'serverUpdateProhibited' status.",
  "server hold": "The server set the status so that DNS delegation information MUST NOT be published for the object. This maps to the Extensible Provisioning Protocol (EPP) Domain Name Mapping [RFC5731] 'serverHold' status.",
  "transfer period": "This grace period is provided after the successful transfer of object registration sponsorship from one client to another client. If the object is deleted by the client during this period, the server provides a credit to the client for the cost of the transfer. This maps to the Domain Registry Grace Period Mapping for the Extensible Provisioning Protocol (EPP) [RFC3915] 'transferPeriod' status."
};

// list of RDAP bootstrap registry URLs
var registryURLs = {
  "autnum": "https://data.iana.org/rdap/asn.json",
  "domain": "https://data.iana.org/rdap/dns.json",
  "ip4": "https://data.iana.org/rdap/ipv4.json",
  "ip6": "https://data.iana.org/rdap/ipv6.json",
  "entity": "https://data.iana.org/rdap/object-tags.json",
};

const store = useMainStore()

export async function query(string, follow) {

  let type = guessType(string)

  if(Object.keys(store.RDAPregistryData).length === 0){
    await loadRegistries();
  }

  let object = string.toLowerCase()

  if ('autnum' == type) {
    object = object.replace(/^asn?/i, '');
  }

  let queryParams = '?jscard=1';
  let url;

  switch (type) {
    case 'url':
      url = object;
      break;
    case 'tld':
      url = `https://rdap.iana.org/domain/${object}${queryParams}`;
      break;
    case 'registrar':
      url = `https://registrars.rdap.org/entity/${object}-IANA${queryParams}`;
      break;
    default:
      url = getRDAPURL(type, object);
      if (url) url += queryParams;
      break;
  }

  if (!url) {
    console.log('No RDAP URL available for ' + type + ' ' + object + '.')
    return
  }

  return sendQuery(url, follow);
}

function getRDAPURL(type, object) {
  for (const service of store.RDAPregistryData[type]) {
    const [rangeIndex, urlIndex] = (type === 'entity' ? [1, 2] : [0, 1]);

    for (const range of service[rangeIndex]) {
      let match = false;

      switch (type) {
        case 'domain':
          match = domainMatch(range, object);
          break;
        case 'autnum':
          match = asnMatch(range, object);
          break;
        case 'entity':
          match = entityMatch(range, object);
          break;
        case 'ip':
          match = ipMatch(range, object);
          break;
      }

      if (match) {
        const urls = service[urlIndex];
        let url = getBestURL(urls);

        // some bootstrap entries have a trailing slash, some don't
        if (!url.endsWith('/')) url += '/';

        return url + type + '/' + object;
      }
    }
  }

  return false;
}

function domainMatch(tld, domain) {
  if (tld == '' && !domain.includes('.')) {
    // an empty TLD indicates the root zone, and no dot indicates domain
    // is a TLD
    return true;

  } else {
    return punycode.toASCII(domain).toUpperCase().endsWith('.' + tld.toUpperCase());

  }
}

function asnMatch(range, asn) {
  var [min, max] = range.split('-', 2);
  min = parseInt(min);
  max = parseInt(max);

  return (asn >= min && asn <= max);
}

function entityMatch(tag, handle) {
  return handle.toUpperCase().endsWith('-' + tag.toUpperCase());
}

function ipMatch(prefix, ip) {
  var ip = ipaddr.parse(ip);
  var prefix = ipaddr.parseCIDR(prefix);
  return (ip.kind() == prefix[0].kind() && ip.match(prefix));
}

// return the first HTTPS url, or the first URL
function getBestURL(urls) {
  for (let i in urls) {
    if (urls[i].startsWith('https://')) return urls[i];
  }
  return urls[0];
}

let registryData = {};

async function sendQuery(url, followReferral = false, followingReferral = false) {
  let data = {};

  try {
    const response = await fetch(url, { mode: 'cors' });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    data = await response.json();

    if (response.status === 404) {
      handleError('This object does not exist.');
      return;
    } else if (response.status !== 200) {
      handleError(response.status + ' error: ' + response.statusText);
      return;
    }

    if (followReferral && data.links) {
      registryData = data;
      for (let i = 0; i < data.links.length; i++) {
        const l = data.links[i];

        if ('related' === l.rel && 'application/rdap+json' === l.type && l.href.match(/^(https?:|)\/\//i)) {
          return await sendQuery(l.href, false, true);
        }
      }
    }

    let rdata = registryData
    registryData = {}

    if (followingReferral) return {"registry": processObject(rdata), "registrar": processObject(data)}
    else return {"registry": processObject(data)}
    
  } catch (error) {
    console.log('There was an error with the fetch operation:', error);
    console.log("La información de " + (followReferral ? "registry" : "registrar") + " no esta disponible");

    if (followingReferral) {
      console.log('Unable to perform query. This may be because the '
        + 'RDAP server is not properly setting the '
        + 'Access-Control-Allow-Origin header. If the '
        + 'problem persists, please contact the server '
        + 'operator to report the issue. In the meantime, uncheck'
        + ' the "Follow referral to registrar\'s RDAP record" checkbox'
        + ' and try again.');
    }

    let rdata = registryData
    registryData = {}

    if (followingReferral) return {"registry": rdata ? processObject(rdata) : null, "registrar": data ? processObject(data) : null}
    else return {"registry": processObject(data)}
  }
}

async function loadRegistries() {
  try {
    const responses = await Promise.all(
      Object.values(registryURLs).map(url => fetch(url).then(response => response.json()))
    );

    responses.forEach((data, index) => {
      const key = Object.keys(registryURLs)[index];
      store.RDAPregistryData[key] = data.services;
    });

    store.RDAPregistryData.ip = store.RDAPregistryData.ip4.concat(store.RDAPregistryData.ip6);
  } catch (error) {
    console.error('There was an error retrieving one or more IANA registries:', error);
  }
}

function guessType(object) {
  var patterns = [
    [ /^(asn?|)\d+$/i, "autnum" ],
    [ /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/?\d*$/, "ip" ],
    [ /^[0-9a-f:]{2,}\/?\d*$/i, "ip" ],
    [ /^https?:/i, "url" ],
    [ /^{/, "json" ],
    [ /^(xn--[a-z0-9]|[a-z][a-z0-9\-]*[a-z])$/i, "tld" ],
    [ /./, "domain" ],
  ];
  for (var i = 0 ; i < patterns.length ; i++) {
    if (patterns[i][0].test(object)) {
      return patterns[i][1]
    }
  }
}

// process an RDAP object. Argument is a JSON object, return
// value is an element that can be inserted into the page
function processObject(object, toplevel, followReferral=true, followingReferral=false) {
  if (!object) {
    console.log(object);
    return false;
  }

  let output = {}

  switch (object.objectClassName) {
    case 'domain':
      output = processDomain(object, toplevel);
      break;
    case 'nameserver':
      output = processNameserver(object, toplevel);
      break;
    case 'entity':
      output = processEntity(object, toplevel);
      break;
    case 'autnum':
      output = processAutnum(object, toplevel);
      break;
    case 'ip network':
      output = processIp(object, toplevel);
      break;
    default:
      if (object.hasOwnProperty("errorCode")) {
        return console.log(object.errorCode + ' error: ' + object.title);
      }

      output = processUnknown(object);
      break;
  }

  output["report_type"] = object.objectClassName ?? "none"

  return output
}

// process a domain
function processDomain(object, toplevel=false) {
  let properties = {}

  if (toplevel) document.title = 'Domain ' + (object.unicodeName ? object.unicodeName : object.ldhName).toUpperCase() + ' - RDAP Lookup';

  if (object.hasOwnProperty("unicodeName")) {
    properties['name'] = object.unicodeName.toLowerCase()
    properties['ascii_name'] = object.ldhName.toLowerCase()
  } else {
    properties['name'] = object.ldhName.toLowerCase()
  }

  if (object.hasOwnProperty("handle")) properties['handle'] = object.handle;

  // process events, status and entities here, then set them to null so
  // processCommonObjectProperties() doesn't process them again. this
  // makes the output look more like a traditional whois record:
  if (object.hasOwnProperty("events"))    properties["events"] = processEvents(object.events);
  if (object.hasOwnProperty("status"))    properties["status"] = processStatus(object.status);
  if (object.hasOwnProperty("entities"))  properties["entities"] = processEntities(object.entities);

  delete object.events;
  delete object.status;
  delete object.entities;

  if (object.hasOwnProperty("nameservers")) {
    properties['nameservers'] = [];

    for (var i = 0 ; i < object.nameservers.length ; i++){
      properties['nameservers'].push(processObject(object.nameservers[i]))
    }
  }

  if (!object.hasOwnProperty("secureDNS")) {
    properties['dnssec'] = false;
  } else {
    properties['dnssec'] = processDNSSEC(object);//TODO
  }

  return { ...properties, ...processCommonObjectProperties(object) };
}

// process a nameserver
function processNameserver(object, toplevel=false) {
  let properties = {}

  if (toplevel) document.title = 'Nameserver ' + object.ldhName + ' - RDAP Lookup';

  properties['name'] = object.ldhName;
  if (object.hasOwnProperty("unicodeName")) properties['unicode_name'] = object.unicodeName;
  if (object.hasOwnProperty("handle")) properties['handle'] = object.handle;

  if (object.hasOwnProperty("ipAddresses")) {
    properties['ipAddresses'] = [];
    if (object.ipAddresses.hasOwnProperty("v4")) {
      for (var i = 0 ; i < object.ipAddresses.v4.length ; i++) {
        properties['ipAddresses'].push(object.ipAddresses.v4[i])
      }
    }

    if (object.ipAddresses.hasOwnProperty("v6")) {
      for (var i = 0 ; i < object.ipAddresses.v6.length ; i++) {
        properties['ipAddresses'].push(object.ipAddresses.v6[i])
      }
    }
  }

  return { ...properties, ...processCommonObjectProperties(object) };
}

// process an entity
function processEntity(object, toplevel=false) {
  let properties = {}

  if (toplevel) document.title = 'Entity ' + object.handle + ' - RDAP Lookup';

  if (object.hasOwnProperty("handle")) properties['handle'] = object.handle;

  if (object.hasOwnProperty("publicIds")) {
    properties['public_ids'] = [];
    for (var i = 0 ; i < object.publicIds.length ; i++){
      properties['public_ids'].push(object.publicIds[i].type + ':', object.publicIds[i].identifier)
    }
  }

  if (object.hasOwnProperty("roles")) properties['roles'] = object.roles;

  properties['contact_info'] = [];

  if (object.hasOwnProperty("jscard")) {
    properties['contact_info'].push(object.jscard);
  } else if (object.hasOwnProperty("jscard_0")) {
    properties['contact_info'].push(object.jscard_0);
  } else if (object.hasOwnProperty("vcardArray") && object.vcardArray[1]) {
    properties['contact_info'].push(processVCardArray(object.vcardArray[1]));
  }

  return { ...properties, ...processCommonObjectProperties(object) };
}

// process an AS number
function processAutnum(object, dl, toplevel=false) {
  let properties = {}

  if (toplevel) document.title = 'AS Number ' + object.handle + ' - RDAP Lookup';

  if (object.hasOwnProperty("name")) properties['network_name'] = object.name;
  if (object.hasOwnProperty("type")) properties['network_type'] = object.type;

  return { ...properties, ...processCommonObjectProperties(object) };
}

// process an IP or IP block
function processIp(object, dl, toplevel=false) {
  let properties = {}

  if (toplevel) document.title = 'IP Network ' + object.handle + ' - RDAP Lookup';

  if (object.hasOwnProperty("ipVersion")) properties["version"] = object.ipVersion;
  if (object.hasOwnProperty("startAddress") && object.hasOwnProperty("endAddress")) properties["address_range"] = object.startAddress + ' - ' + object.endAddress
  if (object.hasOwnProperty("name")) properties["network_name"] = object.name
  if (object.hasOwnProperty("type")) properties["network_type"] = object.type
  if (object.hasOwnProperty("country")) properties["country"] = object.country
  if (object.hasOwnProperty("parentHandle")) properties["parent_network"] = object.parentHandle
  if (object.hasOwnProperty("cidr0_cidrs")) properties["cidr_prefix"] = processCIDRs(object.cidr0_cidrs)
  
  return { ...properties, ...processCommonObjectProperties(object) };
}

function processUnknown(object) {
  return processCommonObjectProperties(object);
}

// called by the individual object processors, since all RDAP objects have a similar set of
// properties. the first argument is the RDAP object and the second is the <dl> element
// being used to display that object.
function processCommonObjectProperties(object) {
  let properties = {}

  if (object.hasOwnProperty("status")) properties["status"] = processStatus(object.status)
  if (object.hasOwnProperty("events")) properties["events"] = processEvents(object.events)
  if (object.hasOwnProperty("entities")) properties["entities"] = processEntities(object.entities)
  if (object.hasOwnProperty("remarks")) properties["remarks"] = object.remarks
  if (object.hasOwnProperty("notices")) properties["notices"] = object.notices
  if (object.hasOwnProperty("links")) properties["links"] = object.links
  if (object.hasOwnProperty("lang")) properties["lang"] = object.lang
  if (object.hasOwnProperty("port43")) properties["port43"] = object.port43
  if (object.hasOwnProperty("rdapConformance")) properties["rdap_conformance"] = object.rdapConformance

  //properties["raw_data"] = JSON.stringify(object, null, 2)

  return properties;
}

function processCIDRs(cidrs) {
  var list = [];
  for (let i = 0 ; i < cidrs.length ; i++) {
    var cidr = (cidrs[i].v6prefix ? cidrs[i].v6prefix : cidrs[i].v4prefix) + '/' + cidrs[i].length;
    list += cidr;
  }
  return list;
}

// add the object's events
function processEvents(events) {
  let event_list = []

  for (var i = 0 ; i < events.length ; i++) {
    event_list.push({
      "date": new Date(events[i].eventDate).toLocaleString(),
      "action": events[i].eventAction,
      "actor": events[i].eventActor
    })
  }

  return event_list;
}

// add the object's status codes
function processStatus(status) {
  let status_list = []

  for (var i = 0 ; i < status.length ; i++) {
    status_list.push(status[i]);
  }

  return status_list;
}

function processEntities(entities) {
  let entity_list = []

  for (var i = 0 ; i < entities.length ; i++){
    entity_list.push(processObject(entities[i]));
  }

  return entity_list;
}

function processVCardArray(vcardArray) {
  const vcardObject = {};

  for (let i = 0; i < vcardArray.length; i++) {
    const node = vcardArray[i];
    const type = node[0];
    const value = node[3];

    switch (type) {
      case 'fn':
        vcardObject.fullName = value;
        break;
      case 'n':
        vcardObject.name = value;
        break;
      case 'email':
        vcardObject.email = value;
        break;
      case 'tel':
        vcardObject.telephone = value;
        break;
      case 'adr':
        vcardObject.address = value.join("").length == 0 ? node[1]["label"] : value.join(" ");
        break;
      case 'org':
        vcardObject.organization = value;
        break;
      case 'title':
        vcardObject.title = value;
        break;
      case 'role':
        vcardObject.role = value;
        break;
      case 'url':
        vcardObject.url = value;
        break;
      default:
        if (!vcardObject.other) {
          vcardObject.other = [];
        }
        vcardObject.other.push({ type, value });
        break;
    }
  }

  return vcardObject;
}

function processDNSSEC(domain) {
  let properties = {}

  if (domain.secureDNS.hasOwnProperty("zoneSigned")) {
    properties["zone_signed"] = domain.secureDNS.zoneSigned ? true : false
  }

  if (domain.secureDNS.hasOwnProperty("delegationSigned")) {
    properties["delegation_signed"] = domain.secureDNS.delegationSigned ? true : false
  }

  if (domain.secureDNS.hasOwnProperty("maxSigLife")) {
    properties["max_signature_life"] = domain.secureDNS.maxSigLife
  }

  if (domain.secureDNS.hasOwnProperty("dsData")) {
    properties["ds_record"] = []

    for (var i = 0 ; i < domain.secureDNS.dsData.length ; i++) {
      var ds = domain.secureDNS.dsData[i];

      properties["ds_record"].push([domain.ldhName+".", "IN", "DS", ds.keyTag, ds.algorithm, ds.digestType, ds.digest].join(" "))

    }
  }

  if (domain.secureDNS.hasOwnProperty("keyData")) {
    properties["key_data"] = []

    for (var i = 0 ; i < domain.secureDNS.keyData.length ; i++) {
      var dnsKey = domain.secureDNS.keyData[i];

      properties["ds_record"].push([domain.ldhName+".", "IN", "DNSKEY", dnsKey.flags, dnsKey.protocol, dnsKey.algorithm, dnsKey.publicKey.match(/./g).join("\u200B")].join(" "))
    }
  }

  return properties;
}