const dns = require('dns');

const lookupAddress = "pluralsight.com";

// Not a network method -- Uses libuv threads
dns.lookup(lookupAddress, (err, address) => {
    if (err) console.error(err);
    console.log("DNS Lookup '%s': ", lookupAddress, address);
});

// DNS lookup for IPv4
dns.resolve4(lookupAddress, (err, address) => {
    if (err) console.error(err);
    console.log("DNS resolve4 '%s': ", lookupAddress, address);
});

// DNS lookup with explicit record type. Each type has their own method as well
const recordType = 'MX';
dns.resolve(lookupAddress, recordType, (err, address) => {
    if (err) console.error(err);
    console.log("DNS resolve %s '%s': ", recordType, lookupAddress, address);
});

// Reverse DNS lookup: IP --> Hostname
const ipLookup = '18.223.144.105';
dns.reverse(ipLookup, (err, hostnames) => {
    if (err) console.error(err);
    console.log("DNS reverse '%s': ", ipLookup, hostnames);
});