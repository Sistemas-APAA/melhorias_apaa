/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope Public
 */
define(['N/currentRecord'], function (currentRecord) {

    function fieldChanged(context) {
        try {
            var rec = context.currentRecord;

            // Verifica se o campo editado foi 'account'
            if (context.fieldId === 'account') {
                var accountId = rec.getValue('account');

                // Se o ID da conta for 351, preenche os campos desejados
                if (accountId === 351) {
                    rec.setValue({
                        fieldId: 'custpage_brl_tran_l_def_edoc_category',
                        value: 2
                    });

                    rec.setValue({
                        fieldId: 'custpage_brl_tran_l_transaction_nature',
                        value: 1
                    });
                }
            }
        } catch (e) {
            console.error('Erro no Client Script', e.message);
        }
    }

    return {
        fieldChanged: fieldChanged
    };
});
