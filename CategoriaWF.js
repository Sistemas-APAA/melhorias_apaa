/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/record'], function (record) {

    function onAction(scriptContext) {
        try {
            var rec = scriptContext.newRecord;

            // Verifica se o campo 'account' foi alterado e se é o ID 351
            var accountId = rec.getValue('account');
            if (accountId === 351) {
                // Preenche o campo 'custpage_brl_tran_l_def_edoc_category' com 2
                rec.setValue({
                    fieldId: 'custpage_brl_tran_l_def_edoc_category',
                    value: 2
                });

                // Preenche o campo 'custpage_brl_tran_l_transaction_nature' com 1
                rec.setValue({
                    fieldId: 'custpage_brl_tran_l_transaction_nature',
                    value: 1
                });
            }
        } catch (e) {
            log.error('Erro no Workflow Action Script', e.message);
        }
    }

    return {
        onAction: onAction
    };
});
