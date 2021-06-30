async function parse() {

    const fetch = require('node-fetch');
    const ProxyAgent = require('proxy-agent');

    const url = 'https://docs.microsoft.com/en-us/microsoft-365/enterprise/urls-and-ip-address-ranges?view=o365-worldwide#skype-for-business-online-and-microsoft-teams';

    //const url = 'https://script.google.com/macros/s/AKfycbw1fQnSOK9GsbW6wae5fMW0YsyHx06EUjTYKy_X11Pu2tB1kDNOmxbL/exec';


    const proxyAgent = new ProxyAgent('http://10.2.180.190:8080');

    async function fetchData() {
        var res = fetch(url, { agent: proxyAgent })
            .then(function (res) {
                if (res.ok) {
                    return res.text()
                } else {
                    return res.text()
                }
            })
            .catch(err => err)
        return res
    }

    var html = await fetchData()

    function getHeader(tagFirst, tagEnd) {

        var datas = [];
        //table Exchange Online
        var parsing_html = html.split(tagFirst)[1].split(tagEnd)[0];

        //Get Header
        var split_header = parsing_html.split('<thead>')[1].split('</thead>')[0];

        //Menghapus tanda /
        var replace = split_header.split('/').join('');

        //Menghapus Tags
        var replaceAll = replace.replace(/<th>|<tr>/g, '');

        //Menghapus Line Breaks
        var replaceLine = replaceAll.replace(/(\r\n|\n|\r)/gm, "-").replace(/--/g, "").split('-');

        replaceLine.push('Title');
        replaceLine.push('Last Update Doc');

        datas.push(replaceLine);
        return [parsing_html, datas];
    }

    //-----------------------------------------------------------------------------------

    function getBody(tagFirst, tagEnd, sheetName) {

        var get_parse = getHeader(tagFirst, tagEnd);
        var parse_html = get_parse[0];
        var datas = get_parse[1];

        //BODY
        var split_body = parse_html.split('<tbody>')[1].split('</tbody>')[0];
        var body_slice = split_body.split('<tr>').join('pama').split('</tr>').join('pama');

        //menghapus line break
        var body_linebreak = body_slice.replace(/(\r\n|\n|\r)/gm, "").replace(/pamapama/g, "pama_break").replace(/pama/g, "");

        //memsiahkan kolom
        var body_break_split = body_linebreak.split('_break');


        for (var index in body_break_split) {

            //hapus tag
            var body_remove_tag = body_break_split[index].split('<td>').join('pama').split('</td>').join('pama').replace(/pamapama/g, "pamma").replace(/pama/g, "").split('/')
                .join('garing').replace(/<code>|<garingcode>|<strong>|<garingstrong>/g, "").replace(/<br>/g, " ").replace(/garing/g, "/").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

            //convert to array
            var body_to_array = body_remove_tag.split('pamma');

            var now = new Date(new Date().getTime() + (+7) * 3600 * 1000).toISOString(); // .toLocaleString("en-US", {timeZone: "America/New_York"});

            //var parse_date = now.toLocaleString("fr-ca", {timeZone: "Asia/Jakarta"});


            //pasring date
            var parse_date = now.split('T');

            var datetime = parse_date[0] + ' ' + parse_date[1].slice(0, 5);


            //insert timestamp
            body_to_array.push(sheetName);

            //insert last update document

            var doc_update = html.split('data-article-date-source="ms.date">')[1].split('</time>')[0];
            body_to_array.push(doc_update);

            datas.push(body_to_array);

        }

        return datas;

    }

    var task1 = await getBody('<h2 id="exchange-online">Exchange Online</h2>', '</table>', 'Exchange Online');
    var task2 = await getBody('<h2 id="sharepoint-online-and-onedrive-for-business">SharePoint Online and OneDrive for Business</h2>', '</table>', 'SharePoint Online');
    var task3 = await getBody('<h2 id="skype-for-business-online-and-microsoft-teams">Skype for Business Online and Microsoft Teams</h2>', '</table>', 'Skype & Teams for Business');
    var task4 = await getBody('<h2 id="microsoft-365-common-and-office-online">Microsoft 365 Common and Office Online</h2>', '</table>', 'Microsoft 365');

    returns = [task1, task2, task3, task4]

    return returns;
}

module.exports = { parse };