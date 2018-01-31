const YAML = require('yamljs'),
	fs = require('fs'),
	config = require('./config.js'),
	dedent = require('dedent-js'),
	log = console.log.bind(console);

const FILENAME = 'cloud-config.yaml'

// null should work but doesn't, so pick a stupidly high number
const DONT_GENERATE_INLINE_YAML = 1000,
	INDENTATION = 2;
	
const cloudInit = {
	"users": [
		{
			"name": config.admin.username,
			"ssh-authorized-keys": [
				config.admin.key
			],
			"sudo": [
				"ALL=(ALL) NOPASSWD:ALL"
			],
			"groups": "admin",
			"shell": "/bin/bash"
		}
	],
	// Note: we don't use the 'apt' config in cloud-init as it adds to sources.list
	// rather than sources.list.d, and sources.list gets overridden by a bunch of cloud providers.
	// http://cloudinit.readthedocs.io/en/latest/topics/examples.html#writing-out-arbitrary-files                                                                                
	"write_files": [
		{
			"path": `/etc/systemd/system/${config.app}.service`,
			"content": dedent(`
				[Unit]
				Description=${config.app}
				After=network.target
				
				[Service]
				ExecStart=/var/www/${config.app}/app.js
				Restart=always
				User=nobody
				Group=nogroup
				Environment=PATH=/usr/bin:/usr/local/bin
				Environment=NODE_ENV=production
				WorkingDirectory=/var/www/${config.app}
				
				[Install]
				WantedBy=multi-user.target
			`)
		}, { 
			"path": `/etc/apt/sources.list.d/node.list`,
			"content": dedent(`
				deb https://deb.nodesource.com/node_8.x xenial main
				deb-src https://deb.nodesource.com/node_8.x xenial main
			`)
		}, { 
			"path": `/etc/apt/sources.list.d/yarn.list`,
			"content": dedent(`
				deb https://dl.yarnpkg.com/debian/ stable main
			`)
		}, { 
			"path": `/etc/apt/sources.list.d/do-agent.list`,
			"content": dedent(`
				deb https://repos.sonar.digitalocean.com/apt main main
			`)
		} 
	],
	// Yes it's 'write_files' but 'runcmd'. CloudInit is stupid. 
	"runcmd": [
		`printf "\n\n\n\n\nRunning Cloud Init commands\n"`,
		

		`printf "\n\nAdding GPG keys\n"`,
		`curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -`,
		`curl -sS https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -`,
		`curl -sS https://repos.sonar.digitalocean.com/sonar-agent.asc | apt-key add -`,

		`printf "\n\nInstalling node and related apps\n"`,
		`export DEBIAN_FRONTEND=noninteractive`,
		`apt-get -qq update`,
		`apt-get -qq install -y nodejs yarn build-essential do-agent`,

		`printf "\n\nUpdating box\n"`,
		`apt-get -qq -y dist-upgrade`,
		`apt-get -qq -y autoremove`,

		`printf "\n\nConfiguring SSH\n"`,
		`sed -i -e '/^Port/s/^.*$/Port ${config.ssh.port}/' /etc/ssh/sshd_config`,
		`sed -i -e '/^PermitRootLogin/s/^.*$/PermitRootLogin no/' /etc/ssh/sshd_config`,
		`systemctl restart ssh`,

		`printf "\n\nSetting up a .service for systemd\n"`,
		`sudo systemctl daemon-reload`,
		`systemctl enable ${config.app}`,

		// https://developer.github.com/v3/repos/keys/#add-a-new-deploy-key
		`printf "\n\nMake a deploy key for ${config.admin.username}\n"`,
		`ssh-keygen -t rsa -f /home/${config.admin.username}/.ssh/id_rsa -N ""`,

		`printf "\n\nAdd github pubkey for ${config.admin.username} - trust on first use\n"`,
		`ssh-keyscan github.com >> /home/${config.admin.username}/.ssh/known_hosts`,

		`printf "\n\nFinal cleanups\n"`,
		`mkdir -p /var/www`,
		`chown -R ${config.admin.username}:${config.admin.username} /home/${config.admin.username} /var/www`,

		`printf "\nFinished at $(date)\n\n\n\n\n"`,
	]
}

const contents = YAML.stringify(cloudInit, DONT_GENERATE_INLINE_YAML, INDENTATION)

// Each cloud-config file must begin with #cloud-config alone on the very first line
fs.writeFileSync(FILENAME, `#cloud-config\n${contents}`)

log(`Saved ${FILENAME}.`)


