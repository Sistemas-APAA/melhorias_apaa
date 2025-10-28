/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/currentRecord', 'N/log'], function(currentRecord, log) {

    function fieldChanged(context) {
        try {
            var currentRec = currentRecord.get();
            
            if (context.fieldId === 'custbody_bit_tp_doc_pago') {
                var linhaCount = currentRec.getLineCount({ sublistId: 'installment' });

                for (var i = 0; i < linhaCount; i++) {
                    currentRec.selectLine({
                        sublistId: 'installment',
                        line: i
                    });

                    currentRec.setCurrentSublistValue({
                        sublistId: 'installment',
                        fieldId: 'custcol_metodo_pagamento', // ID correto do campo
                        value: '1' // ID interno do valor desejado
                    });

                    currentRec.commitLine({
                        sublistId: 'installment'
                    });
                }

                log.debug('Método de pagamento setado nas parcelas.');
            }
        } catch (e) {
            log.error('Erro ao setar método de pagamento', e);
        }
    }

    return {
        fieldChanged: fieldChanged
    };
});
