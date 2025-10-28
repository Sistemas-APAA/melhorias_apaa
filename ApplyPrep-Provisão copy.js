/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search', 'N/log'], function(record, search, log) {

    function afterSubmit(context) {
        try {
            var isDelete = (context.type === context.UserEventType.DELETE);

            var appRecord = isDelete ? context.oldRecord : context.newRecord;
            var totalApplied = parseFloat(appRecord.getValue({ fieldId: 'applied' })) || 0;

            log.debug(isDelete ? 'Estornando pré-pagamento' : 'Aplicando pré-pagamento', totalApplied);

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

                    log.debug('Fatura vinculada', billId);

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
                        var appliedBefore = parseFloat(result.getValue('custbody_prepgto_aplicado') || 0);
                        var aplicarBefore = parseFloat(result.getValue('custbody_prepgto_a_aplicar') || 0);
                        var saldoBefore   = parseFloat(result.getValue('custbody_saldo_pagar') || 0);

                        var novoAplicado, novoAplicar, novoSaldo;

                        if (isDelete) {
                            // ESTORNA valores
                            novoAplicado = appliedBefore - totalApplied;
                            novoAplicar  = aplicarBefore - totalApplied;
                            novoSaldo    = saldoBefore + totalApplied;
                        } else {
                            // APLICA valores
                            novoAplicado = appliedBefore + totalApplied;
                            novoAplicar  = aplicarBefore + totalApplied;
                            novoSaldo    = saldoBefore - totalApplied;
                        }

                        log.debug('Atualizando provisão', {
                            provId: provId,
                            antes: { aplicado: appliedBefore, aplicar: aplicarBefore, saldo: saldoBefore },
                            depois: { aplicado: novoAplicado, aplicar: novoAplicar, saldo: novoSaldo }
                        });

                        // Atualiza a provisão
                        record.submitFields({
                            type: 'customtransaction_provisaocontratos',
                            id: provId,
                            values: {
                                custbody_prepgto_aplicado: novoAplicado,
                                custbody_prepgto_a_aplicar: novoAplicar,
                                custbody_saldo_pagar: novoSaldo
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
