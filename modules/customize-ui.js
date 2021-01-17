/*
MIT License

Copyright (c) 2019 Matej Knopp

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
define([
    "module",
    "require",
    "vs/platform/instantiation/common/instantiationService",
    "customize-ui/utils",
    // "customize-ui/activity-bar",
    // "customize-ui/fonts",
    // "customize-ui/title-bar",
], function (module, require, instantiationService, utils, activityBar, fonts, titleBar) {
        'use strict';
        console.log("Starting customize-ui loader", {
            module, require, instantiationService, utils, activityBar, fonts, titleBar
        });

        const addStyleSheet = utils.addStyleSheet;

        let url = require.toUrl(module.id) + ".css";
        if (!url.startsWith("file://")) {
            url = 'file://' + url;
        }
        addStyleSheet(url);

        class _InstantiationService extends instantiationService.InstantiationService {
            constructor() {
                super(...arguments);

                const service = this;

                const run = function(what) {
                    try {                        
                        what.run(service);                        
                    } catch (e) {
                        console.error(e);
                    }
                };

                run(activityBar);
                run(fonts);                
                run(titleBar);                
            }
        }

        instantiationService.InstantiationService = _InstantiationService;
    });
