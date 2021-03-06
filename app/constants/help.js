/***********************************************************************************
* This file is part of Visual Define-XML Editor. A program which allows to review  *
* and edit XML files created using the CDISC Define-XML standard.                  *
* Copyright (C) 2018, 2019 Dmitry Kolosov                                          *
*                                                                                  *
* Visual Define-XML Editor is free software: you can redistribute it and/or modify *
* it under the terms of version 3 of the GNU Affero General Public License         *
*                                                                                  *
* Visual Define-XML Editor is distributed in the hope that it will be useful,      *
* but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY   *
* or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License   *
* version 3 (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.           *
***********************************************************************************/

export const CODELIST_POPULATESTD = {
    title: 'Populate Standards Codelists',
    content: `
##### About
Each codelist can be connected to a codelist from a standard Controlled Terminology.
##### Match Options
* **Match by name**. Codelist names are be compared with each other. It is possible to use the following options which are applied on both sides:
  * **Match case**. When disabled '**No Yes Reponse**' matches '**No yes response**'.
  * **Ignore whitespaces** (including trailing and leading spaces). When enabled '**No Yes Reponse**' matches '** No   YesResponse   **'.
  * **Exclude pattern**. A regular expression used to a remove part of the codelist name before the comparison.
 Default value **\\s*\\(.*\\)\\s*$** removes the last parentheses.
 When specified, '**No Yes Reponse**' matches '**No Yes Response (Y Subset)**'.
* **Match by C-Code**. In case the imported Define-XML has a standard C-Code specified for the codelists,
 it will be used to select a corresponding codelist in the standard Controlled Terminology.
`
};

export const CODELIST_LINK = {
    title: 'Link Decoded and Enumeration Codelists',
    content: `
### About
A pair of linked codelists, is a pair of Enumeration and Decoded codelists, where values of the Enumeration codelist are equal to decoded values of the Decoded codelist. This function allows to search for such pairs of Decoded and Enumeration codelists and link them automatically.
### Match Options
* **Match by values**. Codelists are compared with each other item by item. You can use the following compare options which are applied on both Decoded and Enumeration codelists:
  * **Match codelist item order**. When enabled the codelists are linked if they have matching items in the same order.
  * **Match case**. When disabled '**Pulse Rate**' matches '**Pulse rate**'.
  * **Ignore whitespaces** (including trailing and leading spaces). When enabled '**Pulse Rate**' matches '** PulseRate   **'.

In case two codelists are linked together, values of the Enumeration codelist are updated with decode values of the Decoded codelist. The options control how the codelists are linked, but not how the values are updated.
`
};

export const VARIABLE_FILTER = {
    title: 'Filter',
    content: `
#### About
Filter functionality allows to select which records are shown or updated.
#### Field
Object to which the filter is applied. Most fields correspond to attributes shown in the table.
* **Is VLM** - Flag which indicates whether the variable is Value Level Metadata
* **Has VLM** - Flag which indicates whether the variable has Value Level Metadata
* **Has Document** - Flag which shows whether there is a document attached to Comment/Method/Origin
* **Parent Variable** - Allows to filter VLM records which are attached to a specific variable
* **Where Clause** - String corresponding to a where clause (ADLB.PARAMCD EQ "ALT")
#### Comparator
Defines how the field is compared with the specified value.
* **STARTS** - Field starts with a value.
* **ENDS** - Field ends with a value.
* **CONTAINS** - Field contains a value.
* **REGEX** - Field matches a regular expression.
* **REGEXI** - Field matches a regular expression with a /i flag (case-insensitive).
`
};

