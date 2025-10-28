define(['N/record', 'N/log'], function(record, log) {
    function beforeSubmit(context) {
        log.debug('Script Iniciado', 'Entrou no beforeSubmit');
        
        if (context.type !== 'copy') {
            log.debug('Evento não é COPY', 'Abortando execução');
            return;
        }

        log.debug('Evento COPY detectado', 'Processando...');
        
        var newRecord = context.newRecord;
        var lineCount = newRecord.getLineCount({ sublistId: 'item' });

        log.debug('Total de Itens', lineCount);

        if (lineCount > 0) {
            for (var i = 0; i < lineCount; i++) {
                log.debug('Zerando item', 'Linha ' + i);

                newRecord.setSublistValue({ sublistId: 'item', fieldId: 'rate', line: i, value: 0 });
                newRecord.setSublistValue({ sublistId: 'item', fieldId: 'amount', line: i, value: 0 });
            }
        }
    }

    return {
        beforeSubmit: beforeSubmit
    };
});
