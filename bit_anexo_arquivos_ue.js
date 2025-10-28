/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */

define([
    'N/runtime',
    'N/ui/serverWidget',
    'N/search',
    'N/record'
],
    function (
        runtime,
        serverWidget,
        search,
        record
    ) {

        /*  
            ID LIST
                Tipo de Compra = 1
                Tipo de Item = 2
        */

        function beforeLoad(context) {
            if (
                context.type == context.UserEventType.VIEW
            ) {
                const form = context.form;
                const newRecord = context.newRecord;
                const idPO = newRecord.id;

                var hasDocument = _getDocuments(idPO);

                if (!hasDocument) {
                    form.removeButton('bill');
                }
            }
        }

        function afterSubmit(context) {
            if (
                context.type == context.UserEventType.CREATE
            ) {
                const currentRecord = context.newRecord;
                const idRecord = currentRecord.id;
                const recordObj = record.load({ type: 'purchaseorder', id: idRecord, isDynamic: true });

                const tipoDeCompraId = currentRecord.getValue({ fieldId: 'custbody_bit_tipo_de_compra' });

                if (tipoDeCompraId) {
                    var tipoId = 1; // ID lIST

                    var filters = [{
                        name: 'custrecord_bit_doc_c_link',
                        operator: search.Operator.IS,
                        values: tipoDeCompraId
                    }];

                   var columns = [{
                        name: 'name'
                    },
                    {
                        name: 'custrecord_bit_doc_c_documentos'
                    },
                    {
                        name: 'custrecord_bit_doc_c_contrato'
                    },
                    {
                        name: 'custrecord_bit_doc_c_exec'
                    }];

                    _addLines(recordObj, tipoDeCompraId, '', '', 'customrecord_bit_documents_compra', filters, columns, tipoId, '');

                    const linesSublist = recordObj.getLineCount({ sublistId: 'item' });

                    for (var i = 0; i < linesSublist; i++) {

                        recordObj.selectLine({ sublistId: 'item', line: i })
                        var itemId = recordObj.getCurrentSublistValue({ sublistId: 'item', fieldId: 'item' })
                        var indexLine = recordObj.getCurrentSublistIndex({ sublistId: 'item' });
                        var tipoDeItemId = _get(itemId);
                        var tipoId = 2; // ID lIST

                        if (tipoDeItemId) {
                            var filters = [{
                                name: 'custrecord_bit_doc_i_link',
                                operator: search.Operator.IS,
                                values: tipoDeItemId
                            }];

                            var columns = [{
                                name: 'name'
                            },
                            {
                                name: 'custrecord_bit_doc_i_documentos'
                            },
                            {
                                name: 'custrecord_bit_doc_i_contrato'
                            },
                            {
                                name: 'custrecord_bit_doc_i_exec'
                            }];

                            _addLines(recordObj, '', tipoDeItemId, itemId, 'customrecord_bit_documents_item', filters, columns, tipoId, indexLine);
                        };
                        recordObj.commitLine({ sublistId: 'item' })
                    }
                    const saveId = recordObj.save();
                    log.debug('updated', saveId);
                }
            }
        }

        function _addLines(currentRecord, tipoDeCompraId, tipoDeItemId, itemId, recordType, filters, columns, tipoId, indexLine) {
            // REGRA PARA NÃO GERAR LINHAS SE O INDEX DA LINHA JÁ EXISTIR 

            if (tipoId == 2) {
                var linesSublist = currentRecord.getLineCount({ sublistId: 'recmachcustrecord_bit_anexo_link' });
                var line = linesSublist - 1;
                var lineCount = 0;

                log.debug('Linhas revisadas: ', linesSublist)

                var find = false;

                while (lineCount != linesSublist) {
                    var index = currentRecord.getSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'custrecord_bit_anexo_index', line: line });

                    if (index.length > 0 && index == indexLine) {
                        find = true;
                    }
                    line--;
                    lineCount++
                };

                if (find) {
                    log.debug('Index Encontrado, linha não adicioanda: ', indexLine)
                    return;
                }
            }

            search.create({
                type: recordType,
                filters: filters,
                columns: columns
            })
                .run()
                .each(function (result) {
                    const columnsResult = result.columns

                    currentRecord.selectNewLine({ sublistId: 'recmachcustrecord_bit_anexo_link' });
                    currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'name', value: result.getValue(columnsResult[0]) });
                    currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'custrecord_bit_anexo_tipo', value: tipoId });
                    currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'custrecord_bit_anexo_tipo_compra', value: tipoDeCompraId });
                    currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'custrecord_bit_anexo_tipo_item', value: tipoDeItemId });
                    currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'custrecord_bit_anexo_item', value: itemId });

                    if (tipoDeCompraId) {
                        currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'custrecord_bit_anexo_doc', value: result.id });
                    };

                    if (tipoDeItemId) {
                        currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'custrecord_bit_anexo_doc_item', value: result.id });
                    };

                    currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'custrecord_bit_anexo_contrato', value: result.getValue(columnsResult[2]) });
                    currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'custrecord_bit_anexo_exec', value: result.getValue(columnsResult[3]) });
                    currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'custrecord_bit_anexo_controle', value: true });
                    currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'custrecord_bit_anexo_index', value: indexLine });
                    currentRecord.commitLine({ sublistId: 'recmachcustrecord_bit_anexo_link' });
                    return true;
                });
        }

        function _get(id) {
            var tipoDeItemId = '';

            if (id) {
                search.create({
                    type: "item",
                    filters:
                        [
                            ['internalid', 'is', id]
                        ]
                    ,
                    columns:
                        [
                            search.createColumn({ name: "custitem_apaa_tipo_do_item" }),

                        ]
                }).run().getRange({ start: 0, end: 1000 }).forEach(function (result) {
                    tipoDeItemId = result.getValue("custitem_apaa_tipo_do_item");
                })
            }

            return tipoDeItemId;
        }

        function _getDocuments(id) {
            var hasDocument = true;

            search.create({
                type: "customrecord_bit_anexo_documentos",
                filters:
                    [
                        ['custrecord_bit_anexo_link', 'anyof', id]
                    ]
                ,
                columns:
                    [
                        search.createColumn({ name: "custrecord_bit_anexo_anexo" }),

                    ]
            }).run().getRange({ start: 0, end: 1000 }).forEach(function (result) {
                var idDocument = result.getValue("custrecord_bit_anexo_anexo");
                if (idDocument) { } else { hasDocument = false }
            })

            return hasDocument
        }
        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit
        };
    })