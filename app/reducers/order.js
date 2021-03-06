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

import { combineReducers } from 'redux';
import itemGroupOrder from 'reducers/itemGroupOrder.js';
import codeListOrder from 'reducers/codeListOrder.js';
import leafOrder from 'reducers/leafOrder.js';
import standardOrder from 'reducers/standardOrder.js';

export default combineReducers({
    itemGroupOrder,
    codeListOrder,
    leafOrder,
    standardOrder,
});