export const VARIABLE_UPDATE = {
    title: 'Update',
    content: `
#### About
Filter functionality allows to update multiple variables or VLMs within one or several datasets.
#### Filter
The filter is used to select items to which the update is applied. Update button is disabled until there is at least one item selected.
#### Field
Object which is updated. Fields correspond to attributes shown in the table.
#### Update modes
* **Set** - Overwrite existing or create a new field value.
* **Replace** - Search for a specific text in the field and replace it. It is possible to use regular expressions.
Regular expressions should not be enclosed in delimiters (e.g., /^\\w+$/) and written without them: ^\\w+$.
Matched groups can be referenced using $1, $2, ... $n.

**Warning** Be careful when using regex with zero-length matches as this may lead to an unexpected result.
Zero-length matches are those which can match 0 characters, e.g., '**.***', '**\\b**', '**a***'.
Replacing string 'foo' with 'bar' using regex **(foo)*** will result in 'barbar'. Use regexes like '**.+**', '**\\b\\w**', '**\\sa***' instead.
This is how regular expressions work, SAS programmers can try it by executing **prxChange('s/(foo)*/bar/', -1, 'foo')**.
`
};

export const CT_LOCATION = {
    title: 'Loading Controlled Terminology',
    content: `
#### About
Visual Define-XML Editor allows to browse and utilize CDISC/NCI Controlled Terminology when create a Define-XML document.
#### Loading from a Local File
To load a controlled terminology in studies you need to specify in Settings a folder containing files with the controlled terminology. Once specified this folder can be scanned from the Controlled Terminology page (this page can be selected in the Main Menu).

There is no need to put all files in the same folder, as the folder is scanned including all subfolders.
#### Loading from CDISC Library
Controlled Terminology can be downloaded from the CDISC Library. See CDISC Library settings for more details.
#### Format
It is expected that Controlled Terminology files are downloaded in XML format from the NCI site (\`https://evs.nci.nih.gov/ftp1/CDISC/\`).
#### Custom Controlled Terminology
Any Controlled Terminology XML file can be loaded as long as it is created according to the Controlled Terminology in ODM XML specification (\`https://evs.nci.nih.gov/ftp1/CDISC/ControlledTerminologyODM.pdf\`).
`
};

export const CODELIST_TO_VLM = {
    title: 'Create Value Level Metadata from Values of a Codelist',
    content: `
#### About
A Value-Level Metadata can also be created using values of a variable with attached decoded or enumerated codelist. To do so, select a variable in the dropdown menu
(only variables of the current dataset are listed) and pick items of the corresponding codelist to form VLM entries.
Based on the selection, a number of VLM records will be added with the following attributes:
* **Name** - Names are populated from the *Coded Value* codelist column.
* **Label** - Labels are populated from the *Decode* column of a decoded codelist. In case a variable with enumerated codelist is selected as a source, this attribute is left blank.
* **Where Clause** - Where Clauses are populated according to pattern *<Source Variable> EQ <Coded Value>*.
`
};

export const CDISC_LIBRARY = {
    title: 'CDISC Library',
    content: `
#### About
CDISC Library is the single, trusted, authoritative source of CDISC standards metadata. It contains information about CDISC Standards as well as CDISC Terminology.
Visual Define-XML Editor allows to browse CDISC Library and use it for the development of the Define-XML documents.
#### Credentials
CDISC Library requires credentials in order to access it. These are not the CDISC account credentials and you need to obtain separate credentials for the CDISC Library usage.
See \`https://www.cdisc.org/cdisc-library\` to find more information about it.
#### Storage of Credentials
The credentials are stored on your computer in an encrypted format. If you update your computer or change your user name and the CDISC Library functionality does not work anymore, you need to enter the credentials once again.
#### Traffic Statistics
CDISC Library does not provide information on the amounth of traffic used. This statistics is calculated by the application based on the size of the packages sent and received from the CDISC Library API and shall not be relied on. To get the exact traffic usage statistics, consult the CDISC Library support.
#### CDISC Relay
If you would like users to avoid the need to specify credentials, consider using CLA Relay \`https://github.com/defineEditor/cla-relay\`. In this case **baseURL** shall contain the URL of the server where CLA-Relay is installed (e.g., \`http://my.server.int:4600/api\`).
#### Disclaimer
Visual Define-XML Editor does not instruct how CDISC Library shall be used, nor represents CDISC in any way. Check your CDISC Library account EULA for the details on how CDISC Library can be used. If you have any questions regarding the contents of CDISC Library, please write to the CDISC Library support.
`
};
