## Deploy node on Linux

Automatically deploys a node app using [Cloud Init](http://cloudinit.readthedocs.io/en/latest/index.html) (also called Cloud Config). Cloud Init works on:

 - [Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-use-cloud-config-for-your-initial-server-setup)
 - [AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html#user-data-cloud-init)
 - [Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/using-cloud-init)
 - [Google Cloud](https://cloud.google.com/container-optimized-os/docs/how-to/create-configure-instance#using_cloud-init)

## Installation

Just `git clone` this repo and run `yarn install` (or `npm install`) to fetch dependencies.

## Usage

Edit `config.js` and run `node make-cloud-init.js` to output a Cloud Init file.

Start an instance (via API or manually) on your cloud provider and specify the Cloud Init file as **User Data**.

You might wish to check the output of the Cloud Init in `/var/log/cloud-init-output.log`.

After the box is built, SSH in as your chosen user, on your chosen port, and add `~/.ssh/id_dsa.pub` as a deploy key to your project on GitHub / GitLab.

You now have a fully deployed box and can `git clone` your project there, run `yarn install`, and start your app with `systemctl start (app name)`.

See [CertSimple's Deploy Node on Linux guide](https://certsimple.com/blog/deploy-node-on-linux) for full documentation.  

## We welcome forks and changes!

This is the first release of the Cloud Config generator. Bug reports are good, but pull requests are better. 🙂 

## Credits

Deploy Node on Linux is created by [Fast, painless EV HTTPS](https://certsimple.com) provider [CertSimple](https://certsimple.com). If you want to verify who runs your website, we do it better than anyone else!

