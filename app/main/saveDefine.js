/***********************************************************************************
* This file is part of Visual Define-XML Editor. A program which allows to review  *
* and edit XML files created using the CDISC Define-XML standard.                  *
* Copyright (C) 2018 Dmitry Kolosov                                                *
*                                                                                  *
* Visual Define-XML Editor is free software: you can redistribute it and/or modify *
* it under the terms of version 3 of the GNU Affero General Public License         *
*                                                                                  *
* Visual Define-XML Editor is distributed in the hope that it will be useful,      *
* but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY   *
* or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License   *
* version 3 (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.           *
***********************************************************************************/

import fs from 'fs';
import createDefine from '../core/createDefine.js';
import copyStylesheet from '../main/copyStylesheet.js';
import writeDefineObject from '../main/writeDefineObject.js';

const onSaveCallback = (mainWindow, defineId) => () => {
    mainWindow.webContents.send('defineSaved', defineId);
};

// Save Define-XML
function saveDefine (mainWindow, data, options) {
    if (options.pathToFile !== undefined) {
        if (options.pathToFile.endsWith('nogz')) {
            writeDefineObject(mainWindow, data, false, options.pathToFile, onSaveCallback(mainWindow, data.defineId));
        } else {
            let defineXml = createDefine(data.odm, data.odm.study.metaDataVersion.defineVersion);
            fs.writeFile(options.pathToFile, defineXml, function (err) {
                let stylesheetLocation = data.odm && data.odm.stylesheetLocation;
                if (options.addStylesheet === true && stylesheetLocation) {
                    copyStylesheet(stylesheetLocation, options.pathToFile);
                }
                if (err) {
                    throw err;
                } else {
                    onSaveCallback(mainWindow, data.defineId)();
                }
            });
        }
    }
}

module.exports = saveDefine;
