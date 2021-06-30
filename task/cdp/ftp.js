'use strict';
const ftp = require("basic-ftp");

async function basicFTP() {
    return await new Promise(async (resolve, reject) => {
        const client = new ftp.Client()
        client.ftp.verbose = true
        try {
            await client.access({
                host: "10.2.35.195",
                user: "pamapersada/pasnet",
                password: "Cupcuy",
                secure: false
            })

            await client.cd("DHCP_PAMA/CDP_NEI/JIEP/")

            var listFolder = await client.list()

            async function downloadFTP() {
                for (var item of listFolder) {
                    var fileName = item.name;
                    await client.cd("/")
                    await client.cd("DHCP_PAMA/CDP_NEI/JIEP/" + fileName)
                        .then(res => logger('path oke!'))
                        .catch(err => logger('path error'))
                    await client.downloadTo("./file/" + fileName + ".cfg", "CDP.cfg")
                        .then(res => logger('Download ok!'))
                        .catch(err => logger('Download error!'))
                }
            }

            await downloadFTP()
            //response.ok('FTP OK!', res);
            resolve({
                result: 'FTP OK!'
            })
        }
        catch (err) {
            reject(err)
        } finally {
            //
        }
        client.close()
    })

}


module.exports = { basicFTP };