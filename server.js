const SMTPServer = require("smtp-server").SMTPServer;
var mailstrip = require("mailstrip");
const { simpleParser } = require("mailparser");
import request from "request";

const SERVER_PORT = 2525;
const SERVER_HOST = false;

// Setup server
const server = new SMTPServer({
  // log to console
  logger: true,

  // not required but nice-to-have
  banner: "Welcome to the Deedmob email-reply-service server",

  // disable STARTTLS to allow authentication in clear text mode
  disabledCommands: ["AUTH", "STARTTLS"],

  // By default only PLAIN and LOGIN are enabled
  authMethods: ["PLAIN", "LOGIN", "CRAM-MD5"],

  // Accept messages up to 10 MB
  size: 10 * 1024 * 1024,

  // allow overriding connection properties. Only makes sense behind proxy
  useXClient: true,

  hidePIPELINING: true,

  // use logging of proxied client data. Only makes sense behind proxy
  useXForward: true,

  // Validate RCPT TO envelope address. Example allows all addresses that do not start with 'deny'
  // If this method is not set, all addresses are allowed
  // onRcptTo(address, session, callback) {
  //   if (!(/^user-/i.test(address.address) || /^org-/i.test(address.address))) {
  //     return callback(new Error('Not accepted'));
  //   }
  //
  //   callback();
  // },

  // Handle message stream
  onData(stream, session, callback) {
    const to = session.envelope.rcptTo[0].address;
    const from = session.envelope.mailFrom.address;

    simpleParser(stream)
      .then(mail => {
        console.log(session);
        request(
          {
            method: "POST",
            url: `https://<YOUR-API-URI-ENDPOINT>`,
            json: true,
            body: {
              to: to,
              from: from,
              message: mailstrip(mail.text)
            },
            headers: {
              "X-Requested-With": "XMLHttpRequest"
            }
          },
          (error, response, body) => {
            // HANDLE ERRORS
            if (error) console.error(error);
            else callback(null, "Message sent"); // accept the message once the stream is ended
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  }
});

server.on("error", err => {
  console.log("Error occurred");
  console.log(err);
});

// start listening
server.listen(SERVER_PORT, SERVER_HOST);
