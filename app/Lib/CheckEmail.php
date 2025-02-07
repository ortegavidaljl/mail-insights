<?php

namespace App\Lib;

use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class CheckEmail {
		// Properties
		public $email;
		public $domain;
		public $mail_server;
		public $port;
		public $verifier_email;
		public $connection = null;
		public $debug_mode;
		public $log = [];

		/**
		 * Constructor
		 *
		 * @param string|null $verifier_email
		 * @param int $port
		 */
		function __construct($verifier_email = null, $port = 25) {
				$this->debug_mode = false;
				$this->verifier_email = $verifier_email ?? env('MAIL_VERIFIER_ADDRESS');
				$this->port = $port;
		}

		/**
		 * Verify the email address
		 *
		 * @param string $email
		 * @return array
		 */
		function verify($email) {
				try {
						$this->set_email($email);
						$this->set_domain();
						$this->set_mail_server();
						return $this->smtp_connect();
				} catch (Exception $e) {
						return $this->generateOutput($e->getMessage());
				}
		}

		/**
		 * Set the email address
		 *
		 * @param string $email
		 * @throws Exception
		 */
		function set_email($email) {
				if (empty($email)) {
					$this->log(	"🕵️ Email address is required. Exiting ...");
					throw new Exception(json_encode([
						'error' => 'Invalid email',
						'detail' => "Email address is required",
					]));
				}
				
				if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
					$this->log("🕵️ Invalid email address format. Exiting ...");
					throw new Exception(json_encode([
						'error' => 'Invalid email',
						'detail' => "Invalid email address format",
					]));
				}
				$this->email = $email;
				$this->log("📧 Email address set to $email ...");
		}

		/**
		 * Set the domain from the email address
		 *
		 * @throws Exception
		 */
		function set_domain() {
				$domain = substr(strrchr($this->email, "@"), 1);
				if (empty($domain)) {
					$this->log("🕵️ Invalid domain extracted from email. Exiting ...");
						throw new Exception(json_encode([
							'error' => 'Invalid email account',
							'detail' => "Invalid domain extracted from email",
						]));
				}
				$this->domain = $domain;
				$this->log("🌍 Domain set to $domain ...");
		}

		/**
		 * Set the mail server
		 *
		 * @throws Exception
		 */
		function set_mail_server() {
			if (!getmxrr($this->domain, $registros_mx)) {
				$this->log("🧭 No MX found for $this->domain. Exiting ...");
				throw new Exception(json_encode([
					'error' => 'No MX found',
					'detail' => "Domain $this->domain doesn't have any MX records",
				]));
			}
				$this->mail_server = $registros_mx[0];
				$this->log("📮 Mail server set to $this->mail_server ...");
		}

		/**
		 * Connect to the SMTP server
		 *
		 * @return array
		 * @throws Exception
		 */
		function smtp_connect() {
				// SMTP needs accurate times, and the PHP time zone MUST be set
				date_default_timezone_set(env('APP_TIMEZONE', 'UTC'));

				try {
						$smtp = new SMTP();
						$smtp->SMTPDebug = 2;

						$this->log("🔍 Attempting to connect to $this->mail_server on port $this->port ...");

						if (!$smtp->connect($this->mail_server, $this->port)) {
							$this->log("🛑 Connection failed. Exiting ...");
							throw new Exception(json_encode($smtp->getError()));
						}
						$this->log("✅ Connection successful. Attempting to greet the server ...");

						if (!$smtp->hello(gethostname())) {
							$this->log("🫥 There was an error greeting the server. Exiting ...");
							throw new Exception(json_encode($smtp->getError()));
						}
						$this->log("👋 Said hello to the server ...");

						$this->log("📨 Attempting to start mail transaction ...");
						if (!$smtp->mail($this->verifier_email)) {
							$this->log("🛑 There was an error starting the mail transaction. Exiting ...");
							throw new Exception(json_encode($smtp->getError()));
						}
						$this->log("✅ Mail transaction started ...");

						$this->log("🎯 Attempting to set the recipient to $this->email ...");
						if (!$smtp->recipient($this->email)) {
							$this->log("🛑 There was an error setting the recipient. Exiting ...");
							throw new Exception(json_encode($smtp->getError()));
						}
						$this->log("✅ Recipient set to $this->email ...");

						$this->log("🔚 Account accepted by the server. Sending QUIT command and closing connection ...");
						$smtp->quit();
						$smtp->close();

						$this->log("🏁 Test successful. Generating output ...");
						return $this->generateOutput();
				} catch (Exception $e) {
						$this->log("💥 Test failed. Generating output ...");
						throw new Exception($e->getMessage());
				}
		}

		/**
		 * Generate output
		 *
		 * @param string|null $data
		 * @return array
		 */
		function generateOutput($data = null) {
				$output = array(
						"status" => $data ? "error" : "success",
						"mx_server" => $this->mail_server,
						"log" => $this->log
				);

				if ($data) {
						$output["output"] = json_decode($data);
				}

				return $output;
		}

		function log($data){
      $this->log[] = $data;
    }
}