/*
 * This file is part of 99.9% Dice Assistant extension for Google Chrome browser
 *
 * Copyright (c) 2015 Ilya Petriv
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

(function inject_script()
{
    document.getElementsByTagName("body")[0].appendChild(script = document.createElement('script'));
    script.innerHTML = "var extension_id = '" + chrome.runtime.id + "';"

    document.getElementsByTagName("body")[0].appendChild(script = document.createElement('script'));
    script.setAttribute('src', chrome.extension.getURL("/app/script.js"));
}());
