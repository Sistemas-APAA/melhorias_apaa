/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope Public
 */

define([
    'N/search',
    'N/record',
    'N/runtime',
    'N/ui/dialog'
],
    function (
        search,
        record,
        runtime,
        dialog
    ) {
        function validateLine(context) {
            const currentRecord = context.currentRecord;
            const requisitionId = currentRecord.id;
            const approver = currentRecord.getValue({ fieldId: 'custbody_bit_approver' });
            const userObj = runtime.getCurrentUser();
            const userId = userObj.id

            if (requisitionId) {
                if (context.sublistId == 'recmachcustrecord_bit_cot_purchreq' && userId == approver) {
                    const currentScript = runtime.getCurrentScript();
                    const parameterStatus = currentScript.getParameter({ name: 'custscript_bit_status_quote' });

                    const statusQuote = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_cot_purchreq', fieldId: 'custrecord_bit_cot_status' });

                    if (statusQuote == parameterStatus) {
                        const idQuote = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_cot_purchreq', fieldId: 'id' });
                        // console.log('requisitionId: ' + requisitionId)
                        // console.log('idQuote: ' + idQuote)

                        //Validação se já existe itens premiados em outras cotações.
                        var linesItensCot = currentRecord.getLineCount({ sublistId: 'recmachcustrecord_bit_rt_itens_transaction' });
                        var findPremio = false;

                        for (var i = 0; i < linesItensCot; i++) {
                            var idLineCot = currentRecord.getSublistValue({ sublistId: 'recmachcustrecord_bit_rt_itens_transaction', fieldId: 'custrecord_bit_rt_itens_link', line: i });

                            if (idLineCot != idQuote) {
                                var premio = currentRecord.getSublistValue({ sublistId: 'recmachcustrecord_bit_rt_itens_transaction', fieldId: 'custrecord_bit_rt_itens_premio', line: i });
                                if (premio) {
                                    findPremio = true;
                                };
                            };
                        };

                        if (findPremio) {
                            dialog.alert({
                                title: 'Alerta!',
                                message: 'Já existem outras linhas premiadas para outras cotações.'
                            });

                            return false;
                        };

                        // Realiza o preenchimento das linhas premiadas.
                        var linesItensCot = currentRecord.getLineCount({ sublistId: 'recmachcustrecord_bit_rt_itens_transaction' });
                        for (var i = 0; i < linesItensCot; i++) {
                            var idLineCot = currentRecord.getSublistValue({ sublistId: 'recmachcustrecord_bit_rt_itens_transaction', fieldId: 'custrecord_bit_rt_itens_link', line: i });
                            if (idLineCot == idQuote) {
                                currentRecord.selectLine({ sublistId: 'recmachcustrecord_bit_rt_itens_transaction', line: i });
                                currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_rt_itens_transaction', fieldId: 'custrecord_bit_rt_itens_premio', value: true });
                                currentRecord.commitLine({ sublistId: 'recmachcustrecord_bit_rt_itens_transaction' });
                            };
                        };

                        return true;

                    } else {
                        return true;
                    };

                } else if (context.sublistId == 'recmachcustrecord_bit_rt_itens_transaction') {
                    const idQuoteLine = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_rt_itens_transaction', fieldId: 'custrecord_bit_rt_itens_link' });
                    const indexLine = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_rt_itens_transaction', fieldId: 'custrecord_bit_rt_itens_index' });
                    const premioLine = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_rt_itens_transaction', fieldId: 'custrecord_bit_rt_itens_premio' });

                    // console.log('idQuoteLine: ' + idQuoteLine)
                    // console.log('indexLine: ' + indexLine)
                    // console.log('premioLine: ' + premioLine)

                    if (premioLine) {
                        var linesItensCot = currentRecord.getLineCount({ sublistId: 'recmachcustrecord_bit_rt_itens_transaction' });
                        for (var i = 0; i < linesItensCot; i++) {
                            var idLineCot = currentRecord.getSublistValue({ sublistId: 'recmachcustrecord_bit_rt_itens_transaction', fieldId: 'custrecord_bit_rt_itens_link', line: i });
                            var indexLineCot = currentRecord.getSublistValue({ sublistId: 'recmachcustrecord_bit_rt_itens_transaction', fieldId: 'custrecord_bit_rt_itens_index', line: i });
                            var premioLineCot = currentRecord.getSublistValue({ sublistId: 'recmachcustrecord_bit_rt_itens_transaction', fieldId: 'custrecord_bit_rt_itens_premio', line: i });

                            if (idLineCot != idQuoteLine && indexLine == indexLineCot && premioLineCot == true) {
                                dialog.alert({
                                    title: 'Alerta!',
                                    message: 'Já existe a mesma linha premiada em outras cotações.'
                                });

                                return false;
                            };
                        };

                        return true;
                    } else {
                        return true;
                    };
                } else {
                    return true;
                };

            } else {
                return true;
            };
        };

        function saveRecord(context) {
            const currentScript = runtime.getCurrentScript();
            const parameterStatus = currentScript.getParameter({ name: 'custscript_bit_body_status' });
            const parameterStatusParcial = currentScript.getParameter({ name: 'custscript_bit_body_status_parcial' });

            const currentRecord = context.currentRecord;

            var lineItens = currentRecord.getLineCount({ sublistId: 'item' });
            var linesItensCot = currentRecord.getLineCount({ sublistId: 'recmachcustrecord_bit_rt_itens_transaction' });
            var quantityPremio = 0;

            for (var i = 0; i < linesItensCot; i++) {
                var premioLineCot = currentRecord.getSublistValue({ sublistId: 'recmachcustrecord_bit_rt_itens_transaction', fieldId: 'custrecord_bit_rt_itens_premio', line: i });

                if (premioLineCot) {
                    quantityPremio++
                };
            };

            if (quantityPremio == lineItens) {
                currentRecord.setValue({ fieldId: 'custbody_bit_body_status_cot', value: parameterStatus });
            };

            if (quantityPremio > 0 && quantityPremio < lineItens) {
                currentRecord.setValue({ fieldId: 'custbody_bit_body_status_cot', value: parameterStatusParcial });
            };

            return true;
        }

        function fieldChanged(context) {
            const currentRecord = context.currentRecord;
            const requisitionId = currentRecord.id;
            const approver = currentRecord.getValue({ fieldId: 'custbody_bit_approver' });
            const userObj = runtime.getCurrentUser();
            const userId = userObj.id

            const currentScript = runtime.getCurrentScript();
            const parameterStatus = currentScript.getParameter({ name: 'custscript_bit_status_quote' });

            var fieldId = context.fieldId;
            var lineNum = context.line;

            if (fieldId == 'custrecord_bit_anexo_doc' || fieldId == 'custrecord_bit_anexo_doc_item') {
                var sublistId = 'recmachcustrecord_bit_anexo_link';

                currentRecord.selectLine({ sublistId: sublistId, line: lineNum });
                var docName = currentRecord.getCurrentSublistText({ sublistId: sublistId, fieldId: fieldId });
                currentRecord.setCurrentSublistValue({ sublistId: sublistId, fieldId: 'name', value: docName, ignoreFieldChange: true });
                // currentRecord.commitLine({ sublistId: sublistId });
            };

            if (fieldId == 'custrecord_bit_cot_status' || fieldId == 'custrecord_bit_rt_itens_premio') {
                if (userId != approver) {

                    if (fieldId == 'custrecord_bit_cot_status') {

                        var sublistId = 'recmachcustrecord_bit_cot_purchreq';

                        currentRecord.selectLine({ sublistId: sublistId, line: lineNum });
                        var valueField = currentRecord.getCurrentSublistValue({ sublistId: sublistId, fieldId: fieldId });
                        currentRecord.commitLine({ sublistId: sublistId });

                        var value = valueField == parameterStatus ? '' : parameterStatus;
                    }

                    if (fieldId == 'custrecord_bit_rt_itens_premio') {
                        var sublistId = 'recmachcustrecord_bit_rt_itens_transaction';
                        var value = false;

                        currentRecord.selectLine({ sublistId: sublistId, line: lineNum });
                        var valueField = currentRecord.getCurrentSublistValue({ sublistId: sublistId, fieldId: fieldId });
                        currentRecord.commitLine({ sublistId: sublistId });

                        var value = valueField ? false : true;
                    }

                    currentRecord.selectLine({ sublistId: sublistId, line: lineNum });
                    currentRecord.setCurrentSublistValue({ sublistId: sublistId, fieldId: fieldId, value: value, ignoreFieldChange: true });
                    currentRecord.commitLine({ sublistId: sublistId });

                    dialog.alert({
                        title: 'Alerta!',
                        message: 'Apenas o aprovador consegue atualizar os itens de cotação.'
                    });
                }
            }
        }

        return {
            validateLine: validateLine,
            saveRecord: saveRecord,
            fieldChanged: fieldChanged
        };
    });