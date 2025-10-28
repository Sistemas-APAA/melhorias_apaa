/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope Public
 */

define([
    'N/search',
    'N/record',
    'N/error',
    'N/ui/dialog',
    'N/runtime'
],
    function (
        search,
        record,
        error,
        dialog,
        runtime
    ) {
        /*  
            ID LIST
                Tipo de Compra = 1
                Tipo de Item = 2
        */

        function pageInit(context) {
            if (context.mode == 'copy') {
                dialog.alert({
                    title: 'Alerta!',
                    message: 'A customização de <b>Anexo de Documentos APAA</b> não funcionará para copy, apenas para o contexto de create e edit.'
                })
            }
        }

        function fieldChanged(context) {
            if (!context.currentRecord.id || context.currentRecord.id) {
                if (context.fieldId == 'custbody_bit_tipo_de_compra') {
                    const currentRecord = context.currentRecord;
                    const tipoDeCompraId = currentRecord.getValue({ fieldId: 'custbody_bit_tipo_de_compra' });
                    const tipoId = 1; // ID lIST

                    _removeLines(currentRecord, tipoId, '');

                    if (tipoDeCompraId) {
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

                        _addLines(currentRecord, tipoDeCompraId, '', '', 'customrecord_bit_documents_compra', filters, columns, tipoId, '');
                    }
                };
            };
        }

        function validateLine(context) {
            if (context.sublistId == 'item') {
                const currentRecord = context.currentRecord;

                const itemId = currentRecord.getCurrentSublistValue({ sublistId: 'item', fieldId: 'item' });
                const indexLine = currentRecord.getCurrentSublistIndex({ sublistId: 'item' });
                const tipoDeItemId = _get(itemId);
                const tipoId = 2; // ID lIST

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

                    _addLines(currentRecord, '', tipoDeItemId, itemId, 'customrecord_bit_documents_item', filters, columns, tipoId, indexLine);
                };
                return true;
            } else {
                return true;
            };
        }
        function validateDelete(context) {
            const currentRecord = context.currentRecord;

            if (context.sublistId == 'item') {
                const indexLine = currentRecord.getCurrentSublistIndex({ sublistId: 'item' });
                const tipoId = 2; // ID lIST

                console.log(indexLine);
                _removeLines(currentRecord, tipoId, indexLine);

                return true;
                // }
                // else if (context.sublistId == 'recmachcustrecord_bit_anexo_link') {
                //     console.log(runtime)
                //     console.log(runtime.ContextType)
                //     console.log(runtime.executionContext)
                //     console.log(runtime.getCurrentUser())
                //     log.debug('runtime.getCurrentUser()', runtime.getCurrentUser())

                //     if (runtime.executionContext == 'USERINTERFACE') {
                //         const createByScript = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'custrecord_bit_anexo_controle' });
                //         console.log(createByScript)
                //         if (createByScript) {

                //             dialog.alert({
                //                 title: 'Alerta!',
                //                 message: 'Não é possível remover uma linha que foi adicionada por script.'
                //             })

                //             return false;
                //         } else {
                //             return true;
                //         }
                //     } else {
                //         return true;
                //     }
            } else {
                return true;
            }
        }


        function _addLines(currentRecord, tipoDeCompraId, tipoDeItemId, itemId, recordType, filters, columns, tipoId, indexLine) {
            // REGRA PARA NÃO GERAR LINHAS SE O INDEX DA LINHA JÁ EXISTIR 

            if (tipoId == 2) {
                var linesSublist = currentRecord.getLineCount({ sublistId: 'recmachcustrecord_bit_anexo_link' });
                var line = linesSublist - 1;
                var lineCount = 0;

                console.log('Linhas revisadas: ' + linesSublist)

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
                    console.log('Index Encontrado, linha não adicioanda: ' + indexLine)
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

        function _removeLines(currentRecord, tipoId, indexLine) {
            var linesSublist = currentRecord.getLineCount({ sublistId: 'recmachcustrecord_bit_anexo_link' });

            var line = linesSublist - 1;
            var lineCount = 0;

            while (lineCount != linesSublist) {
                var type = currentRecord.getSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'custrecord_bit_anexo_tipo', line: line });
                var index = currentRecord.getSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'custrecord_bit_anexo_index', line: line });

                if (tipoId == 2) {
                    if (index.length > 0 && index == indexLine) {
                        currentRecord.removeLine({ sublistId: 'recmachcustrecord_bit_anexo_link', line: line });
                    }
                } else {
                    if (type == tipoId) {
                        currentRecord.removeLine({ sublistId: 'recmachcustrecord_bit_anexo_link', line: line });
                    }
                }
                line--;
                lineCount++
            };

            //ALTERAÇÃO DE TODOS OS INDEX
            var linesSublist = currentRecord.getLineCount({ sublistId: 'recmachcustrecord_bit_anexo_link' });
            var line = linesSublist - 1;
            var lineCount = 0;

            console.log('Linhas atualizadas: ' + linesSublist)

            while (lineCount != linesSublist) {
                var type = currentRecord.getSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'custrecord_bit_anexo_tipo', line: line });
                var index = currentRecord.getSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'custrecord_bit_anexo_index', line: line });

                if (tipoId == 2) {
                    if (index.length > 0 && index > indexLine) {
                        console.log('index: ' + index)

                        currentRecord.selectLine({ sublistId: 'recmachcustrecord_bit_anexo_link', line: line })
                        currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'custrecord_bit_anexo_index', value: index - 1 })
                        currentRecord.commitLine({ sublistId: 'recmachcustrecord_bit_anexo_link' })
                    }
                }
                line--;
                lineCount++
            };
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

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            validateLine: validateLine,
            validateDelete: validateDelete
        }
    })