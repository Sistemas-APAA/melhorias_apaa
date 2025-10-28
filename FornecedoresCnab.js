/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/log', 'N/search'], function(record, log, search) {

  function onAction(context) {
    try {
      const currentRecord = context.newRecord;
      const cnabId = currentRecord.id;

      const alreadyProcessed = currentRecord.getValue('custrecord_cnab_processado');
      if (alreadyProcessed) {
        log.debug('Registro já processado', `CNAB ID ${cnabId} já foi processado. Saindo do script.`);
        return;
      }

      const rawIds = currentRecord.getValue('custrecord_brl_cnab_dlvfl_lt_instmnt_ids');
      if (!rawIds) {
        log.debug('Campo vazio', 'Nenhum ID encontrado no campo custrecord_brl_cnab_dlvfl_lt_instmnt_ids');
        return;
      }

      const splitIds = rawIds.split('|')
        .map(raw => {
          const [id, numero] = raw.split('-');
          return {
            cleanId: id,
            numero: numero || null
          };
        })
        .filter(obj => obj.cleanId);

      log.debug('IDs processados', JSON.stringify(splitIds));

      splitIds.forEach(function(obj) {
        const transId = obj.cleanId;
        const installmentNumber = obj.numero;
        let transType = null;
        let entityId = null;

        try {
          const typeLookup = search.lookupFields({
            type: search.Type.TRANSACTION,
            id: transId,
            columns: ['recordtype']
          });
          transType = typeLookup.recordtype;
        } catch (e) {
          log.error('Erro ao identificar tipo da transação', `ID: ${transId} - ${e.message}`);
          transType = 'Desconhecido';
        }

        if (transType === 'vendorbill') {
          try {
            const vbRecord = record.load({
              type: 'vendorbill',
              id: transId,
              isDynamic: false
            });
            entityId = vbRecord.getValue('entity');
            log.debug('Fornecedor encontrado', `vendorbill ID ${transId}, entity ID ${entityId}`);

            const installmentLineCount = vbRecord.getLineCount({ sublistId: 'installment' });

            for (let i = 0; i < installmentLineCount; i++) {
              const dueDate = vbRecord.getSublistValue({
                sublistId: 'installment',
                fieldId: 'duedate',
                line: i
              });

              const amount = vbRecord.getSublistValue({
                sublistId: 'installment',
                fieldId: 'amount',
                line: i
              });

              const status = vbRecord.getSublistText({
                sublistId: 'installment',
                fieldId: 'status',
                line: i
              });
              const infoBank = vbRecord.getSublistText({
                sublistId: 'installment',
                fieldId: 'custrecord_brl_inst_l_subs_bank_info',
                line: i
              });
              const typePayment = vbRecord.getSublistText({
                sublistId: 'installment',
                fieldId: 'custrecord_brl_inst_l_type_payment',
                line: i
              });

              log.debug('Prestação encontrada', `Linha ${i + 1} - Vencimento: ${dueDate}, Valor: ${amount}, Status: ${status}, Info: ${infoBank}, TipoPag: ${typePayment}`);
            }
          } catch (e) {
            log.error('Erro ao carregar vendorbill', `ID: ${transId} - ${e.message}`);
          }
        }

        const newRec = record.create({
          type: 'customrecord5632',
          isDynamic: true
        });

        newRec.setValue({ fieldId: 'custrecord1', value: cnabId });
        newRec.setValue({ fieldId: 'custrecord2', value: transId });
        newRec.setValue({ fieldId: 'name', value: transType });

        if (installmentNumber) {
          newRec.setValue({ fieldId: 'custrecord9', value: installmentNumber });
        }

        if (entityId) {
          newRec.setValue({ fieldId: 'custrecord3', value: entityId });

          const prefSearch = search.create({
            type: 'customrecord_brl_vendor_payment_prefer',
            filters: [
              ['isinactive', 'is', 'F'],
              'AND',
              ['custrecord_brl_venpaytpref_l_vendor', 'anyof', entityId]
            ],
            columns: [
              search.createColumn({ name: 'internalid' }),
              search.createColumn({ name: 'custrecord_brl_venpaytpref_t_acct_number' }),
              search.createColumn({ name: 'custrecord_brl_venpaytpref_t_acct_digit' }),
              search.createColumn({ name: 'custrecord_brl_venpaytpref_t_branch' }),
              search.createColumn({ name: 'custrecord_brl_venpaytpref_l_branch_dig' })
            ]
          });

          const results = prefSearch.run().getRange({ start: 0, end: 1 });

          if (results && results.length > 0) {
            const prefRec = results[0];
            const prefId = prefRec.getValue({ name: 'internalid' });
            const accountNumber = prefRec.getValue({ name: 'custrecord_brl_venpaytpref_t_acct_number' });
            const digAccountNumber = prefRec.getValue({ name: 'custrecord_brl_venpaytpref_t_acct_digit' });
            const agenciaNumber = prefRec.getValue({ name: 'custrecord_brl_venpaytpref_t_branch' });
            const digAgenciaNumber = prefRec.getValue({ name: 'custrecord_brl_venpaytpref_l_branch_dig' });

            newRec.setValue({ fieldId: 'custrecord5', value: prefId });

            if (accountNumber) {
              newRec.setValue({ fieldId: 'custrecord4', value: accountNumber });
              newRec.setValue({ fieldId: 'custrecord6', value: digAccountNumber });
              newRec.setValue({ fieldId: 'custrecord7', value: agenciaNumber });
              newRec.setValue({ fieldId: 'custrecord8', value: digAgenciaNumber });
            }

            log.debug('Preferência de pagamento localizada', `vendor: ${entityId}, prefer ID: ${prefId}, conta: ${accountNumber}`);
          } else {
            log.debug('Nenhuma preferência de pagamento encontrada', `vendor: ${entityId}`);
          }
        }

        const newId = newRec.save();
        log.debug('Registro customrecord5632 criado', `ID: ${newId}, transId: ${transId}, tipo: ${transType}, entity: ${entityId}`);
      });

      record.submitFields({
        type: 'customrecord_brl_cnab_delivery_file',
        id: cnabId,
        values: {
          custrecord_processado: true
        }
      });

    } catch (e) {
      log.error('Erro ao processar IDs CNAB', e);
      throw e;
    }
  }

  return {
    onAction
  };
});
