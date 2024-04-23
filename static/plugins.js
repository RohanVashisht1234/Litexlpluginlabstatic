"use strict";

import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const jsonURL = "https://raw.githubusercontent.com/lite-xl/lite-xl-plugins/master/manifest.json";

const parentDiv = document.getElementById("place_cards_here");
const searchBox = document.getElementById("searchbox");

let globalData = null;

function handleJsonData(data) {
    globalData = data;
    const html = buildHtml(data);
    parentDiv.innerHTML = html;
}

function buildHtml(data) {
    let html = "";
    for (let i = 3; i < data.addons.length; i++) {
        const addon = data.addons[i];
        const name = addon.id.replace(/"/g, '');
        let title = name.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
        let description = addon.description.replace(/"/g, '');
        if (addon.name) {
            title = addon.name.replace(/"/g, '');
        }
        html += `<div class="card" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${name}</h6>
              <p class="card-text markdownContent">${marked.parse(description)}</p>
              <a href="/@plugins/plugin_slug?plugin=${name}" class="card-link btn btn-primary">View plugin</a>
            </div>
            </div>`;
    }
    return html;
}

function handleTyping() {
    const searchString = searchBox.value.toLowerCase();
    const filteredData = globalData.addons.filter(addon => {
        const name = addon.id.toLowerCase();
        const description = addon.description.toLowerCase();
        return name.includes(searchString) || description.includes(searchString);
    });
    const html = buildHtml({ addons: filteredData });
    parentDiv.innerHTML = html;
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

    searchBox.addEventListener('input', handleTyping);
}

main();