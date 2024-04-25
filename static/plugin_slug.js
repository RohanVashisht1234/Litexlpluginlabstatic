"use strict";

import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.0/+esm";

const urlPramas = new URLSearchParams(window.location.search);
const jsonURL = "https://raw.githubusercontent.com/lite-xl/lite-xl-plugins/master/manifest.json";

const pluginNameOnUrl = urlPramas.get("plugin");

function handle_json_data(data) {
    var valid_page = false;
    var i = 3;
    for (null; i < data.addons.length; i++) {
        if (data["addons"][i]['id'] == pluginNameOnUrl) {
            valid_page = true;
            break;
        }
    }
    if (valid_page) {
        const id = data.addons[i].id;
        const description = data.addons[i].description;
        const version = data.addons[i].version;
        // because of https:// I am using [1]
        const sourceURL = data.addons[i].path ? "https://github.com/lite-xl/lite-xl-plugins/blob/master/" + data.addons[i].path : data.addons[i].remote.split(":")[1];
        var title = null;
        if ("name" in data["addons"][i]) {
            title = data["addons"][i]['name'];
        } else {
            title = id.replace("_", " ");
            title = title[0].toUpperCase() + title.slice(1);
        }

        document.getElementById("name").innerHTML = DOMPurify.sanitize(title, { ALLOWED_TAGS: ['a', 'code'] });
        document.getElementById("viewSrc").innerHTML = `<a class="text-decoration-none text-info" href="${sourceURL}" target="_black" rel="noopener">Click here to view source code</a>`
        document.getElementById("description").innerHTML = DOMPurify.sanitize(marked.parse(description.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ""), { ALLOWED_TAGS: ['a', 'code'] }));
        document.getElementById("version").innerHTML = DOMPurify.sanitize(version);
        document.getElementById("install_command").innerHTML = `<span style="color:pink;">lpm</span> <span style="color:lightyellow">install</span> <span style="color:skyblue">${DOMPurify.sanitize(id)}</span>`;
        document.getElementById("install_command_miq").innerHTML = `<span style="color:pink;">local</span> <span style="color:lightyellow">config</span> = <span style="color:lightyellow">require</span> <span style="color:skyblue">'core.config'</span><br><br>
<span style="color:lightyellow">config</span>.plugins.miq.plugins = {<br>
&nbsp;&nbsp;&nbsp;&nbsp;...<br>
&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:skyblue;">'${DOMPurify.sanitize(id, { ALLOWED_TAGS: ['a', 'code'] })}'</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;...<br>
}
`;
    }
    else {
        window.location = "/404";
    }
}

function main() {
    fetch(jsonURL).then(function (response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(function (data) {
        handle_json_data(data);
    }).catch(function (error) {
        console.error('Error fetching JSON:', error);
    });
    return 0;
}

let _ = main();
