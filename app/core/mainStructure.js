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

class Study {
    constructor ({
        id, name, image,
        defineIds = [],
    } = {}) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.defineIds = defineIds;
    }
}

class Define {
    constructor ({
        id, name, image, lastChanged, stats, pathToFile,
    } = {}) {
        this.id = id;
        this.name = name;
        this.pathToFile = pathToFile || '';
        if (stats !== undefined) {
            this.stats = stats;
        } else {
            this.stats = {
                datasets: 0,
                variables: 0,
                codeLists: 0,
            };
        }
        if (lastChanged !== undefined) {
            this.lastChanged = lastChanged;
        } else {
            this.lastChanged = new Date().toISOString();
        }
    }
}

class ControlledTerminology {
    constructor ({
        id, name, version, codeListCount, pathToFile, isDefault, sources, isCdiscNci, publishingSet, type
    } = {}) {
        this.id = id;
        this.name = name;
        this.version = version;
        this.codeListCount = codeListCount;
        this.pathToFile = pathToFile;
        this.isDefault = isDefault || false;
        this.isCdiscNci = isCdiscNci;
        this.publishingSet = publishingSet;
        this.type = type;
        if (sources === undefined) {
            this.sources = {
                defineIds: [],
            };
        } else {
            this.sources = sources;
        }
    }
}

class ReviewComment {
    constructor ({
        text, author, createdAt, modifiedAt, resolvedAt, resolvedBy = '', reviewCommentOids = [], sources = {},
    } = {}) {
        this.text = text;
        this.author = author;
        this.sources = sources;
        this.resolvedBy = resolvedBy;
        this.resolvedAt = resolvedAt;
        if (createdAt === undefined) {
            this.createdAt = new Date().toJSON();
        } else {
            this.createdAt = createdAt;
        }
        if (modifiedAt === undefined) {
            this.modifiedAt = this.createdAt;
        } else {
            this.modifiedAt = modifiedAt;
        }
        this.reviewCommentOids = reviewCommentOids;
    }
}

module.exports = {
    Study,
    Define,
    ControlledTerminology,
    ReviewComment,
};
