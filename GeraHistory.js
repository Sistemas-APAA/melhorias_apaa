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
        const idDocumento = requestBody.id;

        log.debug('RUNNING!', 'Documento: ' + idDocumento);

        const recordObj = record.load({ type: 'customtransaction_solicitacao_almoxarifa', id: idDocumento, isDynamic: true });
        const linesDocumento = recordObj.getLineCount({ sublistId: 'lines' });

        var jsonFormatter = {};
        jsonFormatter['id'] = idDocumento;
        jsonFormatter['employee'] = recordObj.getValue({ fieldId: 'custbody_solicitante_sax' });
        jsonFormatter['approver'] = recordObj.getValue({ fieldId: 'custbody_aprovador_sax' });;


            for (var i = 0; i < linesDocumento; i++) {

                if (i == index) {
                    recordObj.selectLine({ sublistId: 'lines', line: i });
                    lines.push({
                        'index': element.getValue(element.columns[5]),
                        'idRecord': element.getValue(element.columns[4]),
                        'lines': element.getValue(element.columns[1]),
                       // 'description': recordObj.getCurrentSublistValue({ sublistId: 'lines', fieldId: 'description' }),
                        'quantity': element.getValue(element.columns[2]),
                        'rate': element.getValue(element.columns[3]),
                        'amount': element.getValue(element.columns[2]) * element.getValue(element.columns[3]),
                        'department': recordObj.getCurrentSublistValue({ sublistId: 'lines', fieldId: 'department' }),
                        'class': recordObj.getCurrentSublistValue({ sublistId: 'lines', fieldId: 'class' }),
                        'location': recordObj.getCurrentSublistValue({ sublistId: 'lines', fieldId: 'location' })
                    });
                    recordObj.commitLine({ sublistId: 'lines' });
                }
            }
           // jsonFormatter['approver'][indexApprover]['file'] = file;
            jsonFormatter['lines'] = lines;
        

        var governance = runtime.getCurrentScript().getRemainingUsage();

        log.debug('governance', governance);
        log.debug('jsonFormatter', jsonFormatter);

        record.submitFields({
            type: 'customrecord_history_de_para',
            id: requestBody.idHistory,
            values: {
                'custrecord_rt_history_log': JSON.stringify(jsonFormatter)
            }
        })

        task.create({
            taskType: task.TaskType.MAP_REDUCE,
            scriptId: "customscript_bit_create_po_mr",
            params: {
                'custscript_json_po': JSON.stringify(jsonFormatter),
                'custscript_req': idDocumento,
                'custscript_id_history': requestBody.idHistory
            }
        }).submit();

        log.debug('EXEC', 'EXEC');
    

    }
    return {
        onRequest: onRequest
    }
})