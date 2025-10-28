/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/currentRecord'], function(currentRecord) {

    function pageInit(context) {
        try {
            var record = context.currentRecord;
            
            // Verifica se o registro é uma Requisição de Compra
            if (record.type !== 'purchaserequisition') {
                return;
            }

            var sublistId = 'item';
            var fieldId = 'location';
            
            // Remove a obrigatoriedade no nível do campo (todas as linhas)
            var field = record.getSublistField({
                sublistId: sublistId,
                fieldId: fieldId
            });

            if (field) {
                field.isMandatory = false; // Remove a obrigatoriedade
                console.log('Obrigatoriedade do campo Location removida com sucesso.');
            }

        } catch (error) {
            console.error('Erro ao remover obrigatoriedade do campo Location:', error);
        }
    }

    return {
        pageInit: pageInit
    };
});
