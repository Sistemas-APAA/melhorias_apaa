/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/log', 'N/search'], function (record, log, search) {

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

      splitIds.forEach(function (obj) {
        const transId = obj.cleanId;
        const installmentNumber = obj.numero;
        var transType = null;
        var entityId = null;

        const newRec = record.create({
          type: 'customrecord5632',
          isDynamic: true
        });

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

        newRec.setValue({ fieldId: 'name', value: transType || 'Desconhecido' });

        if (transType === 'vendorbill') {
          try {
            const vbRecord = record.load({
              type: 'vendorbill',
              id: transId,
              isDynamic: false
            });

            entityId = vbRecord.getValue('entity');
            const installmentLineCount = vbRecord.getLineCount({ sublistId: 'installment' });

            for (let i = 0; i < installmentLineCount; i++) {
              let dueDate = vbRecord.getSublistValue({ sublistId: 'installment', fieldId: 'duedate', line: i });
              let amount = vbRecord.getSublistValue({ sublistId: 'installment', fieldId: 'amount', line: i });
              let metodoPagamento = vbRecord.getSublistValue({ sublistId: 'installment', fieldId: 'custrecord_brl_inst_l_pay_method', line: i });
              let typePayment = vbRecord.getSublistValue({ sublistId: 'installment', fieldId: 'custrecord_brl_inst_l_type_payment', line: i });
              let camaraCentralizadora = vbRecord.getSublistValue({ sublistId: 'installment', fieldId: 'custrecord_brl_inst_l_cent_clear_house', line: i });
              let finalidadeTed = vbRecord.getSublistValue({ sublistId: 'installment', fieldId: 'custrecord_brl_inst_l_ted_purpose', line: i });

              newRec.setValue({ fieldId: 'custrecord_cnab_link', value: cnabId });
              newRec.setValue({ fieldId: 'custrecord_num_transacao', value: transId });
              newRec.setValue({ fieldId: 'custrecord_cnab_parcela', value: installmentNumber });
              newRec.setValue({ fieldId: 'custrecord_cnab_data_pagto', value: dueDate });
              newRec.setValue({ fieldId: 'custrecord_cnab_valor', value: amount });
              newRec.setValue({ fieldId: 'custrecord_cnab_metodo_pagto', value: metodoPagamento });
              newRec.setValue({ fieldId: 'custrecord_cnab_tipo_pgto', value: typePayment });
              newRec.setValue({ fieldId: 'custrecord_cnab_camara_centr', value: camaraCentralizadora });
              newRec.setValue({ fieldId: 'custrecord_cnab_fin_ted', value: finalidadeTed });
            }
          } catch (e) {
            log.error('Erro ao carregar vendorbill', `ID: ${transId} - ${e.message}`);
          }

          if (entityId) {
            newRec.setValue({ fieldId: 'custrecord_cnab_fornecedor', value: entityId });

            const prefSearch = search.create({
              type: 'customrecord_brl_vendor_payment_prefer',
              filters: [
                ['isinactive', 'is', 'F'],
                'AND',
                ['custrecord_brl_venpaytpref_l_vendor', 'anyof', entityId]
              ],
              columns: [
                search.createColumn({ name: 'internalid' }),
                search.createColumn({ name: 'custrecord_brl_venpaytpref_l_bank' }),
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
              const bancoNumber = prefRec.getValue({ name: 'custrecord_brl_venpaytpref_l_bank' });
              const digAccountNumber = prefRec.getValue({ name: 'custrecord_brl_venpaytpref_t_acct_digit' });
              const agenciaNumber = prefRec.getValue({ name: 'custrecord_brl_venpaytpref_t_branch' });
              const digAgenciaNumber = prefRec.getValue({ name: 'custrecord_brl_venpaytpref_l_branch_dig' });

              newRec.setValue({ fieldId: 'custrecord_cnab_pref_pgto', value: prefId });
              if (accountNumber) {
                newRec.setValue({ fieldId: 'custrecord_cnab_conta', value: accountNumber });
                newRec.setValue({ fieldId: 'custrecord_cnab_dig_conta', value: digAccountNumber });
                newRec.setValue({ fieldId: 'custrecord_cnab_agencia', value: agenciaNumber });
                newRec.setValue({ fieldId: 'custrecord_cnab_dig_agencia', value: digAgenciaNumber });
                newRec.setValue({ fieldId: 'custrecord_cnab_banco', value: bancoNumber });
              }
              log.debug('Preferência de pagamento localizada', `vendor: ${entityId}, prefer ID: ${prefId}, conta: ${accountNumber}`);
            } else {
              log.debug('Nenhuma preferência de pagamento encontrada', `vendor: ${entityId}`);
            }
          }
        }
        if (transType === 'vendorprepayment') {
          try {
            const prepaymentRecord = record.load({
              type: 'vendorprepayment',
              id: transId,
              isDynamic: false
            });
            var entityId = prepaymentRecord.getValue('entity');
            let dueDate = prepaymentRecord.getValue('trandate');
            let amount = prepaymentRecord.getValue('payment');
            let metodoPagamento = prepaymentRecord.getValue('custbody_brl_tran_l_payment_method');
            let typePayment = prepaymentRecord.getValue('custbody_brl_tran_l_type_of_payment');
            let camaraCentralizadora = prepaymentRecord.getValue('custbody_brl_tran_l_cent_clear_house');
            let finalidadeTed = prepaymentRecord.getValue('custbody_brl_tran_l_ted_purpose');

            newRec.setValue({ fieldId: 'custrecord_cnab_link', value: cnabId });
            newRec.setValue({ fieldId: 'custrecord_num_transacao', value: transId });
            newRec.setValue({ fieldId: 'custrecord_cnab_parcela', value: installmentNumber });
            newRec.setValue({ fieldId: 'custrecord_cnab_data_pagto', value: dueDate });
            newRec.setValue({ fieldId: 'custrecord_cnab_valor', value: amount });
            newRec.setValue({ fieldId: 'custrecord_cnab_metodo_pagto', value: metodoPagamento });
            newRec.setValue({ fieldId: 'custrecord_cnab_tipo_pgto', value: typePayment });
            newRec.setValue({ fieldId: 'custrecord_cnab_camara_centr', value: camaraCentralizadora });
            newRec.setValue({ fieldId: 'custrecord_cnab_fin_ted', value: finalidadeTed });
          }catch (e) {
            log.error('Erro ao carregar vendorprepeyment', `ID: ${transId} - ${e.message}`);
          }
          
          if (entityId) {
            newRec.setValue({ fieldId: 'custrecord_cnab_fornecedor', value: entityId });

            const prefSearch = search.create({
              type: 'customrecord_brl_vendor_payment_prefer',
              filters: [
                ['isinactive', 'is', 'F'],
                'AND',
                ['custrecord_brl_venpaytpref_l_vendor', 'anyof', entityId]
              ],
              columns: [
                search.createColumn({ name: 'internalid' }),
                search.createColumn({ name: 'custrecord_brl_venpaytpref_l_bank' }),
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
              const bancoNumber = prefRec.getValue({ name: 'custrecord_brl_venpaytpref_l_bank' });
              const digAccountNumber = prefRec.getValue({ name: 'custrecord_brl_venpaytpref_t_acct_digit' });
              const agenciaNumber = prefRec.getValue({ name: 'custrecord_brl_venpaytpref_t_branch' });
              const digAgenciaNumber = prefRec.getValue({ name: 'custrecord_brl_venpaytpref_l_branch_dig' });

              newRec.setValue({ fieldId: 'custrecord_cnab_pref_pgto', value: prefId });
              if (accountNumber) {
                newRec.setValue({ fieldId: 'custrecord_cnab_conta', value: accountNumber });
                newRec.setValue({ fieldId: 'custrecord_cnab_dig_conta', value: digAccountNumber });
                newRec.setValue({ fieldId: 'custrecord_cnab_agencia', value: agenciaNumber });
                newRec.setValue({ fieldId: 'custrecord_cnab_dig_agencia', value: digAgenciaNumber });
                newRec.setValue({ fieldId: 'custrecord_cnab_banco', value: bancoNumber });
              }
              log.debug('Preferência de pagamento localizada', `vendor: ${entityId}, prefer ID: ${prefId}, conta: ${accountNumber}`);
            } else {
              log.debug('Nenhuma preferência de pagamento encontrada', `vendor: ${entityId}`);
            }
          }
        }

        if (transType === 'expensereport') {
          try {
            const expenseRecord = record.load({
              type: 'expensereport',
              id: transId,
              isDynamic: false
            });

            var _entityId = expenseRecord.getValue('entity');
            let dueDate = expenseRecord.getValue('trandate');
            let amount = expenseRecord.getValue('payment');
            let metodoPagamento = expenseRecord.getValue('custbody_brl_tran_l_payment_method');
            let typePayment = expenseRecord.getValue('custbody_brl_tran_l_type_of_payment');
            let camaraCentralizadora = expenseRecord.getValue('custbody_brl_tran_l_cent_clear_house');
            let finalidadeTed = expenseRecord.getValue('custbody_brl_tran_l_ted_purpose');

            newRec.setValue({ fieldId: 'custrecord_cnab_funcionario', value: _entityId });
            newRec.setValue({ fieldId: 'custrecord_cnab_link', value: cnabId });
            newRec.setValue({ fieldId: 'custrecord_num_transacao', value: transId });
            newRec.setValue({ fieldId: 'custrecord_cnab_parcela', value: installmentNumber });
            newRec.setValue({ fieldId: 'custrecord_cnab_data_pagto', value: dueDate });
            newRec.setValue({ fieldId: 'custrecord_cnab_valor', value: amount });
            newRec.setValue({ fieldId: 'custrecord_cnab_metodo_pagto', value: metodoPagamento });
            newRec.setValue({ fieldId: 'custrecord_cnab_tipo_pgto', value: typePayment });
            newRec.setValue({ fieldId: 'custrecord_cnab_camara_centr', value: camaraCentralizadora });
            newRec.setValue({ fieldId: 'custrecord_cnab_fin_ted', value: finalidadeTed });
          }catch (e) {
            log.error('Erro ao carregar expensereport', `ID: ${transId} - ${e.message}`);
          }
          if (_entityId) {
            const prefSearch = search.create({
              type: 'employee',
              filters: 
                     ['internalid', 'anyof', _entityId],
              columns: [
                search.createColumn({ name: 'internalid' }),
                search.createColumn({ name: 'custentity_brl_employee_l_bank' }),
                search.createColumn({ name: 'custentity_brl_employee_t_acct_number' }),
                search.createColumn({ name: 'custentity_brl_employee_t_acct_chk_dig' }),
                search.createColumn({ name: 'custentity_brl_employee_t_branch_number' }),
                search.createColumn({ name: 'custentity_brl_employee_t_branch_chk_dig' })
              ]
            });
            const results = prefSearch.run().getRange({ start: 0, end: 1 });

            if (results && results.length > 0) {
              const prefSearch = results[0];
              const prefId = prefSearch.getValue({ name: 'id' });
              const bancoNumber = prefSearch.getValue({ name: 'custentity_brl_employee_l_bank' });
              const accountNumber = prefSearch.getValue({ name: 'custentity_brl_employee_t_acct_number' });
              const digAccountNumber = prefSearch.getValue({ name: 'custentity_brl_employee_t_acct_chk_dig' });
              const agenciaNumber = prefSearch.getValue({ name: 'custentity_brl_employee_t_branch_number' });
              const digAgenciaNumber = prefSearch.getValue({ name: 'custentity_brl_employee_t_branch_chk_dig' });

              newRec.setValue({ fieldId: 'custrecord_cnab_pref_pgto', value: prefId });
              if (accountNumber) {
                newRec.setValue({ fieldId: 'custrecord_cnab_conta', value: accountNumber });
                newRec.setValue({ fieldId: 'custrecord_cnab_dig_conta', value: digAccountNumber });
                newRec.setValue({ fieldId: 'custrecord_cnab_agencia', value: agenciaNumber });
                newRec.setValue({ fieldId: 'custrecord_cnab_dig_agencia', value: digAgenciaNumber });
                newRec.setValue({ fieldId: 'custrecord_cnab_banco', value: bancoNumber });
              }
              log.debug('Preferência de pagamento localizada', `vendor: ${entityId}, prefer ID: ${prefId}, conta: ${accountNumber}`);
            } else {
              log.debug('Nenhuma preferência de pagamento encontrada', `vendor: ${entityId}`);
            }
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