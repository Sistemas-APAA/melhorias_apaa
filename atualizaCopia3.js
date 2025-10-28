/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/log'], function(record, log) {
    function beforeSubmit(context) {
        if (context.type !== 'copy' && context.type !== 'create') return;

        var newRecord = context.newRecord;
        var recordId = newRecord.id; // Se for uma cópia, ID será undefined
        log.debug('ID do Registro', recordId);

        if (recordId) {
            log.debug('Registro não é cópia', 'Abortando script.');
            return;
        }

        newRecord.setValue({ fieldId: 'custbody_bit_funcionario_compras', value: '' });
        newRecord.setValue({ fieldId: 'custbody_bit_body_status_cot', value: 4 });
        newRecord.setValue({ fieldId: 'custbody_bit_inciodacotacao', value: '' });
        newRecord.setValue({ fieldId: 'custbody_bit_fimdacotacao', value: '' });
        newRecord.setValue({ fieldId: 'custbody_data_envio_cotacao', value: '' });
        newRecord.setValue({ fieldId: 'custbody_apaa_016999', value: false });
        newRecord.setValue({ fieldId: 'custbody_apaa_016222', value: false });
        newRecord.setValue({ fieldId: 'custbody_bit_edital_juric', value: '' });
        newRecord.setValue({ fieldId: 'custbody_bit_log_dispensa_juridico', value: '' });
        newRecord.setValue({ fieldId: 'custbody_apaa_016122', value: '' });
        newRecord.setValue({ fieldId: 'custbody1', value: false });
        newRecord.setValue({ fieldId: 'custbody_bit_log_liberado_v_j', value: '' });

        log.debug('Evento COPY detectado', 'Processando...');

        var lineCount = newRecord.getLineCount({ sublistId: 'item' });

        if (lineCount > 0) {
            for (var i = 0; i < lineCount; i++) {
                newRecord.setSublistValue({ sublistId: 'item', fieldId: 'rate', line: i, value: 0 });
                newRecord.setSublistValue({ sublistId: 'item', fieldId: 'amount', line: i, value: 0 });
            }
        }

    }

        function beforeLoad(context) {
            if (context.type === context.UserEventType.COPY) {
                var form = context.form;
                var subsidiaryField = form.getField({ id: 'subsidiary' });
    
                if (subsidiaryField) {
                    subsidiaryField.updateDisplayType({
                        displayType: 'NORMAL'
                    });
                }
            }
        }

    return {
        beforeSubmit: beforeSubmit,
        beforeLoad:beforeLoad
    };
});