/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search', 'N/log'], function(record, search, log) {

    function afterSubmit(context) {
        try {
            var appRecord = context.newRecord;

            // Valor total do Vendor Prepayment Application
            var totalApplied = parseFloat(appRecord.getValue({ fieldId: 'applied' })) || 0;
            log.debug('Total do pré-pagamento', totalApplied);

            // Sublista Bill
            var lineCount = appRecord.getLineCount({ sublistId: 'bill' });

            for (var i = 0; i < lineCount; i++) {
                var applied = appRecord.getSublistValue({
                    sublistId: 'bill',
                    fieldId: 'apply',
                    line: i
                });

                if (applied) {
                    // Pega o campo doc da linha (ID da fatura)
                    var billId = appRecord.getSublistValue({
                        sublistId: 'bill',
                        fieldId: 'doc',
                        line: i
                    });

                    if (!billId) {
                        log.debug('Linha sem doc', i);
                        continue;
                    }

                    log.debug('Fatura aplicada', billId);

                    // Buscar provisões relacionadas
                    var provSearch = search.create({
                        type: 'customtransaction_provisaocontratos',
                        filters: [
                            ['custbody_nfemitida', 'anyof', billId]
                        ],
                        columns: [
                            search.createColumn({ name: 'internalid' }),
                            search.createColumn({ name: 'custbody_prepgto_aplicado' }),
                            search.createColumn({ name: 'custbody_prepgto_a_aplicar' }),
                            search.createColumn({ name: 'custbody_saldo_pagar' }),
                            search.createColumn({ name: 'tranid' })
                        ]
                    });

                    provSearch.run().each(function(result) {
                        var provId = result.getValue('internalid');
                        var existingValue = parseFloat(result.getValue('custbody_prepgto_aplicado') || 0);
                        var existingValueAplicar = parseFloat(result.getValue('custbody_prepgto_a_aplicar') || 0);
                        var aPagar =  parseFloat(result.getValue('custbody_saldo_pagar') || 0);
                        var aplicado = existingValue + totalApplied
                        var saldoApagar = aPagar - (aplicado - existingValueAplicar)
                        log.debug('Provisão encontrada', { provId: provId, tranid: result.getValue('tranid') });

                        // Atualiza custbody_prepgto_aplicado
                        record.submitFields({
                            type: 'customtransaction_provisaocontratos',
                            id: provId,
                            values: {
                                custbody_prepgto_aplicado: aplicado,
                                custbody_prepgto_a_aplicar: aplicado - existingValueAplicar,
                                custbody_saldo_pagar: saldoApagar
                            },
                            options: { enableSourcing: false, ignoreMandatoryFields: true }
                        });

                        return true; // continuar
                    });
                }
            }

        } catch (e) {
            log.error('Erro ao processar Vendor Prepayment Application', e);
        }
    }

    return {
        afterSubmit: afterSubmit
    };
});
