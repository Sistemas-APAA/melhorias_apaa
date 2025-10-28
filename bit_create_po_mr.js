/**
 * @NScriptType MapReduceScript
 * @NApiVersion 2.1
 */
define([
    'N/runtime',
    'N/record',
    'N/search'
],
    function (
        runtime,
        record,
        search
    ) {
        function getInputData(context) {
            const currentScript = runtime.getCurrentScript();
            const _jsonSuppliers = JSON.parse(currentScript.getParameter({ name: 'custscript_bit_json_po' })).suppliers;
            const idRequisition = JSON.parse(currentScript.getParameter({ name: 'custscript_bit_json_po' })).id;

            log.debug('_jsonSuppliers', _jsonSuppliers)
            log.debug('idRequisition', idRequisition)

            return _jsonSuppliers;
        }

        function map(context) {
            const currentScript = runtime.getCurrentScript();
            const _json = JSON.parse(currentScript.getParameter({ name: 'custscript_bit_json_po' }));

            try {
                const element = JSON.parse(context.value);
                const lines = element.lines;
                const fileId = element.file;

                const purchaseOrder = record.transform({
                    fromType: 'purchaserequisition',
                    fromId: _json.id,
                    toType: 'purchaseorder',
                    isDynamic: true
                });

                purchaseOrder.setValue({ fieldId: 'entity', value: element.idSupplier });
                purchaseOrder.setValue({ fieldId: 'employee', value: _json.employee });

                lines.sort(function (a, b) {
                    return b.index - a.index;
                });
                log.debug('lines', lines)

                const linesPurchaseOrder = purchaseOrder.getLineCount({ sublistId: 'item' });

                for (var i = (linesPurchaseOrder - 1); i != -1; i--) {
                    var find = false;

                    for (var x = 0; x < lines.length; x++) {
                        if (i == lines[x].index) {
                            find = true;
                            log.debug('find: ' + find, lines[x].index)

                            purchaseOrder.selectLine({ sublistId: 'item', line: lines[x].index })
                            purchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: lines[x].quantity })
                            purchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: lines[x].rate })
                            purchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'amount', value: lines[x].amount })
                            purchaseOrder.commitLine({ sublistId: 'item' })
                        }
                    }

                    if (!find) {
                        log.debug('find: ' + find, i)
                        purchaseOrder.removeLine({ sublistId: 'item', line: i });
                    }
                }


                const saveId = purchaseOrder.save();

                if (fileId) {
                    const recordObj = record.create({ type: 'customrecord_bit_rt_documents', isDynamic: true });
                    recordObj.setValue({ fieldId: 'custrecord_bit_doc_link', value: saveId });
//                    recordObj.setValue({ fieldId: 'custrecord_bit_doc_document', value: fileId });
                    recordObj.save();
                }

                //Update status informando que foi faturado
                lines.forEach(element => {
                    record.submitFields({
                        type: 'customrecord_bit_sublist_itens_cot',
                        id: element.idRecord,
                        values: { custrecord_bit_rt_itens_fat: true }
                    })
                });

                log.debug('saveId', saveId)
            } catch (e) {
                var msg = e.message;
                const idHistory = currentScript.getParameter({ name: 'custscript_bit_id_history' });

                record.submitFields({
                    type: 'customrecord_bit_rt_history',
                    id: idHistory,
                    values: {
                        'custrecord_bit_rt_history_message': msg
                    }
                });

                log.debug('Erro!', msg);
            }
        };


        function summarize(summary) {
            const currentScript = runtime.getCurrentScript();
            const idHistory = currentScript.getParameter({ name: 'custscript_bit_id_history' });

            record.submitFields({
                type: 'customrecord_bit_rt_history',
                id: idHistory,
                values: {
                    'custrecord_bit_rt_history_process': true
                }
            });

            log.debug('SUMMARIZE END PROCESS', idHistory);
            log.debug('SUMMARIZE END PROCESS', idHistory);
            log.debug('SUMMARIZE END PROCESS', idHistory);

            const inputSummaryError = summary.inputSummary.error

            if (inputSummaryError) {
                log.error({ title: 'Input Error', details: inputSummaryError })
            }

            summary.mapSummary.errors.iterator().each(function (key, error) {
                log.error({ title: 'Map Error for key: ' + key, details: error })
                return true
            })
        }

        return {
            'getInputData': getInputData,
            'map': map,
            'summarize': summarize
        }
    })