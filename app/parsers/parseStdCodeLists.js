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

import stdCL from '../core/stdCodeListStructure.js';

/*
 * Auxiliary functions
 */

// Remove namespace from attribute names
function removeNamespace (obj) {
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            let propUpdated = prop;
            // Rename only properties starting with a capital letter
            if (/^\w+:/.test(prop)) {
                propUpdated = prop.replace(/^\w+:(.*)/, '$1');
                // Check if the renamed property already exists and if not - rename and remove the old one
                if (obj.hasOwnProperty(propUpdated)) {
                    throw new Error('Cannot convert property ' + prop + ' to ' + propUpdated + ' as it already exists');
                } else {
                    obj[propUpdated] = obj[prop];
                    delete obj[prop];
                }
            }
            if (typeof obj[propUpdated] === 'object') {
                removeNamespace(obj[propUpdated]);
            }
        }
    }
}

// ODM naming convention uses UpperCamelCase for attribute/element names
// As they become class properties, all attributes are converted to lower camel case
function convertAttrsToLCC (obj) {
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            let propUpdated = prop;
            // Rename only properties starting with a capital letter
            if (/^[A-Z]|leafID/.test(prop)) {
                if (/^[A-Z0-9_]+$/.test(prop)) {
                    // All caps OID -> oid
                    propUpdated = prop.toLowerCase();
                } else if (/[a-z](OID|CRF|ID)/.test(propUpdated)) {
                    // Abbreviations mid word: FileOID -> fileOid
                    propUpdated = propUpdated.replace(/^(\w*[a-z])(OID|CRF|ID)/, function (a, p1, p2) {
                        return p1.slice(0, 1).toLowerCase() + p1.slice(1) + p2.slice(0, 1) + p2.slice(1).toLowerCase();
                    });
                } else if (prop === 'ODMVersion') {
                    propUpdated = 'odmVersion';
                } else {
                    propUpdated = prop.slice(0, 1).toLowerCase() + prop.slice(1);
                }
                // Check if the renamed property already exists and if not - rename and remove the old one
                if (obj.hasOwnProperty(propUpdated)) {
                    throw new Error('Cannot convert property ' + prop + ' to ' + propUpdated + ' as it already exists');
                } else {
                    obj[propUpdated] = obj[prop];
                    delete obj[prop];
                }
            }
            if (typeof obj[propUpdated] === 'object') {
                convertAttrsToLCC(obj[propUpdated]);
            }
        }
    }
}

/*
 * Parse functions
 */

function parseTranslatedText (item) {
    let args = {};
    if (typeof item['translatedText'][0] === 'string') {
        args = {
            lang: undefined,
            value: item['translatedText'][0]
        };
    } else {
        args = {
            lang: item['translatedText'][0]['$']['lang'],
            value: item['translatedText'][0]['_']
        };
    }

    return new stdCL.TranslatedText(args);
}

