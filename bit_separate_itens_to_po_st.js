/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 */
define([
    "N/task",
    "N/record",
    "N/search",
    "N/runtime",
], function (
    task,
    record,
    search,
    runtime
) {
    function onRequest(context) {
        const requestBody = JSON.parse(context.request.body);
        const idRequisition = requestBody.id;

        log.debug('RUNNING!', 'REQ: ' + idRequisition);

        const recordObj = record.load({ type: 'purchaserequisition', id: idRequisition, isDynamic: true });
        const linesRequisiton = recordObj.getLineCount({ sublistId: 'item' });

        var jsonFormatter = {};
        jsonFormatter['id'] = idRequisition;
        jsonFormatter['employee'] = recordObj.getValue({ fieldId: 'entity' });
        jsonFormatter['suppliers'] = [];

        search.create({
            type: "customrecord_bit_sublist_itens_cot",
            filters:
                [
                    ["custrecord_bit_rt_itens_premio", "is", "T"],
                    "AND",
                    ["custrecord_bit_rt_itens_fat", "is", "F"],
                    "AND",
                    ["custrecord_bit_rt_itens_transaction", "anyof", idRequisition]
                ],
            columns:
                [
                    search.createColumn({
                        name: "custrecord_bit_rt_itens_forncedor",
                        summary: "GROUP",
                        label: "Fornecedor"
                    })
                ]
        }).run().getRange({ start: 0, end: 1000 }).forEach(function (element, indexSupplier) {
            var idSupplier = element.getValue(element.columns[0]);
            var nameSupplier = element.getText(element.columns[0]);
            var lines = [];
            var file = '';

            jsonFormatter['suppliers'].push({
                'idSupplier': idSupplier,
                'nameSupplier': nameSupplier,
            })

            log.audit('SUPPLIER: ' + idSupplier, nameSupplier);

            search.create({
                type: "customrecord_bit_sublist_itens_cot",
                filters:
                    [
                        ["custrecord_bit_rt_itens_premio", "is", "T"],
                        "AND",
                        ["custrecord_bit_rt_itens_fat", "is", "F"],
                        "AND",
                        ["custrecord_bit_rt_itens_transaction", "anyof", idRequisition],
                        "AND",
                        ["custrecord_bit_rt_itens_forncedor", "anyof", idSupplier],
                    ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_bit_rt_itens_index" }),
                        search.createColumn({ name: "custrecord_bit_rt_itens_purchitem" }),
                        search.createColumn({ name: "custrecord_bit_rt_itens_quantity" }),
                        search.createColumn({ name: "custrecord_bit_rt_itens_amount" }),
                        search.createColumn({ name: "internalid" }),
                        search.createColumn({ name: "custrecord_bit_rt_itens_index" }),
                        search.createColumn({ name: "custrecord_bit_cotacao", join: "CUSTRECORD_BIT_RT_ITENS_LINK" })
                    ]
            }).run().getRange({ start: 0, end: 1000 }).forEach(function (element) {
                var index = element.getValue(element.columns[0]);
                file = element.getValue(element.columns[6])
                log.audit('index: ' + idSupplier, index);

                for (var i = 0; i < linesRequisiton; i++) {

                    if (i == index) {
                        recordObj.selectLine({ sublistId: 'item', line: i });
                        lines.push({
                            'index': element.getValue(element.columns[5]),
                            'idRecord': element.getValue(element.columns[4]),
                            'item': element.getValue(element.columns[1]),
                            'description': recordObj.getCurrentSublistValue({ sublistId: 'item', fieldId: 'description' }),
                            'quantity': element.getValue(element.columns[2]),
                            'rate': element.getValue(element.columns[3]),
                            'amount': element.getValue(element.columns[2]) * element.getValue(element.columns[3]),
                            'cseg_bit_depart': recordObj.getCurrentSublistValue({ sublistId: 'item', fieldId: 'cseg_bit_depart' }),
                            'class': recordObj.getCurrentSublistValue({ sublistId: 'item', fieldId: 'class' }),
                            'custcol_bit_minucios': recordObj.getCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol_bit_minucios' })
                        });
                        recordObj.commitLine({ sublistId: 'item' });
                    }
                }

            })
            jsonFormatter['suppliers'][indexSupplier]['file'] = file;
            jsonFormatter['suppliers'][indexSupplier]['lines'] = lines;
        });

        var governance = runtime.getCurrentScript().getRemainingUsage();

        log.debug('governance', governance);
        log.debug('jsonFormatter', jsonFormatter);

        record.submitFields({
            type: 'customrecord_bit_rt_history',
            id: requestBody.idHistory,
            values: {
                'custrecord_bit_rt_history_log': JSON.stringify(jsonFormatter)
            }
        })

        task.create({
            taskType: task.TaskType.MAP_REDUCE,
            scriptId: "customscript_bit_create_po_mr",
            params: {
                'custscript_bit_json_po': JSON.stringify(jsonFormatter),
                'custscript_bit_req': idRequisition,
                'custscript_bit_id_history': requestBody.idHistory
            }
        }).submit();

        log.debug('EXEC', 'EXEC');
    }

    return {
        onRequest: onRequest
    }
});
