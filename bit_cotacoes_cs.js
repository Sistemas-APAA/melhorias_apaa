/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope Public
 */

define([
    'N/search',
    'N/record',
    'N/error'
],
    function (
        search,
        record,
        error
    ) {
        function pageInit(context) {
            const currentUrl = document.location.href;
            const url = new URL(currentUrl);
            const requisitionId = url.searchParams.get("pi");

            if (requisitionId) {
                context.currentRecord.setValue({ fieldId: 'custrecord_bit_cot_purchreq', value: requisitionId });
            }

            if (context.currentRecord.id) {
                var requisitionField = context.currentRecord.getField("custrecord_bit_cot_purchreq");
                requisitionField.isDisabled = true;
            }
        }

        // function lineInit(context) {
        //     if (context.sublistId == 'recmachcustrecord_bit_rt_itens_link') {
        //         const status = context.currentRecord.getValue({ fieldId: 'custrecord_bit_cot_status' });
        //         const itensSublist = context.currentRecord.getSublist({ sublistId: 'recmachcustrecord_bit_rt_itens_link' });
        //         const column = itensSublist.getColumn({ fieldId: 'custrecord_bit_rt_itens_premio' });
        //         const column2 = itensSublist.getColumn({ fieldId: 'custrecord_bit_rt_itens_purchitem' });
        //         const column3 = itensSublist.getColumn({ fieldId: 'custrecord_bit_rt_itens_quantity' });
        //         const column4 = itensSublist.getColumn({ fieldId: 'custrecord_bit_rt_itens_amount' });
        //         const column5 = itensSublist.getColumn({ fieldId: 'custrecord_bit_rt_itens_memo' });
        //         const column6 = itensSublist.getColumn({ fieldId: 'custrecord_bit_rt_itens__attachment' });

        //         if (status != 2) { // Aguardando aprovação
        //             column.isDisabled = true;
        //         } else {
        //             column.isDisabled = false;
        //         }

        //         if (status != 1) { // Enviar para aprovação
        //             column2.isDisabled = true;
        //             column3.isDisabled = true;
        //             column4.isDisabled = true;
        //             column5.isDisabled = true;
        //             column6.isDisabled = true;
        //         }
        //     }
        // }

        function fieldChanged(context) {
            if (!context.currentRecord.id) { //create mode
                const currentRecord = context.currentRecord;

                if (context.fieldId == 'custrecord_bit_cot_purchreq') {
                    const requisitionId = currentRecord.getValue({ fieldId: 'custrecord_bit_cot_purchreq' });

                    if (!requisitionId) return;

                    const requisitionObj = record.load({ type: 'purchaserequisition', id: requisitionId, isDynamic: true });
                    const linesItens = requisitionObj.getLineCount({ sublistId: 'item' });

                    currentRecord.setValue({ fieldId: 'custrecord_bit_cot_solicitante', value: requisitionObj.getValue({ fieldId: 'entity' }) });

                    for (var i = 0; i < linesItens; i++) {
                        requisitionObj.selectLine({ sublistId: 'item', line: i });
                        var itemRequisition = requisitionObj.getCurrentSublistValue({ sublistId: 'item', fieldId: 'item' });
                        var quantityRequisition = requisitionObj.getCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity' });
                        var amountRequisition = requisitionObj.getCurrentSublistValue({ sublistId: 'item', fieldId: 'amount' });
                        requisitionObj.commitLine({ sublistId: 'item' });

                        currentRecord.selectNewLine({ sublistId: 'recmachcustrecord_bit_rt_itens_link' });
                        currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_rt_itens_link', fieldId: 'custrecord_bit_rt_itens_transaction', value: requisitionId });
                        currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_rt_itens_link', fieldId: 'custrecord_bit_rt_itens_purchitem', value: itemRequisition });
                        currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_rt_itens_link', fieldId: 'custrecord_bit_rt_itens_quantity', value: quantityRequisition });
                        currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_rt_itens_link', fieldId: 'custrecord_bit_rt_itens_amount', value: amountRequisition });
                        currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_rt_itens_link', fieldId: 'custrecord_bit_rt_itens_index', value: i });
                        currentRecord.commitLine({ sublistId: 'recmachcustrecord_bit_rt_itens_link' });
                    }
                    log.debug('requisitionId', requisitionId)
                }

                if (context.fieldId == 'custrecord_bit_cot_entity') {
                    const vendor = currentRecord.getValue({ fieldId: 'custrecord_bit_cot_entity' });

                    const linesItens = currentRecord.getLineCount({ sublistId: 'recmachcustrecord_bit_rt_itens_link' });
                    for (var i = 0; i < linesItens; i++) {
                        currentRecord.selectLine({ sublistId: 'recmachcustrecord_bit_rt_itens_link', line: i });
                        currentRecord.setCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_rt_itens_link', fieldId: 'custrecord_bit_rt_itens_forncedor', value: vendor });
                        currentRecord.commitLine({ sublistId: 'recmachcustrecord_bit_rt_itens_link' });
                    }
                }
            }
        }

        return {
            pageInit: pageInit,
            // lineInit: lineInit,
            fieldChanged: fieldChanged
        }
    })