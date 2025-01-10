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
            throw new Exception(json_encode([
							'error' => 'Invalid email',
							'detail' => "Email address is required",
						]));
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception(json_encode([
							'error' => 'Invalid email',
							'detail' => "Invalid email address format",
						]));
        }
        $this->email = $email;
    }

    /**
     * Set the domain from the email address
     *
     * @throws Exception
     */
    function set_domain() {
        $domain = substr(strrchr($this->email, "@"), 1);
        if (empty($domain)) {
            throw new Exception(json_encode([
							'error' => 'Invalid email account',
							'detail' => "Invalid domain extracted from email",
						]));
        }
        $this->domain = $domain;
    }

    /**
     * Set the mail server
     *
     * @throws Exception
     */
    function set_mail_server() {
			if (!getmxrr($this->domain, $registros_mx)) {
				throw new Exception(json_encode([
					'error' => 'No MX found',
					'detail' => "Domain $this->domain doesn't have any MX records",
				]));
			}
				$this->mail_server = $registros_mx[0];
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

            if (!$smtp->connect($this->mail_server, $this->port)) {
                throw new Exception(json_encode($smtp->getError()));
            }

            if (!$smtp->hello(gethostname())) {
                throw new Exception(json_encode($smtp->getError()));
            }

            if (!$smtp->mail($this->verifier_email)) {
                throw new Exception(json_encode($smtp->getError()));
            }

            if (!$smtp->recipient($this->email)) {
                throw new Exception(json_encode($smtp->getError()));
            }

            $smtp->quit();
            return $this->generateOutput();
        } catch (Exception $e) {
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
        );

        if ($data) {
            $output["output"] = json_decode($data);
        }

        return $output;
    }
}