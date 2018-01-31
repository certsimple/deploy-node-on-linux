// Could be JSON, but comments are cool, so JS.

const config = {
	organisation: 'mycorp',
	app: 'myapp',
	ssh: {
		// Anything except 22, which is a well known port and will give you a lot of log spam due to automated hack attempts
		port: 10000
	},
	admin: {
		// If you're using GitHub: you can find a copy of your user's public keys at https://github.com/(their GitHub user name).keys
		// Otherwise, ask each member of your team for a copy of their public key. If they're not sure, check the ~/.ssh/id_rsa.pub file on their Mac or Linux box, and if the file doesn't exist, run ssh-keygen to make a new one.
		username: 'max',
		key: 'ssh-rsa verylongstring' 
	}
}

module.exports = config;