/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */

define([
    'N/ui/serverWidget',
    'N/search',
    'N/runtime',
    'N/url',
    'N/file',
    'N/render',
    'N/xml',
    'N/record'
],
    function (
        serverWidget,
        search,
        runtime,
        url,
        file,
        render,
        xml,
        record
    ) {

        function beforeLoad(context) {
            if (context.type == context.UserEventType.VIEW || context.type == context.UserEventType.EDIT) {
                var form = context.form;

                form.getField({ id: 'custbody_bit_url_docs' })
                    .updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });

                form.getField({ id: 'custbody_bit_name_docs' })
                    .updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
            }

            if (
                context.type == context.UserEventType.VIEW
            ) {
                var form = context.form;
                var id = context.newRecord.id;
                var findFile = _fetchFile(id);
                log.debug('findFile', findFile)

                if (!id) return;
                if (findFile > 0) return;

                const arrayFiles = [];
                const arrayUrl = [];
                var name = '';

                const accountId = runtime.getCurrentScript().accountId;
                const domain = 'https://' + url.resolveDomain({ hostType: url.HostType.APPLICATION, accountId: accountId });

                var recordObj = record.load({ type: record.Type.PURCHASE_ORDER, id: id });

                search.create({
                    type: "customrecord_bit_rt_documents",
                    filters:
                        [
                            ["custrecord_bit_doc_link", "anyof", id],
                            "AND",
                            ["custrecord_bit_doc_link.mainline", "is", "T"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "custrecord_bit_doc_document", label: "Documento" }),
                            search.createColumn({ name: "created", label: "Data de criação", sort: search.Sort.DESC })
                        ]
                }).run().getRange({ start: 0, end: 1000 }).forEach(function (result) {
                    var fileObj = file.load({ id: result.getValue(result.columns[0]) });
                    var url = domain + fileObj.url;
                    var type = fileObj.fileType;
                    var isOnline = fileObj.isOnline;

                    if (type != "PDF") return;

                    // arrayUrl.push(url);
                    // name = name ? name + ', ' + fileObj.name : fileObj.name;
                    arrayFiles.push({ 'url': url, 'name': fileObj.name });

                    if (isOnline) return;

                    fileObj.isOnline = true;
                    fileObj.save();
                });

                log.debug('arrayFiles', arrayFiles);

                var filteredArray = arrayFiles.filter(function (item) {
                    var name = item.name.toLowerCase();
                    if (name.includes('minuta')) {
                        return item.url;
                    }
                });

                // Adiciona os itens que não têm 'Minuta' no nome ao final do array filtrado
                filteredArray = filteredArray.concat(arrayFiles.filter(function (item) {
                    var name = item.name.toLowerCase();
                    if (!name.includes('minuta')) {
                        return item.url;
                    }
                }));

                filteredArray.forEach(function (result) {
                    arrayUrl.push(result.url);
                    name = name ? name + ', ' + result.name : result.name;
                })

                log.debug('filteredArray', filteredArray);
                log.debug('arrayUrl', arrayUrl);

                if (arrayUrl.length > 0) {
                    recordObj.setValue({ fieldId: 'custbody_bit_url_docs', value: JSON.stringify(arrayUrl) });
                    recordObj.setValue({ fieldId: 'custbody_bit_name_docs', value: JSON.stringify(name) });
                    recordObj.save({ enableSourcing: true, ignoreMandatoryFields: true });
                }
            }

            if (context.type == context.UserEventType.PRINT) {
                const id = context.newRecord.id;
                var findFile = _fetchFile(id);

                if (findFile > 0) return;

                var recordObj = record.load({ type: record.Type.PURCHASE_ORDER, id: id });

                var nameEntity = recordObj.getText({ fieldId: 'entity' });
                var tranid = recordObj.getValue({ fieldId: 'tranid' });
                var nameFile = 'Contrato_' + nameEntity + '_' + tranid + '.pdf';

                const fileId = renderSet(nameFile, recordObj);

                record.attach({
                    record: { type: 'file', id: fileId },
                    to: { type: 'purchaseorder', id: id }
                });
            }

            function renderSet(nameFile, recordObj) {
                try {
                    var renderer = render.create();
                    renderer.setTemplateByScriptId('CUSTTMPL_BIT_NEW_CONTRACT'); // Substitua pelo ID do seu template
                    renderer.addRecord('record', recordObj);
                    var pdfFile = renderer.renderAsPdf();

                    pdfFile.name = nameFile
                    pdfFile.isOnline = true
                    pdfFile.folder = 112736

                    var fileId = pdfFile.save()
                    return fileId

                } catch (error) {
                    log.debug({
                        title: "error in renderSet",
                        details: error
                    })
                }
            }
        }

        function _fetchFile(id) {
            return search.create({
                type: "transaction",
                filters:
                    [
                        ["internalidnumber", "equalto", id],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["taxline", "is", "F"],
                        "AND",
                        ["cogs", "is", "F"],
                        "AND",
                        ["shipping", "is", "F"],
                        "AND",
                        ["file.filetype", "anyof", "PDF"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", join: "file", sort: search.Sort.DESC, label: "Internal ID" }),
                        search.createColumn({ name: "url", join: "file", label: "URL" }),
                        search.createColumn({ name: "name", join: "file" })
                    ]
            }).run().getRange({ start: 0, end: 1000 }).length;
        }

        return {
            beforeLoad: beforeLoad
        };
    });