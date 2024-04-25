"use strict";

import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.0/+esm";

const jsonURL = "https://raw.githubusercontent.com/lite-xl/lite-xl-plugins/master/manifest.json";

const parentDiv = document.getElementById("place_cards_here");
const searchBox = document.getElementById("searchbox");

var globalData = null;
var compiledHTML = null;

function handleJsonData(data) {
    globalData = data;
    compiledHTML = buildHtml(data);
    parentDiv.innerHTML = compiledHTML;
    return;
}

function buildHtml(data) {
    let html = "";

    for (let i = 3; i < data.addons.length; i++) {
        const addon = data.addons[i];
        const id = addon.id;
        const description = addon.description;
        const title = addon.name ? addon.name : id[0].toUpperCase() + id.slice(1).replace("_", " ");
        html += `<div class="card" style="width: 18rem;"><div class="card-body">
<h5 class="card-title">${DOMPurify.sanitize(title, { ALLOWED_TAGS: ['a', 'code'] })}</h5>
<h6 class="card-subtitle mb-2 text-muted">${DOMPurify.sanitize(id, { ALLOWED_TAGS: ['a', 'code'] })}</h6>
<p class="card-text markdownContent">${DOMPurify.sanitize(marked.parse(description.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ""), { ALLOWED_TAGS: ['a', 'code'] }))}</p>
<a href="/@plugins/plugin_slug?plugin=${id}" class="card-link btn btn-primary">View plugin</a>
</div>
</div>`;
    }

    return html;
}

function handle_typing() {
    let html = "";
    const searchBoxContents = searchBox.value;
    if (searchBoxContents == "") {
        parentDiv.innerHTML = compiledHTML;
        return;
    }
    var data = globalData;
    for (var i = 3; i < data.addons.length; i++) {
        const addon = data.addons[i];
        const id = addon.id;
        const description = addon.description;
        const title = addon.name ? addon.name : id[0].toUpperCase() + id.slice(1).replace("_", " ");
        if (title.includes(searchBoxContents) || description.includes(searchBoxContents) || id.includes(searchBoxContents)) {
            html += `<div class="card" style="width: 18rem;">
<div class="card-body">
    <h5 class="card-title">${title.replace(searchBoxContents, "<span style='background-color:yellow;color:black;'>" + searchBoxContents + "</span>")}</h5>
    <h6 class="card-subtitle mb-2 text-muted">${id.replace(searchBoxContents, "<span style='background-color:yellow;color:black;'>" + searchBoxContents + "</span>")}</h6>
    <p class="card-text markdownContent">${marked.parse(description).replace(searchBoxContents, "<span style='background-color:yellow;color:black;'>" + searchBoxContents + "</span>")}</p>
    <a href="/@plugins/plugin_slug?plugin=${id}" class="card-link btn btn-primary">View plugin</a>
</div>
</div>`
        }
    }
    parentDiv.innerHTML = html;
    return;
}

function main() {
    fetch(jsonURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            handleJsonData(data);
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
        });

    searchBox.addEventListener('input', handle_typing);
    return 0;
}

let _ = main();