function parseCodeLists (codeListsRaw, mdv, quickParse) {
    let codeLists = {};
    codeListsRaw.forEach(function (codeListRaw) {
        let codeList;
        if (quickParse) {
            codeList = { oid: codeListRaw['$'].oid };
        } else if (codeListRaw.hasOwnProperty('$')) {
            let args = codeListRaw['$'];
            // QuickParse is used when a folder with CTs is parsed, no need to parse individual codes;
            // Create an Alias
            args.alias = new stdCL.Alias({
                context: 'nci:ExtCodeID',
                name: codeListRaw['$'].extCodeId,
            });
            // Submission value
            if (codeListRaw.hasOwnProperty('cDISCSubmissionValue')) {
                args.cdiscSubmissionValue = codeListRaw['cDISCSubmissionValue'][0];
            }
            if (codeListRaw.hasOwnProperty('cDISCSynonym')) {
                args.synonyms = codeListRaw['cDISCSynonym'];
            }
            if (codeListRaw.hasOwnProperty('preferredTerm')) {
                args.preferredTerm = codeListRaw['preferredTerm'][0];
            }
            // CodeList type is always set to decoded
            args.codeListType = 'decoded';
            codeList = new stdCL.StdCodeList(args);

            let itemOrder = [];
            // Parse enumerated items
            if (codeListRaw.hasOwnProperty('enumeratedItem')) {
                codeListRaw['enumeratedItem'].forEach(function (item) {
                    let itemArgs = item['$'];
                    // Create an Alias
                    itemArgs.alias = new stdCL.Alias({
                        context: 'nci:ExtCodeID',
                        name: item['$'].extCodeId,
                    });
                    if (item.hasOwnProperty('cDISCSynonym')) {
                        itemArgs.synonyms = item['cDISCSynonym'];
                    }
                    if (item.hasOwnProperty('cDISCDefinition')) {
                        itemArgs.definition = item['cDISCDefinition'][0];
                    }
                    let codeListItem = new stdCL.StdCodeListItem(itemArgs);
                    item['preferredTerm'].forEach(function (item) {
                        codeListItem.addDecode(new stdCL.TranslatedText({ value: item }));
                    });
                    itemOrder.push(codeList.addCodeListItem(codeListItem));
                });
            }

            codeList.itemOrder = itemOrder;

            // Parse descriptions
            codeListRaw['description'].forEach(function (item) {
                codeList.addDescription(parseTranslatedText(item));
            });
        }
        codeLists[codeList.oid] = codeList;
    });

    return codeLists;
}

function parseMetaDataVersion (metadataRaw, quickParse) {
    // Parse the MetadataVersion element

    var mdv = {};
    mdv.codeLists = parseCodeLists(metadataRaw['codeList'], mdv, quickParse);
    // Connect NCI codes with CodeList IDs
    let nciCodeOids = {};
    if (!quickParse) {
        Object.keys(mdv.codeLists).forEach(codeListOid => {
            nciCodeOids[mdv.codeLists[codeListOid].alias.name] = codeListOid;
        });
    }

    let args = {
        oid: metadataRaw['$']['oid'],
        name: metadataRaw['$']['name'],
        codeLists: mdv.codeLists,
        nciCodeOids,
    };

    let metaDataVersion = new stdCL.MetaDataVersion(args);

    if (metadataRaw['$'].hasOwnProperty('description')) {
        let description = new stdCL.TranslatedText({
            value: metadataRaw['$']['description']
        });
        metaDataVersion.addDescription(description);
    }

    return metaDataVersion;
}

function parseGlobalVariables (globalVariablesRaw) {
    let args = {};

    for (let glVar in globalVariablesRaw) {
        if (globalVariablesRaw.hasOwnProperty(glVar)) {
            args[glVar] = globalVariablesRaw[glVar][0];
        }
    }

    return new stdCL.GlobalVariables(args);
}

function parseStudy (studyRaw, quickParse) {
    let args = studyRaw['$'];

    args.metaDataVersion = parseMetaDataVersion(studyRaw.metaDataVersion[0], quickParse);
    args.globalVariables = parseGlobalVariables(studyRaw.globalVariables[0]);

    return new stdCL.Study(args);
}

function parseOdm (odmRaw, quickParse) {
    let args = odmRaw['$'];

    if (/^\S+\.\S+\.[-\d]+$/.test(odmRaw['$'].fileOid)) {
        args.type = odmRaw['$'].fileOid.replace(/^\S+\.(\S+)\.[-\d]+$/, '$1');
    }

    args.study = parseStudy(odmRaw.study[0], quickParse);

    return new stdCL.Odm(args);
}

function parseStdCodeLists (data, quickParse) {
    removeNamespace(data);
    convertAttrsToLCC(data);

    // Parse Study
    let odm = parseOdm(data.odm, quickParse);

    return odm;
}

module.exports = parseStdCodeLists;
